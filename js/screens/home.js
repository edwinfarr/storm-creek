// Home dashboard screen

import { store } from '../models/store.js';
import { routines, getNextRoutineId, getRoutine } from '../data/routines.js';
import { getLogDurationMinutes, getLogTotalReps } from '../models/workout-log.js';
import { getCalledCountToday, logCalledExercise } from '../utils/notifications.js';
import { calledExercises } from '../data/exercises.js';
import { showExerciseModal } from '../components/exercise-modal.js';

export function renderHome(container) {
  const weekLogs = store.getWeekLogs();
  const allLogs = store.getWorkoutLogs();
  const weekRoutineIds = weekLogs.map(l => l.routineId);
  const nextRoutineId = getNextRoutineId(weekRoutineIds);
  const nextRoutine = getRoutine(nextRoutineId);

  // Resume check
  const savedWorkout = store.getCurrentWorkout();

  const html = `
    <div class="screen">
      <div style="margin-bottom: 20px;">
        <h1>STORM CREEK</h1>
        <p class="subtitle">Caswell County, NC</p>
      </div>

      ${savedWorkout ? renderResumeCard(savedWorkout) : ''}
      ${renderLastWorkoutAlert(allLogs)}
      ${renderCalledBanner()}
      ${renderWeekProgress(weekLogs)}
      ${renderNextWorkout(nextRoutine, weekLogs.length, allLogs)}
      ${renderMetrics(allLogs)}
      ${renderRecentSessions(allLogs.slice(-5).reverse())}
    </div>
  `;

  container.innerHTML = html;
  bindEvents(container, nextRoutineId, savedWorkout);
}

function renderResumeCard(saved) {
  const routine = getRoutine(saved.routineId);
  return `
    <div class="card" style="border-color: var(--accent-ember);">
      <div class="card-header">
        <span style="color: var(--accent-ember); font-weight: 600;">UNFINISHED WORKOUT</span>
      </div>
      <p style="margin-bottom: 12px;">${routine ? routine.name : 'Unknown'} — Round ${saved.currentRound || 1}</p>
      <div style="display: flex; gap: 8px;">
        <button class="btn btn-primary btn-small" id="btn-resume" style="flex: 1;">RESUME</button>
        <button class="btn btn-secondary btn-small" id="btn-discard" style="flex: 0 0 auto;">Discard</button>
      </div>
    </div>
  `;
}

function renderCalledBanner() {
  const count = getCalledCountToday();
  const called = calledExercises[Math.floor(Math.random() * calledExercises.length)];
  return `
    <div class="called-banner" id="called-banner">
      <div>
        <div class="exercise-name">${called.prescription}</div>
        <div class="text-dim" style="font-size: 12px;">Called #${count + 1} today</div>
      </div>
      <button class="btn btn-small badge-blood" id="btn-called-done"
              data-exercise-id="${called.exerciseId}"
              data-prescription="${called.prescription}">DONE</button>
    </div>
  `;
}

function renderLastWorkoutAlert(allLogs) {
  if (allLogs.length === 0) {
    return `
      <div class="card" style="border-color: var(--accent-ember); text-align: center;">
        <div style="font-size: 18px; font-weight: 700; color: var(--accent-ember);">NO SESSIONS YET</div>
        <div class="text-dim mt-8">Time to start. The creek is waiting.</div>
      </div>
    `;
  }

  const lastLog = allLogs[allLogs.length - 1];
  const lastDate = new Date(lastLog.date);
  const now = new Date();
  const diffDays = Math.floor((now - lastDate) / 86400000);

  if (diffDays <= 1) return ''; // Worked out today or yesterday, no nag needed

  let message, borderColor, textColor;
  if (diffDays <= 3) {
    message = `${diffDays} days since last session`;
    borderColor = 'var(--accent-steel)';
    textColor = 'var(--text-dim)';
  } else if (diffDays <= 5) {
    message = `${diffDays} days since last session \u2014 don't break the chain`;
    borderColor = 'var(--accent-ember)';
    textColor = 'var(--accent-ember)';
  } else {
    message = `${diffDays} DAYS. Get out there.`;
    borderColor = 'var(--accent-blood)';
    textColor = 'var(--accent-blood)';
  }

  return `
    <div class="card" style="border-color: ${borderColor}; text-align: center; padding: 12px;">
      <div style="font-size: 16px; font-weight: 700; color: ${textColor};">${message}</div>
    </div>
  `;
}

