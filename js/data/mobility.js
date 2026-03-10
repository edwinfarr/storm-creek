// FORGE (warmup) and RECEDE (cooldown) mobility sequences
// Every workout starts with FORGE and ends with RECEDE — non-negotiable

export const forgeSequence = {
  name: 'FORGE',
  description: 'Mobility warmup — wake the body, prepare the joints',
  targetMinutes: 8,
  movements: [
    {
      name: 'Neck Circles',
      seconds: 30,
      cue: 'Slow circles both directions. Release the tension.',
      videoSearch: 'neck circles warmup exercise proper form'
    },
    {
      name: 'Arm Circles',
      seconds: 30,
      cue: 'Small to large, forward and back. Open the shoulders.',
      videoSearch: 'arm circles warmup shoulder mobility'
    },
    {
      name: 'Cat-Cow',
      seconds: 45,
      cue: 'Hands and knees. Arch and round. Breathe deep with each wave.',
      videoSearch: 'cat cow stretch exercise form'
    },
    {
      name: 'Thread the Needle',
      seconds: 45,
      cue: 'Reach under, open chest to sky. Each side. Thoracic gold.',
      videoSearch: 'thread the needle stretch thoracic rotation'
    },
    {
      name: 'Hip Circles (Standing)',
      seconds: 30,
      cue: 'Hands on hips, big circles. Stay within comfortable range.',
      videoSearch: 'standing hip circles warmup mobility'
    },
    {
      name: 'Leg Swings (Front-Back)',
      seconds: 30,
      cue: 'Hold something for balance. Controlled swing, no forcing depth.',
      videoSearch: 'leg swings front to back hip mobility warmup'
    },
    {
      name: 'Leg Swings (Side-Side)',
      seconds: 30,
      cue: 'Cross body and out. Gentle, increasing range.',
      videoSearch: 'lateral leg swings side to side hip warmup'
    },
    {
      name: 'Inchworm',
      seconds: 45,
      cue: 'Walk hands out to plank, walk feet to hands. Hamstring wake-up.',
      videoSearch: 'inchworm exercise walkout form technique'
    },
    {
      name: 'World\'s Greatest Stretch',
      seconds: 60,
      cue: 'Lunge position (short range), rotate and reach. Both sides. Modified depth for hips.',
      videoSearch: 'worlds greatest stretch how to tutorial'
    },
    {
      name: 'Beast Hold + Reach',
      seconds: 45,
      cue: 'Knees hover 1 inch. Reach one arm, return. Anti-rotation primer.',
      videoSearch: 'beast hold reach animal flow loaded beast'
    },
    {
      name: 'Ankle Circles',
      seconds: 30,
      cue: 'Each direction, each foot. Wake up those stabilizers.',
      videoSearch: 'ankle circles mobility warmup exercise'
    },
    {
      name: 'Light Bear Crawl',
      seconds: 30,
      cue: 'Forward and back, 10 feet. Easy pace. Blood flowing.',
      videoSearch: 'bear crawl exercise proper form technique'
    },
    {
      name: 'Breath Reset',
      seconds: 30,
      cue: 'Standing tall. 4 count in, 4 count hold, 4 count out. Set your intention.',
      videoSearch: 'box breathing technique 4 count calm'
    }
  ]
};

export const recedeSequence = {
  name: 'RECEDE',
  description: 'Flexibility cooldown — earn your range, keep your gains',
  targetMinutes: 6,
  movements: [
    {
      name: 'Standing Forward Fold',
      seconds: 45,
      cue: 'Let gravity pull you down. Soft knees OK. Breathe into hamstrings.',
      videoSearch: 'standing forward fold stretch hamstring'
    },
    {
      name: 'Pigeon Stretch (Modified)',
      seconds: 60,
      cue: 'Figure-4 supine version if floor pigeon is too deep. Each side 30s.',
      videoSearch: 'figure 4 stretch supine pigeon hip opener'
    },
    {
      name: '90/90 Hip Stretch',
      seconds: 60,
      cue: 'Sit tall. Front and back leg at 90. Stay within pain-free range. Each side.',
      videoSearch: '90 90 hip stretch mobility how to'
    },
    {
      name: 'Couch Stretch (Wall)',
      seconds: 60,
      cue: 'Rear knee near wall/tree, front foot forward. Quad/hip flexor opener. Modified depth.',
      videoSearch: 'couch stretch hip flexor quad stretch'
    },
    {
      name: 'Seated Spinal Twist',
      seconds: 45,
      cue: 'Legs extended, cross one over. Twist toward bent knee. Each side.',
      videoSearch: 'seated spinal twist stretch form'
    },
    {
      name: 'Lat Stretch (Doorframe/Tree)',
      seconds: 30,
      cue: 'Grab overhead, lean away. Open the whole side body.',
      videoSearch: 'lat stretch doorway overhead side body'
    },
    {
      name: 'Chest Opener',
      seconds: 30,
      cue: 'Hands behind back, open chest, lift. Undo the crawling.',
      videoSearch: 'chest opener stretch hands behind back'
    },
    {
      name: 'Deep Breathing',
      seconds: 45,
      cue: 'Seated or standing. Box breath: 4 in, 4 hold, 4 out, 4 hold. Return to calm.',
      videoSearch: 'box breathing technique cooldown recovery'
    }
  ]
};

export function getMobilityTotalSeconds(sequence) {
  return sequence.movements.reduce((sum, m) => sum + m.seconds, 0);
}
