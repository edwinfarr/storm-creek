// Exercise library — all movements filtered for knee/hip safety
// trackingType: 'reps' | 'timed' | 'hold' | 'distance'
// impactLevel: 'none' | 'low' | 'moderate' (no 'high')

export const exercises = {
  // ── Cardio ──
  draw_sprint: {
    id: 'draw_sprint', name: 'Draw Sprint', category: 'cardio',
    trackingType: 'timed', defaultSeconds: 0,
    description: 'Sprint uphill through the draw. Walk down.',
    cues: ['Drive with arms', 'Short powerful steps', 'Lean into the hill', 'Walk the descent — always'],
    muscleGroups: ['quads', 'glutes', 'calves', 'cardio'],
    equipment: [], terrain: 'draw',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'moderate' },
    videoSearch: 'hill sprint technique proper form'
  },
  hill_bound: {
    id: 'hill_bound', name: 'Hill Bounding', category: 'cardio',
    trackingType: 'timed', defaultSeconds: 0,
    description: 'Powerful uphill bounds, exaggerated stride.',
    cues: ['Drive knee forward not up', 'Pump arms hard', 'Land soft midfoot', 'Walk down'],
    muscleGroups: ['glutes', 'quads', 'calves'],
    equipment: [], terrain: 'draw',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'moderate' },
    videoSearch: 'hill bounding drill technique running'
  },
  ruck_march: {
    id: 'ruck_march', name: 'Ruck March', category: 'cardio',
    trackingType: 'timed', defaultSeconds: 300,
    description: 'Weighted pack walk on trail.',
    cues: ['Chest up, shoulders back', 'Quick cadence', 'Breathe steady'],
    muscleGroups: ['full_body', 'cardio'],
    equipment: ['ruck'], terrain: 'trail',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'rucking technique how to ruck march'
  },
  shuttle_run: {
    id: 'shuttle_run', name: 'Shuttle Runs', category: 'cardio',
    trackingType: 'timed', defaultSeconds: 30,
    description: 'Flat-ground sprint shuttles.',
    cues: ['Stay low on turns', 'Touch the line', 'Explode out'],
    muscleGroups: ['quads', 'glutes', 'cardio'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'moderate' },
    videoSearch: 'shuttle run sprint drill technique'
  },
  creek_climb: {
    id: 'creek_climb', name: 'Creek-to-Ridge Climb', category: 'cardio',
    trackingType: 'timed', defaultSeconds: 0,
    description: 'Full ascent from creek bottom to ridge. The mountain IS the workout.',
    cues: ['Pick your footing', 'Use hands on steep sections', 'Breathe through the burn'],
    muscleGroups: ['full_body', 'cardio'],
    equipment: [], terrain: 'draw',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'steep hill climb workout trail running uphill'
  },
  driveway_sprint: {
    id: 'driveway_sprint', name: 'Driveway Sprint', category: 'cardio',
    trackingType: 'timed', defaultSeconds: 0,
    description: 'Sprint from the house up the driveway to the road. Walk back down.',
    cues: ['Pump arms hard on the gravel', 'Short powerful strides', 'Don\'t let up till the road', 'Walk the descent — always'],
    muscleGroups: ['quads', 'glutes', 'calves', 'cardio'],
    equipment: [], terrain: 'driveway',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'moderate' },
    videoSearch: 'uphill sprint technique proper form'
  },

  // ── Upper Body ──
  pullups: {
    id: 'pullups', name: 'Pull-Ups', category: 'upper',
    trackingType: 'reps', defaultReps: 5,
    description: 'Overhand grip, full extension to chin over bar.',
    cues: ['Dead hang start', 'Engage lats first', 'Chin clears the bar', 'Control the negative'],
    muscleGroups: ['lats', 'biceps', 'forearms'],
    equipment: ['pullup_bar'], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'pull up proper form technique beginner'
  },
  chinups: {
    id: 'chinups', name: 'Chin-Ups', category: 'upper',
    trackingType: 'reps', defaultReps: 5,
    description: 'Underhand grip pull-ups.',
    cues: ['Supinated grip, shoulder width', 'Pull chest to bar', 'Slow negative'],
    muscleGroups: ['biceps', 'lats'],
    equipment: ['pullup_bar'], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'chin up proper form underhand grip'
  },
  dead_hang: {
    id: 'dead_hang', name: 'Dead Hang', category: 'upper',
    trackingType: 'hold', defaultSeconds: 30,
    description: 'Hang from bar, shoulders packed.',
    cues: ['Shoulders away from ears', 'Grip tight', 'Breathe deep', 'Decompress the spine'],
    muscleGroups: ['forearms', 'shoulders', 'lats'],
    equipment: ['pullup_bar'], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'dead hang technique benefits grip strength'
  },
  log_press: {
    id: 'log_press', name: 'Log Press', category: 'upper',
    trackingType: 'reps', defaultReps: 8,
    description: 'Clean log to shoulders, press overhead.',
    cues: ['Brace core hard', 'Drive through heels', 'Lock out overhead', 'Control the descent'],
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['log'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'log clean and press strongman technique'
  },
  block_press: {
    id: 'block_press', name: 'Cinder Block Press', category: 'upper',
    trackingType: 'reps', defaultReps: 10,
    description: 'Press cinder block overhead from chest.',
    cues: ['Grip edges tight', 'Brace core', 'Full lockout', 'Steady descent'],
    muscleGroups: ['shoulders', 'triceps', 'core'],
    equipment: ['cinder_block'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'overhead press cinder block improvised weight'
  },
  pushups: {
    id: 'pushups', name: 'Push-Ups', category: 'upper',
    trackingType: 'reps', defaultReps: 15,
    description: 'Standard push-ups, chest to ground.',
    cues: ['Hands under shoulders', 'Body straight as a plank', 'Chest touches ground', 'Full lockout'],
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: [], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'push up proper form technique'
  },
  diamond_pushups: {
    id: 'diamond_pushups', name: 'Diamond Push-Ups', category: 'upper',
    trackingType: 'reps', defaultReps: 10,
    description: 'Hands together, diamond shape.',
    cues: ['Thumbs and index fingers touch', 'Elbows track back', 'Squeeze triceps at top'],
    muscleGroups: ['triceps', 'chest'],
    equipment: [], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'diamond push up form tricep pushup'
  },
  archer_pushups: {
    id: 'archer_pushups', name: 'Archer Push-Ups', category: 'upper',
    trackingType: 'reps', defaultReps: 6,
    description: 'Wide push-up, shift weight to one arm.',
    cues: ['Wide hand placement', 'Shift to working arm', 'Straight arm extends', 'Alternate sides'],
    muscleGroups: ['chest', 'triceps', 'shoulders'],
    equipment: [], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'archer push up tutorial form'
  },
  log_row: {
    id: 'log_row', name: 'Log Rows', category: 'upper',
    trackingType: 'reps', defaultReps: 10,
    description: 'Bent over row with log.',
    cues: ['Hinge at hips', 'Pull to belly button', 'Squeeze shoulder blades', 'Keep back flat'],
    muscleGroups: ['lats', 'biceps', 'rear_delts'],
    equipment: ['log'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'bent over row form technique barbell'
  },
  inverted_row: {
    id: 'inverted_row', name: 'Inverted Rows', category: 'upper',
    trackingType: 'reps', defaultReps: 10,
    description: 'Body row under low bar or branch.',
    cues: ['Body straight', 'Pull chest to bar', 'Squeeze at top', 'Slow negative'],
    muscleGroups: ['lats', 'biceps', 'rear_delts'],
    equipment: ['pullup_bar'], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'inverted row bodyweight form technique'
  },

  // ── Lower Body (all knee/hip safe) ──
  reverse_lunge: {
    id: 'reverse_lunge', name: 'Reverse Lunges', category: 'lower',
    trackingType: 'reps', defaultReps: 10,
    description: 'Step back, short range. Knee stays behind toe.',
    cues: ['Short step back', 'Do NOT drop deep', 'Front shin vertical', 'Drive through front heel'],
    muscleGroups: ['quads', 'glutes'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'reverse lunge proper form knee friendly'
  },
  step_ups: {
    id: 'step_ups', name: 'Step-Ups', category: 'lower',
    trackingType: 'reps', defaultReps: 12,
    description: 'Step onto moderate height surface. No jumping.',
    cues: ['Whole foot on surface', 'Drive through heel', 'Stand tall at top', 'Step down controlled'],
    muscleGroups: ['quads', 'glutes'],
    equipment: ['log', 'cinder_block'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'step up exercise proper form technique'
  },
  hip_bridge: {
    id: 'hip_bridge', name: 'Hip Bridges', category: 'lower',
    trackingType: 'reps', defaultReps: 15,
    description: 'Supine bridge, squeeze glutes at top.',
    cues: ['Feet flat, knees bent', 'Drive hips to ceiling', 'Squeeze glutes hard', 'Hold 2 sec at top'],
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'glute bridge hip bridge proper form'
  },
  single_leg_bridge: {
    id: 'single_leg_bridge', name: 'Single-Leg Bridges', category: 'lower',
    trackingType: 'reps', defaultReps: 8,
    description: 'One leg extended, bridge on the other.',
    cues: ['Extend one leg straight', 'Drive through planted heel', 'Keep hips level', 'Switch sides'],
    muscleGroups: ['glutes', 'hamstrings'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'single leg glute bridge form technique'
  },
  log_drag: {
    id: 'log_drag', name: 'Log Drag Uphill', category: 'lower',
    trackingType: 'timed', defaultSeconds: 45,
    description: 'Drag a log uphill by rope or grip.',
    cues: ['Lean forward into the hill', 'Short powerful steps', 'Grip and rip'],
    muscleGroups: ['glutes', 'hamstrings', 'grip', 'back'],
    equipment: ['log'], terrain: 'draw',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'sled drag technique strongman pulling'
  },
  wall_sit: {
    id: 'wall_sit', name: 'Wall Sit', category: 'lower',
    trackingType: 'hold', defaultSeconds: 45,
    description: 'Back against tree or wall, thighs parallel.',
    cues: ['Thighs at 90 degrees max', 'Press back flat', 'Breathe through the burn'],
    muscleGroups: ['quads'],
    equipment: [], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'wall sit proper form technique'
  },
  calf_raises: {
    id: 'calf_raises', name: 'Calf Raises', category: 'lower',
    trackingType: 'reps', defaultReps: 20,
    description: 'Rise onto toes on edge of step/log.',
    cues: ['Full range of motion', 'Pause at top', 'Control the negative', 'Both legs or single'],
    muscleGroups: ['calves'],
    equipment: [], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'calf raise proper form standing'
  },

  // ── Carries ──
  farmer_carry: {
    id: 'farmer_carry', name: 'Farmer Carry', category: 'carry',
    trackingType: 'timed', defaultSeconds: 60,
    description: 'Carry cinder blocks at sides.',
    cues: ['Shoulders back and down', 'Core tight', 'Quick short steps', 'Crush grip'],
    muscleGroups: ['grip', 'traps', 'core'],
    equipment: ['cinder_block'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'farmer carry walk proper form technique'
  },
  shoulder_carry: {
    id: 'shoulder_carry', name: 'Log Shoulder Carry', category: 'carry',
    trackingType: 'timed', defaultSeconds: 60,
    description: 'Log on one shoulder, walk.',
    cues: ['Switch shoulders halfway', 'Core braced', 'Upright posture'],
    muscleGroups: ['shoulders', 'core', 'traps'],
    equipment: ['log'], terrain: 'trail',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'log carry shoulder strongman technique'
  },
  overhead_carry: {
    id: 'overhead_carry', name: 'Overhead Carry', category: 'carry',
    trackingType: 'timed', defaultSeconds: 30,
    description: 'Block pressed overhead, walk.',
    cues: ['Lock arms out', 'Ribs down', 'Tight core', 'Short steps'],
    muscleGroups: ['shoulders', 'core'],
    equipment: ['cinder_block'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'overhead carry exercise form technique'
  },
  bear_hug_carry: {
    id: 'bear_hug_carry', name: 'Bear Hug Carry', category: 'carry',
    trackingType: 'timed', defaultSeconds: 45,
    description: 'Hug log to chest, walk.',
    cues: ['Squeeze the log tight', 'Breathe behind the load', 'Stay upright'],
    muscleGroups: ['biceps', 'core', 'forearms'],
    equipment: ['log'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'bear hug carry strongman stone carry technique'
  },

  // ── Animal Flow ──
  bear_crawl: {
    id: 'bear_crawl', name: 'Bear Crawl', category: 'animal_flow',
    trackingType: 'timed', defaultSeconds: 30,
    description: 'Hands and feet, knees hovering, move forward.',
    cues: ['Knees 1 inch off ground', 'Opposite hand/foot', 'Flat back', 'Quiet movement'],
    muscleGroups: ['shoulders', 'core', 'quads'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'bear crawl exercise proper form technique'
  },
  crab_walk: {
    id: 'crab_walk', name: 'Crab Walk', category: 'animal_flow',
    trackingType: 'timed', defaultSeconds: 30,
    description: 'Face up, hands and feet, walk backward.',
    cues: ['Hips up high', 'Open chest', 'Opposite hand/foot', 'Controlled movement'],
    muscleGroups: ['triceps', 'glutes', 'shoulders'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'crab walk exercise form bodyweight'
  },
  qm_movement: {
    id: 'qm_movement', name: 'QM (Quadrupedal Movement)', category: 'animal_flow',
    trackingType: 'timed', defaultSeconds: 30,
    description: 'Multi-directional ground movement on hands and feet. Knees hover 1 inch off the ground. Move forward, backward, sideways.',
    cues: ['Stay low', 'Move in all directions', 'Smooth transitions', 'Control your breath'],
    muscleGroups: ['full_body'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'quadrupedal movement QM animal flow ground movement'
  },
  lateral_ape: {
    id: 'lateral_ape', name: 'Lateral Ape', category: 'animal_flow',
    trackingType: 'timed', defaultSeconds: 20,
    description: 'Lateral hop in deep crouch position — modified for hip safety. Hands touch ground, shift sideways.',
    cues: ['Hands down first', 'Lateral shift, not deep squat', 'Stay controlled', 'Light feet'],
    muscleGroups: ['shoulders', 'core', 'quads'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'low' },
    videoSearch: 'lateral ape animal flow movement tutorial'
  },
  scorpion: {
    id: 'scorpion', name: 'Scorpion', category: 'animal_flow',
    trackingType: 'reps', defaultReps: 8,
    description: 'Prone, sweep leg across body for thoracic rotation. Lie face down, sweep one foot toward opposite hand.',
    cues: ['Face down start', 'Sweep foot to opposite hand', 'Open through thoracic', 'Control the range'],
    muscleGroups: ['core', 'mobility'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'scorpion stretch exercise thoracic rotation'
  },
  crocodile_walk: {
    id: 'crocodile_walk', name: 'Crocodile Walk', category: 'animal_flow',
    trackingType: 'timed', defaultSeconds: 20,
    description: 'Low push-up position crawl. Chest stays near the ground as you crawl forward.',
    cues: ['Stay very low', 'Chest near ground', 'Opposite hand/foot', 'Predator energy'],
    muscleGroups: ['chest', 'shoulders', 'core'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'crocodile walk exercise military crawl low crawl'
  },
  inchworm: {
    id: 'inchworm', name: 'Inchworm', category: 'animal_flow',
    trackingType: 'reps', defaultReps: 6,
    description: 'Walk hands out to plank, walk feet to hands. Standing to plank and back.',
    cues: ['Straight legs on walk-in', 'Plank position at extension', 'Hamstring stretch on return'],
    muscleGroups: ['hamstrings', 'shoulders', 'core'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'inchworm exercise walkout form technique'
  },
  beast_reach: {
    id: 'beast_reach', name: 'Beast Reach', category: 'animal_flow',
    trackingType: 'reps', defaultReps: 8,
    description: 'From beast (loaded bear) position with knees hovering, reach one arm forward and rotate.',
    cues: ['Knees hover 1 inch', 'Reach forward and rotate', 'Anti-rotation at hips', 'Alternate sides'],
    muscleGroups: ['core', 'shoulders'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'beast reach animal flow loaded beast position'
  },

  // ── Core ──
  dead_bug: {
    id: 'dead_bug', name: 'Dead Bug', category: 'core',
    trackingType: 'reps', defaultReps: 10,
    description: 'On your back, extend opposite arm and leg while keeping low back pressed to ground.',
    cues: ['Low back pressed to ground', 'Opposite arm and leg', 'Slow and controlled', 'Exhale on extension'],
    muscleGroups: ['core'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'dead bug exercise core proper form'
  },
  plank: {
    id: 'plank', name: 'Plank', category: 'core',
    trackingType: 'hold', defaultSeconds: 45,
    description: 'Forearm plank hold.',
    cues: ['Elbows under shoulders', 'Body straight as steel', 'Squeeze glutes', 'Breathe steady'],
    muscleGroups: ['core'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'forearm plank proper form technique'
  },
  side_plank: {
    id: 'side_plank', name: 'Side Plank', category: 'core',
    trackingType: 'hold', defaultSeconds: 30,
    description: 'Side forearm plank, each side.',
    cues: ['Elbow under shoulder', 'Hips stacked', 'Top arm to sky', 'Breathe through it'],
    muscleGroups: ['obliques', 'core'],
    equipment: [], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'side plank form technique obliques'
  },
  hanging_knee_raise: {
    id: 'hanging_knee_raise', name: 'Hanging Knee Raise', category: 'core',
    trackingType: 'reps', defaultReps: 8,
    description: 'Hang from bar, raise knees to 90 degrees max.',
    cues: ['Dead hang start', 'Knees to 90 ONLY — not higher', 'Control the swing', 'Slow negative'],
    muscleGroups: ['core', 'hip_flexors'],
    equipment: ['pullup_bar'], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'hanging knee raise proper form ab exercise'
  },
  suitcase_carry: {
    id: 'suitcase_carry', name: 'Suitcase Carry', category: 'core',
    trackingType: 'timed', defaultSeconds: 40,
    description: 'One-sided carry, anti-lateral flexion. Carry weight on one side, stay perfectly vertical.',
    cues: ['One block at side', 'Stay perfectly vertical', 'Fight the lean', 'Switch sides'],
    muscleGroups: ['obliques', 'grip', 'core'],
    equipment: ['cinder_block'], terrain: 'flat',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'suitcase carry exercise anti lateral flexion core'
  },
  anti_rotation_hold: {
    id: 'anti_rotation_hold', name: 'Anti-Rotation Hold', category: 'core',
    trackingType: 'hold', defaultSeconds: 20,
    description: 'Press hands forward against rotational force. Pallof press hold.',
    cues: ['Arms extended', 'Resist the pull', 'Core locked', 'Both sides'],
    muscleGroups: ['core', 'obliques'],
    equipment: [], terrain: 'any',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'pallof press hold anti rotation core exercise'
  },

  // ── Shooting ──
  prone_rifle: {
    id: 'prone_rifle', name: 'Prone Rifle', category: 'shooting',
    trackingType: 'reps', defaultReps: 5,
    description: 'Prone position, steady precision shots.',
    cues: ['Natural point of aim', 'Breathe, pause, squeeze', 'Follow through', 'Call your shots'],
    muscleGroups: [],
    equipment: ['rifle'], terrain: 'firing_line',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'prone rifle shooting position technique'
  },
  kneeling_rifle: {
    id: 'kneeling_rifle', name: 'Kneeling Rifle', category: 'shooting',
    trackingType: 'reps', defaultReps: 5,
    description: 'Kneeling position shots.',
    cues: ['Elbow on knee for support', 'Steady breath', 'Squeeze dont pull', 'Modified kneeling OK for hip'],
    muscleGroups: [],
    equipment: ['rifle'], terrain: 'firing_line',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'kneeling rifle shooting position technique'
  },
  standing_rifle: {
    id: 'standing_rifle', name: 'Standing Unsupported', category: 'shooting',
    trackingType: 'reps', defaultReps: 5,
    description: 'Standing unsupported rifle shots. Hardest position.',
    cues: ['Feet shoulder width', 'Support hand under forestock', 'Accept the wobble', 'Break clean'],
    muscleGroups: [],
    equipment: ['rifle'], terrain: 'firing_line',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'standing offhand rifle shooting technique'
  },
  stress_shoot: {
    id: 'stress_shoot', name: 'Stress Shoot', category: 'shooting',
    trackingType: 'reps', defaultReps: 5,
    description: 'Sprint to position, get on target ASAP, fire for accuracy.',
    cues: ['Sprint hard to line', 'Drop into position fast', 'Control breathing — find the pause', 'Accuracy over speed'],
    muscleGroups: [],
    equipment: ['rifle'], terrain: 'firing_line',
    constraints: { kneesSafe: true, hipSafe: true, impactLevel: 'none' },
    videoSearch: 'stress shooting drill sprint and shoot'
  },
};

export const exerciseList = Object.values(exercises);

export function getExercise(id) {
  return exercises[id] || null;
}

export function getByCategory(category) {
  return exerciseList.filter(e => e.category === category);
}

// Called exercise pool — quick micro-workout tasks
export const calledExercises = [
  { exerciseId: 'pullups', prescription: '5 Pull-Ups' },
  { exerciseId: 'dead_hang', prescription: '30s Dead Hang' },
  { exerciseId: 'draw_sprint', prescription: 'One Draw Sprint' },
  { exerciseId: 'driveway_sprint', prescription: 'Driveway Sprint — house to road' },
  { exerciseId: 'pushups', prescription: '15 Push-Ups' },
  { exerciseId: 'qm_movement', prescription: '20s QM Hold' },
  { exerciseId: 'plank', prescription: '45s Plank' },
  { exerciseId: 'bear_crawl', prescription: '30s Bear Crawl' },
  { exerciseId: 'dead_bug', prescription: '10 Dead Bugs' },
  { exerciseId: 'calf_raises', prescription: '20 Calf Raises' },
  { exerciseId: 'wall_sit', prescription: '30s Wall Sit' },
];