function renderWeekProgress(weekLogs) {
  const days = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  const now = new Date();
  const currentDay = now.getDay(); // 0=Sun
  const mondayOffset = currentDay === 0 ? 6 : currentDay - 1;

  // Map logs to day-of-week
  const logDays = new Set();
  weekLogs.forEach(l => {
    const d = new Date(l.date);
    const dow = d.getDay();
    const idx = dow === 0 ? 6 : dow - 1;
    logDays.add(idx);
  });

  const dots = days.map((d, i) => {
    let cls = 'week-dot';
    if (logDays.has(i)) cls += ' done';
    else if (i === mondayOffset) cls += ' today';
    else if (i > mondayOffset) cls += ' future';
    else cls += ' future';
    return `<div class="${cls}">${d}</div>`;
  }).join('');

  return `
    <div class="card">
      <h3>THIS WEEK</h3>
      <div class="week-dots">${dots}</div>
      <p class="text-dim" style="font-size: 13px;">${weekLogs.length} of 3-4 sessions</p>
    </div>
  `;
}

function renderNextWorkout(routine, weekCount, allLogs) {
  if (!routine) return '';

  const weekNumber = getWeekNumber(allLogs);
  const isDeload = weekNumber % 3 === 0 && weekNumber > 0;

  // Last done for each routine type
  const lastDoneByType = {};
  for (let i = allLogs.length - 1; i >= 0; i--) {
    const rid = allLogs[i].routineId;
    if (!lastDoneByType[rid]) {
      const d = new Date(allLogs[i].date);
      const diff = Math.floor((new Date() - d) / 86400000);
      lastDoneByType[rid] = diff;
    }
  }

  const typeLastDone = routines.map(r => {
    const days = lastDoneByType[r.id];
    let label, cls;
    if (days === undefined) { label = 'never'; cls = 'stale'; }
    else if (days === 0) { label = 'today'; cls = 'fresh'; }
    else if (days === 1) { label = 'yesterday'; cls = 'fresh'; }
    else { label = `${days}d ago`; cls = days >= 7 ? 'stale' : ''; }
    return `<span style="font-size: 12px; margin-right: 12px;">
      ${r.icon} <span class="days-count ${cls}">${label}</span>
    </span>`;
  }).join('');

  return `
    <div class="card">
      <div class="card-header">
        <h3 style="margin: 0;">NEXT UP</h3>
        ${isDeload ? '<span class="badge badge-steel">DELOAD</span>' : ''}
      </div>
      <div style="margin: 12px 0;">
        <div style="font-size: 24px; font-weight: 700;">${routine.icon} ${routine.name}</div>
        <p class="text-dim" style="margin-top: 4px;">${routine.description}</p>
        ${routine.shooting ? '<span class="badge badge-ember" style="margin-top: 8px; display: inline-block;">SHOOTING DAY</span>' : ''}
      </div>
      <div style="margin: 12px 0; padding: 10px 0; border-top: 1px solid #2a2a2a;">
        <div class="text-dim" style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 6px;">Last done</div>
        <div style="display: flex; flex-wrap: wrap;">${typeLastDone}</div>
      </div>
      <button class="btn btn-primary" id="btn-start">START WORKOUT</button>
      <button class="btn btn-secondary mt-8" id="btn-coach" style="width: 100%; letter-spacing: 1px;">COACH MODE</button>
    </div>
  `;
}

