// Active workout screen — state machine driving the workout flow
// States: forge → transit → exercise → (repeat) → recede → summary

import { getRoutine } from '../data/routines.js';
import { exercises as exerciseLib } from '../data/exercises.js';
import { defaultStations, getTransitTime, formatTransitTime } from '../data/stations.js';
import { forgeSequence, recedeSequence } from '../data/mobility.js';
import { Timer } from '../components/timer.js';
import { RepCounter } from '../components/rep-counter.js';
import { store } from '../models/store.js';
import { createWorkoutLog, addExerciseEntry, finalizeLog, getLogDurationMinutes, getLogTotalReps } from '../models/workout-log.js';
import { audio } from '../utils/audio.js';
import { hideNav } from '../components/nav.js';
import { showExerciseModal } from '../components/exercise-modal.js';

// Workout state
let state = null;

function initState(routineId) {
  const routine = getRoutine(routineId);
  if (!routine) return null;

  // Determine rounds (deload check)
  const allLogs = store.getWorkoutLogs();
  const weekNumber = allLogs.length > 0
    ? Math.floor((new Date() - new Date(allLogs[0].date)) / (7 * 86400000))
    : 0;
  const isDeload = weekNumber > 0 && weekNumber % 3 === 0;
  const rounds = isDeload ? routine.deloadRounds : routine.rounds;

  return {
    routineId,
    routine,
    phase: 'forge', // forge | storm | transit | recede | summary
    currentRound: 1,
    totalRounds: rounds,
    isDeload,
    stationIndex: 0,
    exerciseIndex: 0,
    mobilityIndex: 0,
    log: createWorkoutLog(routineId),
    timer: null,
    repCounter: null,
    lastStationId: null,
  };
}

export function renderWorkout(container, routineId) {
  hideNav();
  document.body.classList.add('in-workout');

  // Resume or fresh start
  if (routineId === 'resume') {
    const saved = store.getCurrentWorkout();
    if (saved) {
      state = saved;
      state.routine = getRoutine(state.routineId);
    } else {
      window.location.hash = '#home';
      return;
    }
  } else {
    state = initState(routineId);
    if (!state) {
      window.location.hash = '#home';
      return;
    }
  }

  renderCurrentPhase(container);
}

function saveState() {
  if (!state) return;
  // Save minimal state for resume (strip non-serializable)
  const toSave = { ...state, timer: null, repCounter: null };
  store.saveCurrentWorkout(toSave);
}

function renderCurrentPhase(container) {
  cleanup();

  switch (state.phase) {
    case 'forge': renderMobility(container, forgeSequence, 'forge'); break;
    case 'storm': renderStormExercise(container); break;
    case 'transit': renderTransit(container); break;
    case 'recede': renderMobility(container, recedeSequence, 'recede'); break;
    case 'summary': renderSummary(container); break;
  }
  saveState();
}

// ── FORGE / RECEDE (Mobility) ──

