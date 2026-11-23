export const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'study', label: 'Study AI' },
  { id: 'calculator', label: 'Calculator' },
  { id: 'tools', label: 'Tools' },
  { id: 'esports', label: 'Esports' },
  { id: 'community', label: 'Community' },
  { id: 'profile', label: 'Profile' },
];

export const CORE_PILLARS = [
  {
    num: '01',
    eyebrow: '01 · Main Competition Feature · Backend AI',
    title: 'AI Study Assistant',
    description:
      'Upload PDF, DOCX, or class notes to generate chapter summaries, MCQs, short/long questions, English or Urdu explanations, practice tests, and revision flashcards via our secure Gemini backend.',
    cta: 'Open Study AI',
    targetView: 'study',
    previewType: 'study',
  },
  {
    num: '02',
    eyebrow: '02 · Instant Math & Converters (No AI)',
    title: 'Smart Calculator',
    description:
      'Run scientific calculations in DEG/RAD mode, solve linear and quadratic equations step-by-step, convert scientific units, and compute semester GPA instantly.',
    cta: 'Launch Calculator',
    targetView: 'calculator',
    previewType: 'calculator',
  },
  {
    num: '03',
    eyebrow: '03 · Utilities + Backend AI Studio',
    title: 'Student & AI Tools',
    description:
      'Use instant non-AI text formatters, word counters, and JSON/Base64 converters alongside backend Gemini AI writing, summarizing, explaining, and translation.',
    cta: 'Open Tools',
    targetView: 'tools',
    previewType: 'tools',
  },
  {
    num: '04',
    eyebrow: '04 · PUBG Mobile Arena',
    title: 'Esports Hub',
    description:
      'Track PUBG Mobile Esports updates, join Blitz Official Scrims, browse tournaments, inspect team rosters, train in Esports Academy, and climb the leaderboard.',
    cta: 'Enter Esports Hub',
    targetView: 'esports',
    previewType: 'esports',
  },
  {
    num: '05',
    eyebrow: '05 · Daily Execution',
    title: 'Student Productivity',
    description:
      'Organize study tasks, set exam reminders, run 25-minute focus sprints, and monitor your quiz accuracy and chapter mastery from one streamlined planner.',
    cta: 'Open Planner',
    targetView: 'community',
    previewType: 'productivity',
  },
  {
    num: '06',
    eyebrow: '06 · Verified Orgs & Squads',
    title: 'Blitz Community',
    description:
      'Connect with Blitz Official Scrims, Nice Esports, Leader Esports, and 56 Esports. Follow official announcements across WhatsApp, Instagram, and Discord.',
    cta: 'Join Community',
    targetView: 'community',
    previewType: 'community',
  },
];

export const SAMPLE_CHAPTERS = [
  {
    id: 'physics-motion',
    title: "Physics Ch. 3: Newton's Laws of Motion",
    content: `Newton's First Law (Law of Inertia) states that an object remains at rest or in uniform motion in a straight line unless acted upon by a net external force. Inertia is directly proportional to the mass of a body.

Newton's Second Law states that the rate of change of linear momentum of a body is directly proportional to the applied net force and takes place in the direction of the force: F = m * a, where F is net force in Newtons (N), m is mass in kilograms (kg), and a is acceleration in m/s^2.

Newton's Third Law states that for every action force there is an equal in magnitude and opposite in direction reaction force, acting on two different bodies. Momentum p = m * v is conserved in an isolated system with zero external net force.`,
  },
  {
    id: 'cs-dsa',
    title: 'CS Ch. 2: Stacks, Queues & Binary Search',
    content: `A Stack is a linear data structure that follows LIFO (Last In, First Out) ordering. Core operations are push (O(1)), pop (O(1)), and peek (O(1)). Stacks are used for function call frames, undo history, and balanced parenthesis checking.

A Queue follows FIFO (First In, First Out) ordering with enqueue at the rear and dequeue at the front, supporting task scheduling and breadth-first search (BFS).

Binary Search finds a target value inside a sorted array by repeatedly dividing the search interval in half. Its worst-case time complexity is O(log n) and space complexity is O(1) iteratively.`,
  },
  {
    id: 'bio-cell',
    title: 'Biology Ch. 4: Mitosis & Cellular Respiration',
    content: `Mitosis is nuclear division producing two genetically identical diploid daughter cells across four primary phases: Prophase (chromatin condenses), Metaphase (chromosomes align at the equatorial plate), Anaphase (sister chromatids separate), and Telophase (nuclear envelopes reform).

Cellular respiration converts glucose and oxygen into ATP energy inside mitochondria: C6H12O6 + 6O2 -> 6CO2 + 6H2O + ATP. Glycolysis occurs in the cytoplasm, followed by the Krebs cycle and oxidative phosphorylation in the mitochondrion.`,
  },
];

