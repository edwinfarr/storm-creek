// Workout session log model

export function createWorkoutLog(routineId) {
  return {
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6),
    routineId,
    date: new Date().toISOString().split('T')[0],
    startTime: new Date().toISOString(),
    endTime: null,
    exercises: [],
    rpe: null,
    notes: ''
  };
}

export function addExerciseEntry(log, entry) {
  log.exercises.push({
    exerciseId: entry.exerciseId,
    stationId: entry.stationId,
    round: entry.round,
    trackingType: entry.trackingType,
    value: entry.value, // reps count, or seconds
    timestamp: new Date().toISOString()
  });
}

export function finalizeLog(log, rpe, notes) {
  log.endTime = new Date().toISOString();
  log.rpe = rpe;
  log.notes = notes || '';
  return log;
}

export function getLogDurationMinutes(log) {
  if (!log.startTime || !log.endTime) return 0;
  const ms = new Date(log.endTime) - new Date(log.startTime);
  return Math.round(ms / 60000);
}

export function getLogExerciseCount(log) {
  return log.exercises.length;
}

export function getLogTotalReps(log) {
  return log.exercises
    .filter(e => e.trackingType === 'reps')
    .reduce((sum, e) => sum + e.value, 0);
}