function renderMobility(container, sequence, phase) {
  const movement = sequence.movements[state.mobilityIndex];
  if (!movement) {
    // Done with this mobility phase
    if (phase === 'forge') {
      state.phase = 'storm';
      state.stationIndex = 0;
      state.exerciseIndex = 0;
      state.lastStationId = null;
      // Check if first station needs transit
      const firstStation = getCurrentStation();
      if (firstStation && state.lastStationId !== firstStation.stationId) {
        state.phase = 'transit';
      } else {
        state.phase = 'storm';
      }
      renderCurrentPhase(container);
    } else {
      state.phase = 'summary';
      renderCurrentPhase(container);
    }
    return;
  }

  const progress = `${state.mobilityIndex + 1} / ${sequence.movements.length}`;
  const phaseName = phase === 'forge' ? 'FORGE' : 'RECEDE';
  const phaseDesc = phase === 'forge' ? 'Mobility Warmup' : 'Flexibility Cooldown';

  container.innerHTML = `
    <div class="workout-screen">
      <div class="workout-phase-label">${phaseName}</div>
      <div class="workout-round">${phaseDesc} \u2014 ${progress}</div>
      <div class="workout-exercise-name">${movement.name}</div>
      <div class="workout-cue">${movement.cue}</div>
      <div id="timer-container"></div>
      <button class="btn-done" id="btn-next">DONE \u2192 NEXT</button>
      <button class="btn btn-secondary btn-small mt-16" id="btn-skip-mobility"
              style="width: 100%; font-size: 13px; min-height: 44px;">
        Skip ${phaseName}
      </button>
      ${renderQuitButton()}
    </div>
  `;

  const timerContainer = container.querySelector('#timer-container');
  state.timer = new Timer(timerContainer, {
    mode: 'countdown',
    targetSeconds: movement.seconds,
    onComplete: () => {
      audio.beepFinal();
    }
  });
  state.timer.start();

  // Beep on last 3 seconds
  let beeped = {};
  const origTick = state.timer.onTick;
  state.timer.onTick = (elapsed) => {
    const remaining = movement.seconds - elapsed;
    if (remaining <= 3 && remaining > 0 && !beeped[Math.ceil(remaining)]) {
      beeped[Math.ceil(remaining)] = true;
      const settings = store.getSettings();
      if (settings.soundEnabled) audio.beep();
    }
  };

  container.querySelector('#btn-next').addEventListener('click', () => {
    state.mobilityIndex++;
    renderMobility(container, sequence, phase);
  });

  container.querySelector('#btn-skip-mobility').addEventListener('click', () => {
    state.mobilityIndex = sequence.movements.length;
    renderMobility(container, sequence, phase);
  });

  bindQuitButton(container);
}

// ── STORM (Main Circuit) ──

function getCurrentStation() {
  const circuit = state.routine.phases[0]; // Always first phase for now
  if (!circuit || !circuit.stations[state.stationIndex]) return null;
  return circuit.stations[state.stationIndex];
}

function getCurrentExercise() {
  const station = getCurrentStation();
  if (!station) return null;
  return station.exercises[state.exerciseIndex] || null;
}

function renderStormExercise(container) {
  const station = getCurrentStation();
  const exerciseDef = getCurrentExercise();

  if (!station || !exerciseDef) {
    // Move to next round or done
    if (state.currentRound < state.totalRounds) {
      state.currentRound++;
      state.stationIndex = 0;
      state.exerciseIndex = 0;
      state.lastStationId = null;
      // Transit to first station of new round
      const firstStation = getCurrentStation();
      if (firstStation) {
        state.phase = 'transit';
        renderCurrentPhase(container);
      }
    } else {
      // All rounds done — go to RECEDE
      state.phase = 'recede';
      state.mobilityIndex = 0;
      renderCurrentPhase(container);
    }
    return;
  }

  // Check if we need transit
  if (state.lastStationId !== station.stationId) {
    state.phase = 'transit';
    renderTransit(container);
    return;
  }

  const ex = exerciseLib[exerciseDef.exerciseId];
  if (!ex) {
    advanceExercise(container);
    return;
  }

  const stationInfo = defaultStations[station.stationId] || { name: station.stationId };
  const cue = ex.cues[Math.floor(Math.random() * ex.cues.length)];
  const circuit = state.routine.phases[0];
  const totalExInRound = circuit.stations.reduce((s, st) => s + st.exercises.length, 0);
  const currentExNum = circuit.stations.slice(0, state.stationIndex).reduce((s, st) => s + st.exercises.length, 0) + state.exerciseIndex + 1;

  container.innerHTML = `
    <div class="workout-screen">
      <div class="workout-phase-label">STORM</div>
      <div class="workout-round">Round ${state.currentRound}/${state.totalRounds} \u2014 ${currentExNum}/${totalExInRound}</div>
      <div class="workout-station">${stationInfo.icon || ''} ${stationInfo.name}</div>
      <div class="workout-exercise-name exercise-tappable" id="exercise-name-tap" data-exercise-id="${ex.id}">${ex.name}</div>
      <div class="workout-cue">${cue}</div>
      <div id="input-container"></div>
      <button class="btn-done" id="btn-done">DONE \u2192 NEXT</button>
      ${renderQuitButton()}
    </div>
  `;

  const inputContainer = container.querySelector('#input-container');

  if (ex.trackingType === 'reps') {
    state.repCounter = new RepCounter(inputContainer, {
      initial: exerciseDef.reps || ex.defaultReps || 0,
      target: exerciseDef.reps || ex.defaultReps || 0,
    });
    // Also show a stopwatch for timing
    state.timer = new Timer(inputContainer, { mode: 'stopwatch' });
    state.timer.start();
  } else if (ex.trackingType === 'timed' || ex.trackingType === 'hold') {
    const targetSec = exerciseDef.seconds || ex.defaultSeconds || 0;
    if (targetSec > 0) {
      state.timer = new Timer(inputContainer, {
        mode: 'countdown',
        targetSeconds: targetSec,
        onComplete: () => {
          const settings = store.getSettings();
          if (settings.soundEnabled) audio.beepFinal();
        }
      });
    } else {
      state.timer = new Timer(inputContainer, { mode: 'stopwatch' });
    }
    state.timer.start();

    // Countdown beeps
    if (targetSec > 0) {
      let beeped = {};
      state.timer.onTick = (elapsed) => {
        const remaining = targetSec - elapsed;
        if (remaining <= 3 && remaining > 0 && !beeped[Math.ceil(remaining)]) {
          beeped[Math.ceil(remaining)] = true;
          const settings = store.getSettings();
          if (settings.soundEnabled) audio.beep();
        }
      };
    }
  }

  container.querySelector('#btn-done').addEventListener('click', () => {
    logCurrentExercise(station.stationId, exerciseDef, ex);
    const settings = store.getSettings();
    if (settings.soundEnabled) audio.tap();
    advanceExercise(container);
  });

  // Tap exercise name for details
  const nameTap = container.querySelector('#exercise-name-tap');
  if (nameTap) {
    nameTap.addEventListener('click', () => showExerciseModal(ex.id));
  }

  bindQuitButton(container);
}

