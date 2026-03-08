// Coach Mode — wall-mounted display for group follow-along
// Extra-large text readable from 15+ feet, auto-advancing timers, minimal chrome

import { getRoutine } from '../data/routines.js';
import { exercises as exerciseLib } from '../data/exercises.js';
import { defaultStations } from '../data/stations.js';
import { forgeSequence, recedeSequence } from '../data/mobility.js';
import { audio } from '../utils/audio.js';
import { store } from '../models/store.js';
import { hideNav } from '../components/nav.js';

let state = null;
let cueInterval = null;
let timerInterval = null;

function initCoachState(routineId) {
  const routine = getRoutine(routineId);
  if (!routine) return null;

  const allLogs = store.getWorkoutLogs();
  const weekNumber = allLogs.length > 0
    ? Math.floor((new Date() - new Date(allLogs[0].date)) / (7 * 86400000))
    : 0;
  const isDeload = weekNumber > 0 && weekNumber % 3 === 0;
  const rounds = isDeload ? routine.deloadRounds : routine.rounds;

  return {
    routineId,
    routine,
    phase: 'forge',
    currentRound: 1,
    totalRounds: rounds,
    isDeload,
    stationIndex: 0,
    exerciseIndex: 0,
    mobilityIndex: 0,
    timerStart: null,
    timerTarget: 0,
    elapsed: 0,
    lastStationId: null,
  };
}

export function renderCoach(container, routineId) {
  hideNav();
  document.body.classList.add('in-coach');

  state = initCoachState(routineId);
  if (!state) {
    window.location.hash = '#home';
    return;
  }

  renderCurrentPhase(container);
}

function cleanup() {
  if (cueInterval) { clearInterval(cueInterval); cueInterval = null; }
  if (timerInterval) { clearInterval(timerInterval); timerInterval = null; }
}

function renderCurrentPhase(container) {
  cleanup();

  switch (state.phase) {
    case 'forge': renderCoachMobility(container, forgeSequence, 'FORGE'); break;
    case 'storm': renderCoachExercise(container); break;
    case 'recede': renderCoachMobility(container, recedeSequence, 'RECEDE'); break;
    case 'done': renderCoachDone(container); break;
  }
}

// ── Shared layout builder ──

function coachLayout({ phase, station, round, exercise, cueEl, timerTarget, onNext, onAutoAdvance, container }) {
  const circuit = state.routine.phases[0];
  const totalEx = circuit
    ? circuit.stations.reduce((s, st) => s + st.exercises.length, 0)
    : 0;
  const currentExNum = circuit
    ? circuit.stations.slice(0, state.stationIndex).reduce((s, st) => s + st.exercises.length, 0) + state.exerciseIndex + 1
    : 0;

  const roundText = state.phase === 'storm'
    ? `ROUND ${state.currentRound} of ${state.totalRounds}`
    : '';

  const progressText = state.phase === 'storm'
    ? `${currentExNum} / ${totalEx}`
    : state.phase === 'forge' || state.phase === 'recede'
      ? ''
      : '';

  container.innerHTML = `
    <div class="coach-screen">
      <div class="coach-header">
        <div class="coach-phase coach-phase--${phase.toLowerCase()}">${phase}</div>
        ${station ? `<div class="coach-station">${station}</div>` : ''}
        ${roundText ? `<div class="coach-round">${roundText}${progressText ? ' &mdash; ' + progressText : ''}</div>` : ''}
      </div>

      <div class="coach-body">
        <div class="coach-exercise">${exercise}</div>
        <div class="coach-cue" id="coach-cue">${cueEl || ''}</div>
        <div class="coach-timer" id="coach-timer">0:00</div>
      </div>

      <button class="coach-next" id="coach-next">NEXT</button>
      <button class="coach-exit" id="coach-exit">EXIT</button>
    </div>
  `;

  // Start timer
  state.timerTarget = timerTarget || 0;
  state.timerStart = Date.now();
  state.elapsed = 0;

  const timerEl = container.querySelector('#coach-timer');
  let completed = false;

  timerInterval = setInterval(() => {
    state.elapsed = (Date.now() - state.timerStart) / 1000;

    if (state.timerTarget > 0) {
      // Countdown
      const remaining = Math.max(0, Math.ceil(state.timerTarget - state.elapsed));
      const min = Math.floor(remaining / 60);
      const sec = remaining % 60;
      timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;

      if (remaining <= 5 && remaining > 0) {
        timerEl.classList.add('coach-timer--warn');
      }
      if (remaining <= 3 && remaining > 0 && !completed) {
        const settings = store.getSettings();
        if (settings.soundEnabled) audio.beep();
      }
      if (remaining <= 0 && !completed) {
        completed = true;
        timerEl.classList.remove('coach-timer--warn');
        timerEl.classList.add('coach-timer--done');
        timerEl.textContent = '0:00';
        const settings = store.getSettings();
        if (settings.soundEnabled) audio.beepFinal();
        if (onAutoAdvance) {
          setTimeout(() => onAutoAdvance(), 1500);
        }
      }
    } else {
      // Stopwatch (count up)
      const secs = Math.floor(state.elapsed);
      const min = Math.floor(secs / 60);
      const sec = secs % 60;
      timerEl.textContent = `${min}:${sec.toString().padStart(2, '0')}`;
    }
  }, 200);

  // NEXT button
  container.querySelector('#coach-next').addEventListener('click', () => {
    const settings = store.getSettings();
    if (settings.soundEnabled) audio.tap();
    onNext();
  });

  // EXIT button
  container.querySelector('#coach-exit').addEventListener('click', () => {
    cleanup();
    document.body.classList.remove('in-coach');
    window.location.hash = '#home';
  });
}

