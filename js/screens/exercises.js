// Exercise library screen — browse all movements, tap for details

import { exerciseList } from '../data/exercises.js';
import { showExerciseModal } from '../components/exercise-modal.js';
import { store } from '../models/store.js';

const categoryNames = {
  cardio: 'Cardio',
  upper: 'Upper Body',
  lower: 'Lower Body',
  carry: 'Carries',
  animal_flow: 'Animal Flow',
  core: 'Core',
  shooting: 'Shooting'
};

const categoryOrder = ['cardio', 'upper', 'lower', 'carry', 'animal_flow', 'core', 'shooting'];

export function renderExercises(container) {
  const allLogs = store.getWorkoutLogs();
  const lastDoneMap = buildLastDoneMap(allLogs);

  // Group by category
  const grouped = {};
  for (const ex of exerciseList) {
    if (!grouped[ex.category]) grouped[ex.category] = [];
    grouped[ex.category].push(ex);
  }

  let html = `
    <div class="screen">
      <h1>EXERCISES</h1>
      <p class="subtitle">${exerciseList.length} movements \u2014 all hip & knee safe</p>
      <p class="text-dim mt-8" style="font-size: 13px;">Tap any exercise to see form cues and details.</p>
  `;

  for (const cat of categoryOrder) {
    const exercises = grouped[cat];
    if (!exercises) continue;

    html += `<div class="lib-category-header">${categoryNames[cat] || cat} (${exercises.length})</div>`;

    for (const ex of exercises) {
      const last = lastDoneMap[ex.id];
      let lastStr = '';
      if (last) {
        const cls = last.days <= 3 ? 'fresh' : last.days >= 10 ? 'stale' : '';
        if (last.days === 0) lastStr = '<span class="days-count fresh">today</span>';
        else if (last.days === 1) lastStr = '<span class="days-count fresh">yesterday</span>';
        else lastStr = `<span class="days-count ${cls}">${last.days}d ago</span>`;
      }

      const typeIcon = ex.trackingType === 'reps' ? '#' : ex.trackingType === 'hold' ? '\u23F1' : '\u23F1';

      html += `
        <div class="lib-exercise-row" data-ex-id="${ex.id}">
          <div>
            <div class="lib-exercise-name">${ex.name}</div>
            <div class="lib-exercise-type">
              ${typeIcon} ${ex.trackingType === 'reps' ? (ex.defaultReps || '') + ' reps' : (ex.defaultSeconds || '') + 's'}
              ${lastStr ? ' \u2022 ' + lastStr : ''}
            </div>
          </div>
          <div class="lib-exercise-arrow">\u203A</div>
        </div>
      `;
    }
  }

  html += '</div>';
  container.innerHTML = html;

  // Bind taps
  container.querySelectorAll('.lib-exercise-row').forEach(row => {
    row.addEventListener('click', () => {
      showExerciseModal(row.dataset.exId);
    });
  });
}

function buildLastDoneMap(logs) {
  const map = {};
  const now = new Date();
  // Iterate backwards for most recent
  for (let i = logs.length - 1; i >= 0; i--) {
    for (const entry of logs[i].exercises) {
      if (map[entry.exerciseId]) continue; // already found most recent
      const d = new Date(logs[i].date);
      const days = Math.floor((now - d) / 86400000);
      map[entry.exerciseId] = { days, date: logs[i].date };
    }
  }
  return map;
}
