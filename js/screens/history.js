// History screen — calendar heatmap, trends, PRs

import { store } from '../models/store.js';
import { exercises as exerciseLib } from '../data/exercises.js';
import { getRoutine } from '../data/routines.js';
import { getLogDurationMinutes, getLogTotalReps } from '../models/workout-log.js';
import { getCalledCountToday } from '../utils/notifications.js';

export function renderHistory(container) {
  const allLogs = store.getWorkoutLogs();
  const calledLogs = store.getCalledLogs();

  container.innerHTML = `
    <div class="screen">
      <h1>HISTORY</h1>
      <p class="subtitle">${allLogs.length} sessions logged</p>

      ${renderCalendar(allLogs)}
      ${renderPRs(allLogs)}
      ${renderWeeklySummary(allLogs)}
      ${renderExerciseTrends(allLogs)}
      ${renderCalledStats(calledLogs)}
    </div>
  `;

  drawTrendCharts(container, allLogs);
}

function renderCalendar(logs) {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth();

  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startDow = firstDay.getDay(); // 0=Sun

  const monthName = firstDay.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

  // Get workout dates this month
  const workoutDates = new Set(
    logs.filter(l => {
      const d = new Date(l.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }).map(l => new Date(l.date).getDate())
  );

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S']
    .map(d => `<div class="cal-day-label">${d}</div>`).join('');

  let cells = '';
  // Empty cells before first day
  for (let i = 0; i < startDow; i++) {
    cells += '<div class="cal-day empty"></div>';
  }
  // Days of month
  for (let d = 1; d <= lastDay.getDate(); d++) {
    let cls = 'cal-day';
    if (workoutDates.has(d)) cls += ' has-workout';
    if (d === now.getDate()) cls += ' today';
    cells += `<div class="${cls}">${d}</div>`;
  }

  return `
    <div class="card mt-16">
      <h3>${monthName}</h3>
      <div class="calendar-grid">
        ${dayLabels}
        ${cells}
      </div>
    </div>
  `;
}

function renderPRs(logs) {
  // Track PRs for key exercises
  const prExercises = ['pullups', 'chinups', 'pushups', 'dead_hang', 'plank', 'draw_sprint'];
  const prs = [];

  for (const exId of prExercises) {
    const ex = exerciseLib[exId];
    if (!ex) continue;

    let best = null;
    let bestDate = null;

    for (const log of logs) {
      for (const entry of log.exercises) {
        if (entry.exerciseId !== exId) continue;
        if (best === null || entry.value > best) {
          best = entry.value;
          bestDate = log.date;
        }
      }
    }

    if (best !== null) {
      const unit = ex.trackingType === 'reps' ? 'reps' : 's';
      prs.push({ name: ex.name, value: best, unit, date: bestDate });
    }
  }

  if (prs.length === 0) return '';

  const items = prs.map(pr => `
    <div class="exercise-item">
      <div>
        <div style="font-weight: 600;">${pr.name}</div>
        <div class="text-dim" style="font-size: 12px;">${formatDate(pr.date)}</div>
      </div>
      <div style="text-align: right;">
        <span class="text-bone" style="font-size: 20px; font-weight: 700;">${pr.value}</span>
        <span class="text-dim" style="font-size: 12px;">${pr.unit}</span>
        <div class="pr-badge">PR</div>
      </div>
    </div>
  `).join('');

  return `
    <div class="card mt-16">
      <h3>PERSONAL RECORDS</h3>
      <div class="exercise-list">${items}</div>
    </div>
  `;
}

function renderWeeklySummary(logs) {
  // Last 4 weeks
  const weeks = [];
  const now = new Date();

  for (let w = 0; w < 4; w++) {
    const weekEnd = new Date(now);
    weekEnd.setDate(now.getDate() - (w * 7));
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekEnd.getDate() - 6);
    weekStart.setHours(0, 0, 0, 0);
    weekEnd.setHours(23, 59, 59, 999);

    const weekLogs = logs.filter(l => {
      const d = new Date(l.date);
      return d >= weekStart && d <= weekEnd;
    });

    const sessions = weekLogs.length;
    const totalMin = weekLogs.reduce((s, l) => s + getLogDurationMinutes(l), 0);
    const totalReps = weekLogs.reduce((s, l) => s + getLogTotalReps(l), 0);

    const label = w === 0 ? 'This week' : w === 1 ? 'Last week' : `${w} weeks ago`;
    weeks.push({ label, sessions, totalMin, totalReps });
  }

  const rows = weeks.map(w => `
    <div class="exercise-item">
      <div>
        <div style="font-weight: 500;">${w.label}</div>
      </div>
      <div style="text-align: right; font-size: 13px;">
        <span class="text-bone">${w.sessions}</span> sessions \u2022
        <span class="text-bone">${w.totalMin}</span>m \u2022
        <span class="text-bone">${w.totalReps}</span> reps
      </div>
    </div>
  `).join('');

  return `
    <div class="card mt-16">
      <h3>WEEKLY VOLUME</h3>
      <div class="exercise-list">${rows}</div>
    </div>
  `;
}