export const TESTIMONIALS = [
  {
    name: 'Hamza Tariq',
    role: 'BSCS Student · Lahore',
    initials: 'HT',
    quote:
      'Uploading my lecture PDF and getting instant Urdu explanations plus MCQs cut my exam prep time in half.',
  },
  {
    name: 'Areeba Khan',
    role: 'Pre-Med · Karachi',
    initials: 'AK',
    quote:
      'The practice tests and flip flashcards helped me jump from 68% to 92% in Biology quizzes within two weeks.',
  },
  {
    name: 'Zain "Nova" Malik',
    role: 'IGL · Blitz Alpha',
    initials: 'ZM',
    quote:
      'Having my study planner and Blitz Official Scrims schedule on one dashboard keeps my academics and squad balanced.',
  },
  {
    name: 'Bilal Ahmed',
    role: 'Engineering · Islamabad',
    initials: 'BA',
    quote:
      'The Smart Calculator quadratic solver shows the discriminant and exact steps cleanly without switching apps.',
  },
  {
    name: 'Sana Fatima',
    role: 'BBA Student · Multan',
    initials: 'SF',
    quote:
      'AI Tools summarizes dense 10-page reading assignments into crisp bullet points I can revise before class.',
  },
  {
    name: 'Usman Raza',
    role: 'Assaulter · 56 Esports',
    initials: 'UR',
    quote:
      'Esports Academy sensitivity drills and clean leaderboard tracking make Blitz Community stand out for PUBG Mobile squads.',
  },
  {
    name: 'Danish Ali',
    role: 'FSc Pre-Eng · Faisalabad',
    initials: 'DA',
    quote:
      'Converting my physics chapters into flashcards and short questions saved hours every night before board mocks.',
  },
  {
    name: 'Hira Noor',
    role: 'CS Undergrad · Rawalpindi',
    initials: 'HN',
    quote:
      'The Pomodoro timer and daily task list right beside our community announcements keep my semester on track.',
  },
];

export const ESPORTS_SUBSECTIONS = [
  { id: 'news', label: 'PUBG Mobile Esports' },
  { id: 'scrims', label: 'Blitz Official Scrims' },
  { id: 'communities', label: 'Communities' },
  { id: 'tournaments', label: 'Tournaments' },
  { id: 'rosters', label: 'Teams & Rosters' },
  { id: 'academy', label: 'Esports Academy' },
  { id: 'streamers', label: 'Streamer Zone' },
  { id: 'leaderboard', label: 'Leaderboard' },
];

export const ESPORTS_NEWS = [
  {
    tag: 'PMGC / Regional Meta',
    date: 'Nov 2026',
    title: 'Erangel & Miramar Zone 4 Rotation Shifts Favor Double-Scout Splits',
    summary:
      'Top regional rosters are prioritizing early vehicle control and utility conservation for late-circle compound holds.',
  },
  {
    tag: 'Blitz Circuit',
    date: 'Nov 2026',
    title: 'Blitz Winter Scrims Series Opens 64 Squad Slots Across 4 Lobbies',
    summary:
      'Verified teams from Nice Esports, Leader Esports, and 56 Esports headline Group A qualifiers.',
  },
  {
    tag: 'Loadout Patch Watch',
    date: 'Oct 2026',
    title: '5.56mm Mid-Range Spray Stability & Smoke Timing Updates',
    summary:
      'Esports Academy updated M416 + Mini14 training codes for 90fps and 120fps gyroscope players.',
  },
];

export const SCRIMS_SCHEDULE = [
  {
    id: 'scrim-t1',
    tier: 'Tier 1 Invitational',
    time: 'Daily · 9:00 PM PKT',
    maps: 'Erangel · Miramar · Sanhok · Erangel',
    slots: '18 / 20 Squads',
    status: 'Open',
  },
  {
    id: 'scrim-t2',
    tier: 'Tier 2 Student Qualifiers',
    time: 'Mon / Wed / Fri · 8:00 PM PKT',
    maps: 'Erangel · Miramar · Erangel',
    slots: '14 / 20 Squads',
    status: 'Open',
  },
  {
    id: 'scrim-weekend',
    tier: 'Blitz Weekend Clash',
    time: 'Saturday · 7:30 PM PKT',
    maps: '4-Match Custom Room',
    slots: '20 / 20 Squads',
    status: 'Full',
  },
];

