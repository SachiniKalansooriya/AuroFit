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
