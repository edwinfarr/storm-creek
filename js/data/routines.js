// Pre-built workout routines — 4 types
// Each routine: FORGE → STORM phases → RECEDE
// Rotation: Ridge Run → Dark Water → Ridge Run → Storm Fire

export const routines = [
  {
    id: 'ridge_run',
    name: 'Ridge Run',
    type: 'trail_circuit',
    description: 'Full-body endurance + strength across the property. The signature workout.',
    shooting: false,
    icon: '\u26A1',
    rounds: 3,
    deloadRounds: 2,
    phases: [
      {
        name: 'STORM — Circuit',
        type: 'circuit',
        stations: [
          {
            stationId: 'house',
            exercises: [
              { exerciseId: 'pullups', reps: 5 },
              { exerciseId: 'pushups', reps: 15 },
            ]
          },
          {
            stationId: 'draw',
            exercises: [
              { exerciseId: 'draw_sprint', seconds: 0 }, // timed, no target
            ]
          },
          {
            stationId: 'workshop',
            exercises: [
              { exerciseId: 'log_press', reps: 8 },
              { exerciseId: 'farmer_carry', seconds: 60 },
              { exerciseId: 'step_ups', reps: 12 },
            ]
          },
          {
            stationId: 'draw',
            exercises: [
              { exerciseId: 'hill_bound', seconds: 0 },
            ]
          },
          {
            stationId: 'creek_bottom',
            exercises: [
              { exerciseId: 'bear_crawl', seconds: 30 },
              { exerciseId: 'hip_bridge', reps: 15 },
              { exerciseId: 'plank', seconds: 45 },
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'storm_fire',
    name: 'Storm Fire',
    type: 'combat_ready',
    description: 'Cardio into precision shooting while gassed. Earn your trigger squeeze.',
    shooting: true,
    icon: '\u2316',
    rounds: 3,
    deloadRounds: 2,
    phases: [
      {
        name: 'STORM — Combat Circuit',
        type: 'circuit',
        stations: [
          {
            stationId: 'house',
            exercises: [
              { exerciseId: 'pullups', reps: 5 },
              { exerciseId: 'diamond_pushups', reps: 10 },
            ]
          },
          {
            stationId: 'draw',
            exercises: [
              { exerciseId: 'draw_sprint', seconds: 0 },
            ]
          },
          {
            stationId: 'firing_line',
            exercises: [
              { exerciseId: 'stress_shoot', reps: 5 },
              { exerciseId: 'kneeling_rifle', reps: 5 },
            ]
          },
          {
            stationId: 'workshop',
            exercises: [
              { exerciseId: 'block_press', reps: 10 },
              { exerciseId: 'suitcase_carry', seconds: 40 },
            ]
          },
          {
            stationId: 'draw',
            exercises: [
              { exerciseId: 'draw_sprint', seconds: 0 },
            ]
          },
          {
            stationId: 'firing_line',
            exercises: [
              { exerciseId: 'prone_rifle', reps: 5 },
              { exerciseId: 'standing_rifle', reps: 5 },
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'dark_water',
    name: 'Dark Water',
    type: 'ground_flow',
    description: 'Animal flow + mobility + ground strength. Move like a predator.',
    shooting: false,
    icon: '\u2248',
    rounds: 3,
    deloadRounds: 2,
    phases: [
      {
        name: 'STORM — Flow Circuit',
        type: 'circuit',
        stations: [
          {
            stationId: 'house',
            exercises: [
              { exerciseId: 'dead_hang', seconds: 30 },
              { exerciseId: 'inchworm', reps: 6 },
            ]
          },
          {
            stationId: 'creek_bottom',
            exercises: [
              { exerciseId: 'bear_crawl', seconds: 30 },
              { exerciseId: 'crab_walk', seconds: 30 },
              { exerciseId: 'crocodile_walk', seconds: 20 },
              { exerciseId: 'scorpion', reps: 8 },
            ]
          },
          {
            stationId: 'south_clearing',
            exercises: [
              { exerciseId: 'qm_movement', seconds: 30 },
              { exerciseId: 'lateral_ape', seconds: 20 },
              { exerciseId: 'beast_reach', reps: 8 },
              { exerciseId: 'dead_bug', reps: 10 },
              { exerciseId: 'single_leg_bridge', reps: 8 },
            ]
          },
        ]
      }
    ]
  },

  {
    id: 'war_path',
    name: 'War Path',
    type: 'ruck_carry',
    description: 'Loaded endurance. Carries, drags, grit. Move weight through terrain.',
    shooting: false,
    icon: '\u2694',
    rounds: 2,
    deloadRounds: 1,
    phases: [
      {
        name: 'STORM — Carry Circuit',
        type: 'circuit',
        stations: [
          {
            stationId: 'workshop',
            exercises: [
              { exerciseId: 'shoulder_carry', seconds: 60 },
              { exerciseId: 'log_press', reps: 8 },
              { exerciseId: 'farmer_carry', seconds: 60 },
            ]
          },
          {
            stationId: 'draw',
            exercises: [
              { exerciseId: 'log_drag', seconds: 45 },
            ]
          },
          {
            stationId: 'workshop',
            exercises: [
              { exerciseId: 'bear_hug_carry', seconds: 45 },
              { exerciseId: 'overhead_carry', seconds: 30 },
              { exerciseId: 'block_press', reps: 10 },
            ]
          },
          {
            stationId: 'creek_bottom',
            exercises: [
              { exerciseId: 'ruck_march', seconds: 300 },
            ]
          },
          {
            stationId: 'draw',
            exercises: [
              { exerciseId: 'creek_climb', seconds: 0 },
            ]
          },
        ]
      }
    ]
  }
];

// Week rotation pattern
// 4-day week: Ridge Run → Dark Water → Ridge Run → Storm Fire
// 3-day week: Ridge Run → Dark Water → Ridge Run (skip Storm Fire)
export const rotationOrder = ['ridge_run', 'dark_water', 'ridge_run', 'storm_fire'];

export function getRoutine(id) {
  return routines.find(r => r.id === id) || null;
}

export function getNextRoutineId(completedIds) {
  // Find position in rotation based on what's been done this week
  const weekCount = completedIds.length;
  const idx = weekCount % rotationOrder.length;
  return rotationOrder[idx];
}