function logCurrentExercise(stationId, exerciseDef, ex) {
  let value = 0;
  if (ex.trackingType === 'reps' && state.repCounter) {
    value = state.repCounter.getCount();
  } else if (state.timer) {
    value = state.timer.getSeconds();
  }

  addExerciseEntry(state.log, {
    exerciseId: exerciseDef.exerciseId,
    stationId,
    round: state.currentRound,
    trackingType: ex.trackingType,
    value
  });
}

function advanceExercise(container) {
  const station = getCurrentStation();
  if (!station) return;

  state.exerciseIndex++;
  if (state.exerciseIndex >= station.exercises.length) {
    // Move to next station
    state.stationIndex++;
    state.exerciseIndex = 0;
  }

  state.phase = 'storm';
  renderCurrentPhase(container);
}

// ── TRANSIT ──

function renderTransit(container) {
  const station = getCurrentStation();
  if (!station) {
    state.phase = 'storm';
    renderCurrentPhase(container);
    return;
  }

  const stationInfo = defaultStations[station.stationId] || { name: station.stationId, icon: '' };
  const fromId = state.lastStationId || 'house';
  const transitSeconds = getTransitTime(fromId, station.stationId);
  const transitStr = formatTransitTime(transitSeconds);

  container.innerHTML = `
    <div class="workout-screen">
      <div class="transit-screen">
        <div class="transit-icon">${stationInfo.icon || '\u2192'}</div>
        <div class="transit-destination">Walk to ${stationInfo.name}</div>
        <div class="transit-time">${transitStr} \u2014 walk all descents</div>
        <div id="timer-container"></div>
        <button class="btn-done" id="btn-arrived" style="margin-top: 24px;">I'M HERE</button>
      </div>
      ${renderQuitButton()}
    </div>
  `;

  const timerContainer = container.querySelector('#timer-container');
  state.timer = new Timer(timerContainer, { mode: 'stopwatch' });
  state.timer.start();

  container.querySelector('#btn-arrived').addEventListener('click', () => {
    const settings = store.getSettings();
    if (settings.soundEnabled) audio.horn();
    state.lastStationId = station.stationId;
    state.phase = 'storm';
    renderCurrentPhase(container);
  });

  bindQuitButton(container);
}

// ── SUMMARY ──

