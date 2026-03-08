// Called exercise notifications

import { store } from '../models/store.js';
import { calledExercises } from '../data/exercises.js';

let nextTimeout = null;

export function initCalledExercises() {
  const config = store.getCalledConfig();
  if (!config.enabled) return;
  scheduleNext();
}

export function scheduleNext() {
  if (nextTimeout) clearTimeout(nextTimeout);

  const config = store.getCalledConfig();
  if (!config.enabled) return;

  const now = new Date();
  const hour = now.getHours();

  // Only during active hours
  if (hour < config.activeStartHour || hour >= config.activeEndHour) {
    // Schedule for next active period start
    const tomorrow = new Date(now);
    tomorrow.setDate(tomorrow.getDate() + (hour >= config.activeEndHour ? 1 : 0));
    tomorrow.setHours(config.activeStartHour, 0, 0, 0);
    const delay = tomorrow - now;
    nextTimeout = setTimeout(() => scheduleNext(), delay);
    return;
  }

  // Random interval between min and max
  const minMs = config.minIntervalMin * 60000;
  const maxMs = config.maxIntervalMin * 60000;
  const delay = minMs + Math.random() * (maxMs - minMs);

  nextTimeout = setTimeout(() => {
    triggerCalledExercise();
    scheduleNext();
  }, delay);
}

function getRandomCalled() {
  const idx = Math.floor(Math.random() * calledExercises.length);
  return calledExercises[idx];
}

function triggerCalledExercise() {
  const called = getRandomCalled();

  // Try browser notification
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('Storm Creek', {
      body: called.prescription,
      icon: './icons/icon-192.png',
      tag: 'called-exercise',
      requireInteraction: true
    });
  }

  // Also dispatch custom event for in-app display
  window.dispatchEvent(new CustomEvent('called-exercise', {
    detail: called
  }));
}

export function requestNotificationPermission() {
  if ('Notification' in window && Notification.permission === 'default') {
    Notification.requestPermission();
  }
}

export function logCalledExercise(exerciseId, prescription) {
  store.saveCalledLog({
    exerciseId,
    prescription,
    timestamp: new Date().toISOString(),
    date: new Date().toISOString().split('T')[0]
  });
}

export function getCalledCountToday() {
  const today = new Date().toISOString().split('T')[0];
  return store.getCalledLogs().filter(l => l.date === today).length;
}