export const TOURNAMENTS_DATA = {
  upcoming: [
    {
      name: 'BLITZ Campus Cup Season 4',
      date: 'Dec 05, 2026',
      prize: 'PKR 150,000 + Trophy',
      format: '64 Squads · TPP Classic',
      status: 'Registration Open',
    },
    {
      name: 'Nice x Blitz Tri-Org Showdown',
      date: 'Dec 18, 2026',
      prize: 'PKR 75,000',
      format: '20 Invited Squads · 6 Maps',
      status: 'Qualifiers Soon',
    },
  ],
  previous: [
    {
      name: 'Blitz Autumn Clash',
      winner: 'Leader Esports',
      runnerUp: '56 Esports',
      mvp: 'LDRxApex (29 Finishes)',
    },
    {
      name: 'Student Hub Kickoff Cup',
      winner: 'Nice Esports',
      runnerUp: 'Blitz Alpha',
      mvp: 'NICExVortex (24 Finishes)',
    },
  ],
};

export const TEAMS_ROSTERS = [
  {
    team: 'Blitz Official Scrims — Alpha',
    tag: 'BLZ',
    region: 'Pakistan · T1',
    players: [
      { ign: 'BLZxNova', role: 'IGL' },
      { ign: 'BLZxKage', role: 'Assaulter' },
      { ign: 'BLZxRift', role: 'Sniper / Support' },
      { ign: 'BLZxEcho', role: 'Entry Fragger' },
    ],
  },
  {
    team: 'Nice Esports',
    tag: 'NICE',
    region: 'Pakistan · T1',
    players: [
      { ign: 'NICExVortex', role: 'IGL' },
      { ign: 'NICExZed', role: 'Entry Fragger' },
      { ign: 'NICExPulse', role: 'Assaulter' },
      { ign: 'NICExSora', role: 'Support' },
    ],
  },
  {
    team: 'Leader Esports',
    tag: 'LDR',
    region: 'Pakistan · T1',
    players: [
      { ign: 'LDRxApex', role: 'Assaulter' },
      { ign: 'LDRxReign', role: 'IGL' },
      { ign: 'LDRxFury', role: 'Fragger' },
      { ign: 'LDRxMilo', role: 'Support' },
    ],
  },
  {
    team: '56 Esports',
    tag: '56E',
    region: 'Pakistan · T1',
    players: [
      { ign: '56xRaider', role: 'IGL' },
      { ign: '56xUsman', role: 'Assaulter' },
      { ign: '56xGhost', role: 'Scout' },
      { ign: '56xTitan', role: 'Support' },
    ],
  },
];

export const ACADEMY_GUIDES = [
  {
    title: '4-Finger Claw & Full Gyroscope Warmup (15 Min)',
    level: 'Beginner -> Intermediate',
    drills: [
      '5 min hip-fire crouch-strafe tracking on moving targets at 20m',
      '5 min 3x/4x M416 spray transfer across 3 compound windows',
      '5 min bolt-action quick-peek & smoke timing drills',
    ],
  },
  {
    title: 'IGL Macro & Circle 3-5 Compound Priority',
    level: 'Competitive Squads',
    drills: [
      'Assign 1 dedicated vehicle scout before Phase 2 closes',
      'Hold minimum 4 smokes + 2 molotovs per player entering Phase 4',
      'Call concise 5-second clear comms during third-party pushes',
    ],
  },
];

export const LEADERBOARD_ROWS = [
  { rank: 1, team: 'Leader Esports', wwcd: 4, placement: 58, finishes: 74, total: 132 },
  { rank: 2, team: 'Nice Esports', wwcd: 3, placement: 52, finishes: 69, total: 121 },
  { rank: 3, team: '56 Esports', wwcd: 3, placement: 49, finishes: 63, total: 112 },
  { rank: 4, team: 'Blitz Alpha', wwcd: 2, placement: 46, finishes: 61, total: 107 },
  { rank: 5, team: 'Falcon Campus', wwcd: 1, placement: 39, finishes: 48, total: 87 },
  { rank: 6, team: 'Valor X', wwcd: 1, placement: 34, finishes: 42, total: 76 },
];

export const COMMUNITY_ORGS = [
  {
    name: 'Blitz Official Scrims',
    configKey: 'blitzScrims',
    badge: 'Host Org',
    members: '1,200+ Players',
    description:
      'Daily competitive custom rooms, fair-play observer monitoring, instant point tables, and student qualifier lobbies.',
  },
  {
    name: 'Nice Esports',
    configKey: 'niceEsports',
    badge: 'Partner Org',
    members: '650+ Members',
    description:
      'Tier-1 PUBG Mobile roster, community tryouts, and weekend invitational showdown partner.',
  },
  {
    name: 'Leader Esports',
    configKey: 'leaderEsports',
    badge: 'Partner Org',
    members: '540+ Members',
    description:
      'Reigning Autumn Clash champions hosting tactical VOD reviews and squad coaching.',
  },
  {
    name: '56 Esports',
    configKey: 'esports56',
    badge: 'Partner Org',
    members: '490+ Members',
    description:
      'Fast-rising competitive collective running grassroots recruitment and creator collaborations.',
  },
];