// ── FORGE / RECEDE ──

function renderCoachMobility(container, sequence, phaseName) {
  const movement = sequence.movements[state.mobilityIndex];
  if (!movement) {
    if (phaseName === 'FORGE') {
      state.phase = 'storm';
      state.stationIndex = 0;
      state.exerciseIndex = 0;
      state.lastStationId = null;
    } else {
      state.phase = 'done';
    }
    renderCurrentPhase(container);
    return;
  }

  const progress = `${state.mobilityIndex + 1} / ${sequence.movements.length}`;

  function advance() {
    state.mobilityIndex++;
    renderCoachMobility(container, sequence, phaseName);
  }

  coachLayout({
    phase: phaseName,
    station: phaseName === 'FORGE' ? 'Mobility Warmup' : 'Flexibility Cooldown',
    round: progress,
    exercise: movement.name,
    cueEl: movement.cue,
    timerTarget: movement.seconds,
    onNext: advance,
    onAutoAdvance: advance,
    container,
  });

  // Override round display for mobility
  const roundEl = container.querySelector('.coach-round');
  if (roundEl) roundEl.textContent = progress;
}

// ── STORM ──

function getStation() {
  const circuit = state.routine.phases[0];
  if (!circuit || !circuit.stations[state.stationIndex]) return null;
  return circuit.stations[state.stationIndex];
}

function getExercise() {
  const station = getStation();
  if (!station) return null;
  return station.exercises[state.exerciseIndex] || null;
}

function advanceCoachExercise(container) {
  const station = getStation();
  if (!station) return;

  state.exerciseIndex++;
  if (state.exerciseIndex >= station.exercises.length) {
    state.stationIndex++;
    state.exerciseIndex = 0;
  }

  state.phase = 'storm';
  renderCurrentPhase(container);
}

function renderCoachExercise(container) {
  const station = getStation();
  const exerciseDef = getExercise();

  if (!station || !exerciseDef) {
    // Next round or done
    if (state.currentRound < state.totalRounds) {
      state.currentRound++;
      state.stationIndex = 0;
      state.exerciseIndex = 0;
      state.lastStationId = null;
      renderCurrentPhase(container);
    } else {
      state.phase = 'recede';
      state.mobilityIndex = 0;
      renderCurrentPhase(container);
    }
    return;
  }

  state.lastStationId = station.stationId;

  const ex = exerciseLib[exerciseDef.exerciseId];
  if (!ex) {
    advanceCoachExercise(container);
    return;
  }

  const stationInfo = defaultStations[station.stationId] || { name: station.stationId, icon: '' };
  const stationDisplay = `${stationInfo.icon || ''} ${stationInfo.name}`;

  // Pick a random starting cue, cycle through all
  const cues = ex.cues || [];
  let cueIndex = Math.floor(Math.random() * cues.length);

  // Determine timer target
  let timerTarget = 0;
  let autoAdvance = null;

  if (ex.trackingType === 'timed' || ex.trackingType === 'hold') {
    timerTarget = exerciseDef.seconds || ex.defaultSeconds || 0;
    if (timerTarget > 0) {
      autoAdvance = () => advanceCoachExercise(container);
    }
  }

  // For reps: show rep count in exercise name
  let exerciseDisplay = ex.name;
  if (ex.trackingType === 'reps') {
    const reps = exerciseDef.reps || ex.defaultReps || 0;
    if (reps > 0) exerciseDisplay = `${ex.name} x${reps}`;
  }

  coachLayout({
    phase: 'STORM',
    station: stationDisplay,
    exercise: exerciseDisplay,
    cueEl: cues[cueIndex] || '',
    timerTarget,
    onNext: () => advanceCoachExercise(container),
    onAutoAdvance: autoAdvance,
    container,
  });

  // Cycle cues every 5 seconds
  if (cues.length > 1) {
    const cueEl = container.querySelector('#coach-cue');
    cueInterval = setInterval(() => {
      cueIndex = (cueIndex + 1) % cues.length;
      if (cueEl) {
        cueEl.style.opacity = '0';
        setTimeout(() => {
          cueEl.textContent = cues[cueIndex];
          cueEl.style.opacity = '1';
        }, 300);
      }
    }, 5000);
  }
}

// ── DONE ──

function renderCoachDone(container) {
  cleanup();

  const settings = store.getSettings();
  if (settings.soundEnabled) audio.complete();

  container.innerHTML = `
    <div class="coach-screen">
      <div class="coach-body" style="justify-content: center;">
        <div class="coach-phase coach-phase--done">COMPLETE</div>
        <div class="coach-exercise" style="margin-top: 24px;">
          ${state.routine.icon} ${state.routine.name}
        </div>
        <div class="coach-cue">${state.isDeload ? 'Deload Session' : `${state.totalRounds} Rounds`}</div>
      </div>
      <button class="coach-next" id="coach-exit-final">DONE</button>
    </div>
  `;

  container.querySelector('#coach-exit-final').addEventListener('click', () => {
    document.body.classList.remove('in-coach');
    window.location.hash = '#home';
  });
}

// Cleanup on navigation away
window.addEventListener('hashchange', () => {
  if (!window.location.hash.startsWith('#coach')) {
    cleanup();
    document.body.classList.remove('in-coach');
  }
});