function renderMetrics(allLogs) {
  // Pull-up PR
  const pullupPR = store.getPR('pullups', 'reps');
  // Total sessions
  const totalSessions = allLogs.length;
  // Average RPE
  const rpeLogs = allLogs.filter(l => l.rpe);
  const avgRPE = rpeLogs.length > 0
    ? (rpeLogs.reduce((s, l) => s + l.rpe, 0) / rpeLogs.length).toFixed(1)
    : '--';
  // This week volume
  const weekLogs = store.getWeekLogs();
  const weekReps = weekLogs.reduce((s, l) => s + getLogTotalReps(l), 0);

  return `
    <div class="metrics-grid">
      <div class="metric-card">
        <div class="metric-value">${pullupPR || '--'}</div>
        <div class="metric-label">Pull-Up PR</div>
        ${pullupPR ? '<div class="pr-badge">PR</div>' : ''}
      </div>
      <div class="metric-card">
        <div class="metric-value">${totalSessions}</div>
        <div class="metric-label">Sessions</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${avgRPE}</div>
        <div class="metric-label">Avg RPE</div>
      </div>
      <div class="metric-card">
        <div class="metric-value">${weekReps}</div>
        <div class="metric-label">Week Reps</div>
      </div>
    </div>
  `;
}

function renderRecentSessions(logs) {
  if (logs.length === 0) return '';

  const items = logs.map(l => {
    const routine = getRoutine(l.routineId);
    const dur = getLogDurationMinutes(l);
    const reps = getLogTotalReps(l);
    return `
      <div class="exercise-item">
        <div>
          <div style="font-weight: 600;">${routine ? routine.icon + ' ' + routine.name : l.routineId}</div>
          <div class="text-dim" style="font-size: 13px;">${formatDate(l.date)}</div>
        </div>
        <div style="text-align: right;">
          <div style="font-size: 14px;">${dur}m</div>
          <div class="text-dim" style="font-size: 12px;">${reps} reps</div>
        </div>
      </div>
    `;
  }).join('');

  return `
    <div class="card mt-16">
      <h3>RECENT</h3>
      <div class="exercise-list">${items}</div>
    </div>
  `;
}

function bindEvents(container, nextRoutineId, savedWorkout) {
  const startBtn = container.querySelector('#btn-start');
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      window.location.hash = '#workout/' + nextRoutineId;
    });
  }

  const coachBtn = container.querySelector('#btn-coach');
  if (coachBtn) {
    coachBtn.addEventListener('click', () => {
      window.location.hash = '#coach/' + nextRoutineId;
    });
  }

  const resumeBtn = container.querySelector('#btn-resume');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      window.location.hash = '#workout/resume';
    });
  }

  const discardBtn = container.querySelector('#btn-discard');
  if (discardBtn) {
    discardBtn.addEventListener('click', () => {
      store.clearCurrentWorkout();
      window.location.hash = '#home';
      window.dispatchEvent(new HashChangeEvent('hashchange'));
    });
  }

  const calledBtn = container.querySelector('#btn-called-done');
  if (calledBtn) {
    calledBtn.addEventListener('click', () => {
      const exId = calledBtn.dataset.exerciseId;
      const prescription = calledBtn.dataset.prescription;
      logCalledExercise(exId, prescription);
      const banner = container.querySelector('#called-banner');
      banner.innerHTML = '<div style="text-align: center; color: var(--success); font-weight: 600; width: 100%;">Logged.</div>';
      setTimeout(() => { banner.style.display = 'none'; }, 1500);
    });
  }
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  const options = { weekday: 'short', month: 'short', day: 'numeric' };
  return d.toLocaleDateString('en-US', options);
}

function getWeekNumber(allLogs) {
  if (allLogs.length === 0) return 0;
  const first = new Date(allLogs[0].date);
  const now = new Date();
  const diffWeeks = Math.floor((now - first) / (7 * 24 * 60 * 60 * 1000));
  return diffWeeks;
}
