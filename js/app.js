// Storm Creek — app entry, hash router, service worker registration

import { renderHome } from './screens/home.js';
import { renderWorkout } from './screens/workout-active.js';
import { renderHistory } from './screens/history.js';
import { renderSettings } from './screens/settings.js';
import { renderExercises } from './screens/exercises.js';
import { renderCoach } from './screens/coach.js';
import { renderNav } from './components/nav.js';
import { initCalledExercises } from './utils/notifications.js';

const app = document.getElementById('app');

function route() {
  const hash = window.location.hash || '#home';
  const parts = hash.slice(1).split('/');
  const screen = parts[0];
  const param = parts[1] || null;

  app.innerHTML = '';

  switch (screen) {
    case 'coach':
      renderCoach(app, param);
      break;
    case 'workout':
      renderWorkout(app, param);
      break;
    case 'exercises':
      renderNav('exercises');
      renderExercises(app);
      break;
    case 'history':
      renderNav('history');
      renderHistory(app);
      break;
    case 'settings':
      renderNav('settings');
      renderSettings(app);
      break;
    case 'home':
    default:
      renderNav('home');
      renderHome(app);
      break;
  }
}

// Listen to called exercise events (show inline banner)
window.addEventListener('called-exercise', (e) => {
  // Only show if on home screen
  if (window.location.hash === '#home' || window.location.hash === '') {
    route(); // Re-render home to show new called exercise
  }
});

window.addEventListener('hashchange', route);
window.addEventListener('DOMContentLoaded', () => {
  route();
  initCalledExercises();
});

// Register service worker
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(() => {
    // Try relative path for non-root hosting
    navigator.serviceWorker.register('./sw.js').catch(err => {
      console.log('SW registration failed:', err);
    });
  });
}
