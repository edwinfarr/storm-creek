// Station definitions — terrain points on the 50-acre property
// Transit times in seconds between stations

export const defaultStations = {
  house: {
    id: 'house', name: 'The House', shortName: 'House',
    description: 'Pull-up bar, flat ground. Start/finish point.',
    equipment: ['pullup_bar'],
    terrain: 'flat',
    icon: '\u2302' // house symbol
  },
  treehouse: {
    id: 'treehouse', name: 'Treehouse', shortName: 'Treehouse',
    description: 'Elevated platform, NW corner. Lookout point in the tree canopy.',
    equipment: [],
    terrain: 'elevated',
    icon: '\u25B2' // triangle
  },
  workshop: {
    id: 'workshop', name: 'Workshop Yard', shortName: 'Workshop',
    description: 'Mid-property clearing. Logs, cinder blocks, flat work area.',
    equipment: ['log', 'cinder_block', 'ruck'],
    terrain: 'flat',
    icon: '\u2692' // hammer/pick
  },
  south_clearing: {
    id: 'south_clearing', name: 'South Clearing', shortName: 'S. Clearing',
    description: 'Bottom clearing on west side. Open ground for sprints and flow.',
    equipment: [],
    terrain: 'flat',
    icon: '\u25CB' // circle
  },
  creek_bottom: {
    id: 'creek_bottom', name: 'Creek Bottom', shortName: 'Creek',
    description: 'Eastern edge along Storm Creek. Rocks, mud, uneven ground.',
    equipment: [],
    terrain: 'creek',
    icon: '\u2248' // water waves
  },
  draw: {
    id: 'draw', name: 'Draw Sprint', shortName: 'Draw',
    description: 'Any of the 5 steep draws. ~100ft elevation gain. Sprint up, walk down.',
    equipment: [],
    terrain: 'draw',
    icon: '\u2197' // NE arrow (uphill)
  },
  firing_line: {
    id: 'firing_line', name: 'Firing Line', shortName: 'Firing',
    description: 'Draw backstop or downhill toward 8ac east of creek. Natural 3-sided backstop.',
    equipment: ['rifle'],
    terrain: 'firing_line',
    icon: '\u2316' // crosshair
  }
};

// Default transit times (seconds) between stations
export const defaultTransitTimes = {
  'house->workshop': 180,
  'house->treehouse': 150,
  'house->draw': 90,
  'house->creek_bottom': 240,
  'house->south_clearing': 300,
  'house->firing_line': 120,
  'workshop->south_clearing': 120,
  'workshop->draw': 60,
  'workshop->creek_bottom': 240,
  'workshop->firing_line': 90,
  'south_clearing->draw': 90,
  'south_clearing->creek_bottom': 180,
  'south_clearing->firing_line': 120,
  'creek_bottom->draw': 90,
  'creek_bottom->house': 300, // uphill takes longer
  'draw->firing_line': 30,
  'treehouse->house': 150,
  'treehouse->draw': 120,
};

export function getTransitTime(from, to) {
  const key1 = `${from}->${to}`;
  const key2 = `${to}->${from}`;
  return defaultTransitTimes[key1] || defaultTransitTimes[key2] || 120;
}

export function formatTransitTime(seconds) {
  const min = Math.round(seconds / 60);
  return min <= 1 ? '~1 min' : `~${min} min`;
}

// ── Generic Station Presets ──
// For friends / guests who don't have Ed's property