function renderExerciseTrends(logs) {
  // Pull-ups and push-ups trend charts
  return `
    <div class="card mt-16">
      <h3>PULL-UP TREND</h3>
      <canvas class="trend-chart" id="chart-pullups" width="400" height="120"></canvas>
    </div>
    <div class="card mt-16">
      <h3>PUSH-UP TREND</h3>
      <canvas class="trend-chart" id="chart-pushups" width="400" height="120"></canvas>
    </div>
  `;
}

function drawTrendCharts(container, logs) {
  drawTrend(container, 'chart-pullups', logs, 'pullups');
  drawTrend(container, 'chart-pushups', logs, 'pushups');
}

function drawTrend(container, canvasId, logs, exerciseId) {
  const canvas = container.querySelector('#' + canvasId);
  if (!canvas) return;

  const ctx = canvas.getContext('2d');
  const w = canvas.width = canvas.offsetWidth * 2;
  const h = canvas.height = 240;
  ctx.scale(1, 1);

  // Gather data points: per-session max reps
  const points = [];
  for (const log of logs) {
    const entries = log.exercises.filter(e => e.exerciseId === exerciseId && e.trackingType === 'reps');
    if (entries.length > 0) {
      const maxReps = Math.max(...entries.map(e => e.value));
      points.push({ date: log.date, value: maxReps });
    }
  }

  if (points.length < 2) {
    ctx.fillStyle = '#6a625a';
    ctx.font = '24px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Need more data', w / 2, h / 2);
    return;
  }

  const maxVal = Math.max(...points.map(p => p.value));
  const padding = 30;
  const chartW = w - padding * 2;
  const chartH = h - padding * 2;

  // Draw grid
  ctx.strokeStyle = '#2a2a2a';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartH / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(w - padding, y);
    ctx.stroke();
  }

  // Draw line
  ctx.strokeStyle = '#8b1a1a';
  ctx.lineWidth = 3;
  ctx.beginPath();
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - (p.value / (maxVal * 1.1)) * chartH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.stroke();

  // Draw dots
  ctx.fillStyle = '#d4c5a9';
  points.forEach((p, i) => {
    const x = padding + (i / (points.length - 1)) * chartW;
    const y = padding + chartH - (p.value / (maxVal * 1.1)) * chartH;
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fill();
  });

  // Y-axis labels
  ctx.fillStyle = '#6a625a';
  ctx.font = '20px sans-serif';
  ctx.textAlign = 'right';
  for (let i = 0; i <= 4; i++) {
    const val = Math.round((maxVal * 1.1 / 4) * (4 - i));
    const y = padding + (chartH / 4) * i + 6;
    ctx.fillText(val.toString(), padding - 8, y);
  }
}

function renderCalledStats(calledLogs) {
  const todayCount = getCalledCountToday();
  const totalCount = calledLogs.length;

  if (totalCount === 0 && todayCount === 0) return '';

  return `
    <div class="card mt-16">
      <h3>CALLED EXERCISES</h3>
      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-value">${todayCount}</div>
          <div class="metric-label">Today</div>
        </div>
        <div class="metric-card">
          <div class="metric-value">${totalCount}</div>
          <div class="metric-label">All Time</div>
        </div>
      </div>
    </div>
  `;
}

function formatDate(dateStr) {
  const d = new Date(dateStr + 'T12:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}
