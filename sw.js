const CACHE_NAME = 'storm-creek-v3';

// Use relative paths so it works on GitHub Pages (subdirectory) and locally
const ASSET_PATHS = [
  './',
  './index.html',
  './css/style.css',
  './js/app.js',
  './js/data/exercises.js',
  './js/data/stations.js',
  './js/data/routines.js',
  './js/data/mobility.js',
  './js/models/store.js',
  './js/models/workout-log.js',
  './js/screens/home.js',
  './js/screens/workout-active.js',
  './js/screens/history.js',
  './js/screens/settings.js',
  './js/screens/exercises.js',
  './js/screens/coach.js',
  './js/components/timer.js',
  './js/components/rep-counter.js',
  './js/components/exercise-modal.js',
  './js/components/nav.js',
  './js/utils/audio.js',
  './js/utils/notifications.js',
  './audio/storm-creek-alert.wav',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSET_PATHS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// Called exercise notifications
self.addEventListener('message', e => {
  if (e.data && e.data.type === 'SCHEDULE_CALLED') {
    const delay = e.data.delay || 5400000; // default 90 min
    setTimeout(() => {
      self.registration.showNotification('Storm Creek', {
        body: e.data.exercise || 'Time for a called exercise',
        icon: './icons/icon-192.png',
        badge: './icons/icon-192.png',
        tag: 'called-exercise',
        requireInteraction: true
      });
    }, delay);
  }
});