export const stationPresets = {
  storm_creek: {
    name: 'Storm Creek (Original)',
    description: '50 acres, Caswell County NC',
    stations: defaultStations,
    transitTimes: defaultTransitTimes
  },
  backyard: {
    name: 'Backyard Setup',
    description: 'Small yard with basic equipment',
    stations: {
      house: {
        id: 'house', name: 'Home Base', shortName: 'Home',
        description: 'Pull-up bar, start/finish. Garage or porch area.',
        equipment: ['pullup_bar'], terrain: 'flat', icon: '\u2302'
      },
      treehouse: {
        id: 'treehouse', name: 'Far Corner', shortName: 'Corner',
        description: 'Farthest point from home base.',
        equipment: [], terrain: 'flat', icon: '\u25B2'
      },
      workshop: {
        id: 'workshop', name: 'Equipment Zone', shortName: 'Equipment',
        description: 'Where your weights, blocks, and gear live.',
        equipment: ['log', 'cinder_block', 'ruck'], terrain: 'flat', icon: '\u2692'
      },
      south_clearing: {
        id: 'south_clearing', name: 'Open Area', shortName: 'Open',
        description: 'Largest open space. Sprint shuttles and ground work.',
        equipment: [], terrain: 'flat', icon: '\u25CB'
      },
      creek_bottom: {
        id: 'creek_bottom', name: 'Rough Ground', shortName: 'Rough',
        description: 'Any uneven terrain nearby — grass, gravel, dirt.',
        equipment: [], terrain: 'flat', icon: '\u2248'
      },
      draw: {
        id: 'draw', name: 'Hill Sprint', shortName: 'Hill',
        description: 'Any hill or incline. Driveway, embankment, stairs.',
        equipment: [], terrain: 'draw', icon: '\u2197'
      },
      firing_line: {
        id: 'firing_line', name: 'Skill Station', shortName: 'Skill',
        description: 'Shooting station (if applicable) or balance/agility area.',
        equipment: [], terrain: 'flat', icon: '\u2316'
      }
    },
    transitTimes: {
      'house->workshop': 30,
      'house->treehouse': 45,
      'house->draw': 30,
      'house->creek_bottom': 60,
      'house->south_clearing': 45,
      'house->firing_line': 30,
      'workshop->south_clearing': 30,
      'workshop->draw': 30,
      'workshop->creek_bottom': 45,
      'workshop->firing_line': 30,
      'south_clearing->draw': 30,
      'south_clearing->creek_bottom': 30,
      'south_clearing->firing_line': 30,
      'creek_bottom->draw': 30,
      'creek_bottom->house': 60,
      'draw->firing_line': 15,
      'treehouse->house': 45,
      'treehouse->draw': 30,
    }
  },
  park: {
    name: 'Public Park',
    description: 'Trails, hills, playground pull-up bar',
    stations: {
      house: {
        id: 'house', name: 'Parking / Trailhead', shortName: 'Start',
        description: 'Where you start. Pull-up bar at playground if available.',
        equipment: ['pullup_bar'], terrain: 'flat', icon: '\u2302'
      },
      treehouse: {
        id: 'treehouse', name: 'Overlook', shortName: 'Overlook',
        description: 'Highest point or scenic overlook on the trail.',
        equipment: [], terrain: 'elevated', icon: '\u25B2'
      },
      workshop: {
        id: 'workshop', name: 'Picnic Area', shortName: 'Picnic',
        description: 'Flat area with benches. Bring your gear here.',
        equipment: ['cinder_block', 'ruck'], terrain: 'flat', icon: '\u2692'
      },
      south_clearing: {
        id: 'south_clearing', name: 'Ball Field', shortName: 'Field',
        description: 'Open field for sprints, shuttle runs, ground flow.',
        equipment: [], terrain: 'flat', icon: '\u25CB'
      },
      creek_bottom: {
        id: 'creek_bottom', name: 'Creek / Low Trail', shortName: 'Creek',
        description: 'Lower trail section or creek area.',
        equipment: [], terrain: 'creek', icon: '\u2248'
      },
      draw: {
        id: 'draw', name: 'Trail Hill', shortName: 'Hill',
        description: 'Steepest section of the trail. Sprint up, walk down.',
        equipment: [], terrain: 'draw', icon: '\u2197'
      },
      firing_line: {
        id: 'firing_line', name: 'Agility Station', shortName: 'Agility',
        description: 'Balance beam, agility ladder, or any skill work spot.',
        equipment: [], terrain: 'flat', icon: '\u2316'
      }
    },
    transitTimes: {
      'house->workshop': 120,
      'house->treehouse': 180,
      'house->draw': 90,
      'house->creek_bottom': 150,
      'house->south_clearing': 120,
      'house->firing_line': 60,
      'workshop->south_clearing': 60,
      'workshop->draw': 60,
      'workshop->creek_bottom': 120,
      'workshop->firing_line': 60,
      'south_clearing->draw': 60,
      'south_clearing->creek_bottom': 90,
      'south_clearing->firing_line': 60,
      'creek_bottom->draw': 60,
      'creek_bottom->house': 180,
      'draw->firing_line': 30,
      'treehouse->house': 180,
      'treehouse->draw': 90,
    }
  }
};

export function getPresetNames() {
  return Object.entries(stationPresets).map(([id, p]) => ({
    id, name: p.name, description: p.description
  }));
}
