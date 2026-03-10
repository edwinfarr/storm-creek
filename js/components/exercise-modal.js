// Exercise detail modal — tap any exercise name to learn what it is

import { exercises as exerciseLib } from '../data/exercises.js';
import { store } from '../models/store.js';

export function showExerciseModal(exerciseId) {
  const ex = exerciseLib[exerciseId];
  if (!ex) return;

  // Find last time this exercise was done
  const lastDone = getLastDone(exerciseId);
  const pr = store.getPR(exerciseId, ex.trackingType);

  const overlay = document.createElement('div');
  overlay.className = 'modal-overlay';
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) overlay.remove();
  });

  const categoryColors = {
    cardio: 'var(--accent-ember)',
    upper: 'var(--accent-blood)',
    lower: 'var(--accent-steel)',
    carry: '#5a4a2a',
    animal_flow: 'var(--success)',
    core: '#4a3a5a',
    shooting: '#6a625a'
  };

  const trackingLabels = {
    reps: 'Count Reps',
    timed: 'Timed',
    hold: 'Hold for Time',
    distance: 'Distance'
  };

  const sheet = document.createElement('div');
  sheet.className = 'modal-sheet';
  sheet.innerHTML = `
    <div class="modal-handle"></div>
    <div class="modal-title">${ex.name}</div>
    <span class="modal-category" style="background: ${categoryColors[ex.category] || 'var(--accent-steel)'}">
      ${ex.category.replace('_', ' ')}
    </span>
    <span class="modal-category" style="background: var(--bg-elevated); margin-left: 6px;">
      ${trackingLabels[ex.trackingType] || ex.trackingType}
    </span>

    <div class="modal-description">${ex.description}</div>

    ${lastDone ? `
      <div class="modal-section-title">Last Done</div>
      <div style="font-size: 15px; padding: 8px 0;">
        ${lastDone.text}${lastDone.value ? ` \u2014 <span class="text-bone">${lastDone.value}</span>` : ''}
      </div>
    ` : ''}

    ${pr !== null ? `
      <div class="modal-section-title">Personal Record</div>
      <div style="font-size: 20px; font-weight: 700; color: var(--accent-bone); padding: 8px 0;">
        ${pr} ${ex.trackingType === 'reps' ? 'reps' : 'seconds'}
        <span class="pr-badge" style="font-size: 13px; margin-left: 8px;">PR</span>
      </div>
    ` : ''}

    <div class="modal-section-title">Form Cues</div>
    <ul class="cue-list">
      ${ex.cues.map(c => `<li>${c}</li>`).join('')}
    </ul>

    ${ex.trackingType === 'reps' && ex.defaultReps ? `
      <div class="modal-section-title">Default Target</div>
      <div style="font-size: 15px; padding: 8px 0;">${ex.defaultReps} reps</div>
    ` : ''}

    ${ex.trackingType !== 'reps' && (ex.defaultSeconds) ? `
      <div class="modal-section-title">Default Duration</div>
      <div style="font-size: 15px; padding: 8px 0;">${ex.defaultSeconds}s</div>
    ` : ''}

    <div class="modal-section-title">Muscles</div>
    <div class="modal-muscles">
      ${(ex.muscleGroups || []).map(m => `<span class="muscle-tag">${m.replace('_', ' ')}</span>`).join('')}
    </div>

    <div class="modal-section-title">Safety</div>
    <div class="modal-constraints">
      ${ex.constraints.kneesSafe ? '<span class="constraint-tag safe">Knee Safe</span>' : ''}
      ${ex.constraints.hipSafe ? '<span class="constraint-tag safe">Hip Safe</span>' : ''}
      <span class="muscle-tag">${ex.constraints.impactLevel} impact</span>
    </div>

    ${ex.equipment && ex.equipment.length > 0 ? `
      <div class="modal-section-title">Equipment</div>
      <div class="modal-muscles">
        ${ex.equipment.map(e => `<span class="muscle-tag">${e.replace('_', ' ')}</span>`).join('')}
      </div>
    ` : ''}

    ${ex.videoSearch ? `
      <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(ex.videoSearch)}"
         target="_blank" rel="noopener"
         style="display: block; width: 100%; min-height: 56px; margin-top: 20px;
                background: #6b1010; color: #fff; border: none; border-radius: 8px;
                font-size: 18px; font-weight: 700; text-decoration: none;
                text-align: center; line-height: 56px; letter-spacing: 1px;">
        \u25B6 WATCH DEMO
      </a>
    ` : ''}

    <button class="modal-close" id="modal-close">GOT IT</button>
  `;

  overlay.appendChild(sheet);
  document.body.appendChild(overlay);

  sheet.querySelector('#modal-close').addEventListener('click', () => overlay.remove());
}

function getLastDone(exerciseId) {
  const logs = store.getWorkoutLogs();
  for (let i = logs.length - 1; i >= 0; i--) {
    const entries = logs[i].exercises.filter(e => e.exerciseId === exerciseId);
    if (entries.length > 0) {
      const d = new Date(logs[i].date);
      const now = new Date();
      const diffDays = Math.floor((now - d) / 86400000);
      const best = Math.max(...entries.map(e => e.value));
      const ex = exerciseLib[exerciseId];
      const unit = ex && ex.trackingType === 'reps' ? ' reps' : 's';

      let text;
      if (diffDays === 0) text = 'Today';
      else if (diffDays === 1) text = 'Yesterday';
      else text = `${diffDays} days ago`;

      return { text, value: best + unit, diffDays };
    }
  }
  return null;
}

// Make any element with data-exercise-id tappable
export function bindExerciseTaps(container) {
  container.querySelectorAll('[data-exercise-id]').forEach(el => {
    el.classList.add('exercise-tappable');
    el.addEventListener('click', (e) => {
      e.stopPropagation();
      showExerciseModal(el.dataset.exerciseId);
    });
  });
}
