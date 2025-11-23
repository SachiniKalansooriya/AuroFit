// Utility to map exercise names to local image assets
const normalize = (s: string | undefined) =>
  (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '')
    .trim();

// Primary explicit mappings for known exercise images
const explicit: { [key: string]: any } = {
  singlelegpress: require('../../assets/images/single_leg_press.jpg'),
  landminetwist: require('../../assets/images/landmine_twist.jpg'),
  weightedpullup: require('../../assets/images/weighted pull up.jpg'),
  baebelldeficitdeadlift: require('../../assets/images/baebell_deficit_deadlift.jpg'),
  bicycling: require('../../assets/images/bicycling.jpg'),
  cleandeadlift: require('../../assets/images/clean_deadlift.jpg'),
  cleanfromblocks: require('../../assets/images/clean_from_blocks.jpg'),
  dumbbellromaniandeadlift: require('../../assets/images/Dumbbell-Romanian-Deadlift.jpg'),
  groiners: require('../../assets/images/groiners.jpg'),
  hangclean: require('../../assets/images/hang_clean.jpg'),
  hipcircles: require('../../assets/images/img1.jpg'),
  inclinehammercurls: require('../../assets/images/incline_hammer_curls.jpg'),
  jumpingrope: require('../../assets/images/jumping_rope.jpg'),
  rickshawcarry: require('../../assets/images/rickshaw_carry.jpg'),
  seatedfingercurl: require('../../assets/images/seated finger curl.jpg'),
  sidewristpull: require('../../assets/images/side_wrist_pull.jpg'),
  stairclimber: require('../../assets/images/stair_climber.jpg'),
  standingbehindback: require('../../assets/images/standing_behind_back.jpg'),
  standinghipcircles: require('../../assets/images/standing_hip_circles.jpg'),
  standinglegswing: require('../../assets/images/standing_leg_swing.jpg'),
  stomachvacuum: require('../../assets/images/stomach_vacuum.jpg'),
  sumodeadlift: require('../../assets/images/sumo_deadlift.jpg'),
  superman: require('../../assets/images/superman.jpg'),
};

// A small pool of fallback images to give each exercise a unique-ish picture
const fallbacks = [
  require('../../assets/images/img1.jpg'),
  require('../../assets/images/img2.jpg'),
  require('../../assets/images/img3.jpg'),
  require('../../assets/images/img4.jpg'),
];

function hashString(s: string) {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h << 5) - h + s.charCodeAt(i);
    h |= 0;
  }
  return Math.abs(h);
}

export function getExerciseImage(name?: string) {
  const key = normalize(name);
  if (!key) return fallbacks[0];
  if (explicit[key]) return explicit[key];

  // pick a fallback deterministically based on the name so images vary
  const idx = hashString(key) % fallbacks.length;
  return fallbacks[idx];
}

export default getExerciseImage;