function renderSummary(container) {
  document.body.classList.remove('in-workout');
  const settings = store.getSettings();
  if (settings.soundEnabled) audio.complete();

  const duration = getLogDurationMinutes(state.log);
  const totalReps = getLogTotalReps(state.log);
  const totalExercises = state.log.exercises.length;

  // Group exercises by name for summary
  const byExercise = {};
  state.log.exercises.forEach(e => {
    const ex = exerciseLib[e.exerciseId];
    const name = ex ? ex.name : e.exerciseId;
    if (!byExercise[name]) byExercise[name] = { entries: [], trackingType: e.trackingType };
    byExercise[name].entries.push(e);
  });

  const exerciseSummary = Object.entries(byExercise).map(([name, data]) => {
    let display;
    if (data.trackingType === 'reps') {
      const total = data.entries.reduce((s, e) => s + e.value, 0);
      const sets = data.entries.length;
      display = `${total} reps (${sets} sets)`;
    } else {
      const total = data.entries.reduce((s, e) => s + e.value, 0);
      const min = Math.floor(total / 60);
      const sec = total % 60;
      display = min > 0 ? `${min}m ${sec}s total` : `${total}s total`;
    }
    return `
      <div class="summary-exercise">
        <span>${name}</span>
        <span class="value">${display}</span>
      </div>
    `;
  }).join('');

  container.innerHTML = `
    <div class="workout-screen">
      <div style="margin-bottom: 24px;">
        <h1 style="color: var(--success);">COMPLETE</h1>
        <p class="text-dim">${state.routine.icon} ${state.routine.name}${state.isDeload ? ' (Deload)' : ''}</p>
      </div>

      <div class="card">
        <div class="summary-stat">
          <span>Duration</span>
          <span class="text-bone">${duration} min</span>
        </div>
        <div class="summary-stat">
          <span>Exercises</span>
          <span class="text-bone">${totalExercises}</span>
        </div>
        <div class="summary-stat">
          <span>Total Reps</span>
          <span class="text-bone">${totalReps}</span>
        </div>
        <div class="summary-stat">
          <span>Rounds</span>
          <span class="text-bone">${state.currentRound} / ${state.totalRounds}</span>
        </div>
      </div>

      <div class="card">
        <h3>RPE (How Hard?)</h3>
        <div class="rpe-grid">
          ${[1,2,3,4,5,6,7,8,9,10].map(n => `<button class="rpe-btn" data-rpe="${n}">${n}</button>`).join('')}
        </div>
      </div>

      <div class="card">
        <h3>Notes</h3>
        <textarea id="workout-notes" rows="3" placeholder="How did it feel? Anything to remember..."></textarea>
      </div>

      <div class="card">
        <h3>EXERCISES</h3>
        <div class="summary-exercises">${exerciseSummary}</div>
      </div>

      <button class="btn btn-success mt-16" id="btn-save">SAVE WORKOUT</button>
    </div>
  `;

  // RPE selection
  let selectedRPE = null;
  container.querySelectorAll('.rpe-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      container.querySelectorAll('.rpe-btn').forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      selectedRPE = parseInt(btn.dataset.rpe);
    });
  });

  container.querySelector('#btn-save').addEventListener('click', () => {
    const notes = container.querySelector('#workout-notes').value;
    const finalized = finalizeLog(state.log, selectedRPE, notes);
    store.saveWorkoutLog(finalized);
    store.clearCurrentWorkout();
    state = null;
    window.location.hash = '#home';
  });
}

// ── Utilities ──

function renderQuitButton() {
  return `
    <button class="btn btn-secondary btn-small mt-16" id="btn-quit"
            style="width: 100%; font-size: 13px; min-height: 44px; color: var(--text-dim);">
      End Workout Early
    </button>
  `;
}

function bindQuitButton(container) {
  const btn = container.querySelector('#btn-quit');
  if (btn) {
    btn.addEventListener('click', () => {
      if (confirm('End workout early? Progress will be saved.')) {
        state.phase = 'summary';
        renderCurrentPhase(container);
      }
    });
  }
}

function cleanup() {
  if (state && state.timer) {
    state.timer.destroy();
    state.timer = null;
  }
  if (state && state.repCounter) {
    state.repCounter.destroy();
    state.repCounter = null;
  }
}

// Cleanup on navigation away
window.addEventListener('hashchange', () => {
  if (state && !window.location.hash.startsWith('#workout')) {
    cleanup();
    document.body.classList.remove('in-workout');
  }
});
