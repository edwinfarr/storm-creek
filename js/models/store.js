// localStorage wrapper — all keys prefixed with sc_
const PREFIX = 'sc_';

function key(name) { return PREFIX + name; }

export const store = {
  get(name, fallback = null) {
    try {
      const raw = localStorage.getItem(key(name));
      return raw ? JSON.parse(raw) : fallback;
    } catch {
      return fallback;
    }
  },

  set(name, value) {
    try {
      localStorage.setItem(key(name), JSON.stringify(value));
    } catch (e) {
      console.error('Store write failed:', e);
    }
  },

  remove(name) {
    localStorage.removeItem(key(name));
  },

  // Convenience accessors
  getWorkoutLogs() {
    return this.get('workoutLogs', []);
  },

  saveWorkoutLog(log) {
    const logs = this.getWorkoutLogs();
    logs.push(log);
    this.set('workoutLogs', logs);
  },

  getCalledLogs() {
    return this.get('calledLogs', []);
  },

  saveCalledLog(entry) {
    const logs = this.getCalledLogs();
    logs.push(entry);
    this.set('calledLogs', logs);
  },

  getCalledConfig() {
    return this.get('calledConfig', {
      enabled: true,
      minIntervalMin: 90,
      maxIntervalMin: 180,
      activeStartHour: 7,
      activeEndHour: 19
    });
  },

  getSettings() {
    return this.get('settings', {
      soundEnabled: true,
      stationOverrides: {},
      transitOverrides: {}
    });
  },

  saveSettings(settings) {
    this.set('settings', settings);
  },

  getCurrentWorkout() {
    return this.get('currentWorkout', null);
  },

  saveCurrentWorkout(state) {
    this.set('currentWorkout', state);
  },

  clearCurrentWorkout() {
    this.remove('currentWorkout');
  },

  // Get logs for current week (Mon-Sun)
  getWeekLogs() {
    const logs = this.getWorkoutLogs();
    const now = new Date();
    const day = now.getDay(); // 0=Sun
    const monday = new Date(now);
    monday.setDate(now.getDate() - (day === 0 ? 6 : day - 1));
    monday.setHours(0, 0, 0, 0);

    return logs.filter(l => new Date(l.date) >= monday);
  },

  // PR detection for a specific exercise
  getPR(exerciseId, trackingType) {
    const logs = this.getWorkoutLogs();
    let best = null;

    for (const log of logs) {
      for (const ex of (log.exercises || [])) {
        if (ex.exerciseId !== exerciseId) continue;
        if (trackingType === 'reps') {
          if (best === null || ex.value > best) best = ex.value;
        } else if (trackingType === 'timed') {
          // For timed: lower is better (sprint times), but for holds, higher is better
          if (best === null || ex.value > best) best = ex.value;
        }
      }
    }
    return best;
  },

  // Export all data as JSON
  exportData() {
    return {
      workoutLogs: this.getWorkoutLogs(),
      calledLogs: this.getCalledLogs(),
      calledConfig: this.getCalledConfig(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
  },

  // Import data from JSON
  importData(data) {
    if (data.workoutLogs) this.set('workoutLogs', data.workoutLogs);
    if (data.calledLogs) this.set('calledLogs', data.calledLogs);
    if (data.calledConfig) this.set('calledConfig', data.calledConfig);
    if (data.settings) this.set('settings', data.settings);
  }
};
