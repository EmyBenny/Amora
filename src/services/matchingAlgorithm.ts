import { LoverProfile, FilterSettings } from '../types';

export interface UserPreferences {
  genderPreference: 'all' | 'female' | 'male';
  ageRange: [number, number];
  maxDistanceKm: number;
  passions: string[];
  marchingPassion?: string;
  loveLanguage: string;
}

export interface CompatibilityBreakdown {
  totalScore: number; // 0 to 100
  sharedPassionsCount: number;
  sharedPassions: string[];
  passionScore: number; // max 40
  marchingBonus: number; // max 20
  distanceScore: number; // max 15
  ageScore: number; // max 15
  loveLanguageScore: number; // max 10
  isHardMatch: boolean; // meets gender, age range, and distance limits
}

/**
 * Calculates a comprehensive compatibility score between the current user and a candidate profile.
 * Implements:
 * 1. Hard Preference Gating (Gender, Age range, Distance cap)
 * 2. Shared Passions Jaccard Similarity (Weight: 40%)
 * 3. Marching Band & Musical Harmony Bonus (Weight: 20%)
 * 4. Geographic Proximity Decay (Weight: 15%)
 * 5. Age Proximity Affinity (Weight: 15%)
 * 6. Love Language Alignment (Weight: 10%)
 */
export function calculateCompatibility(
  user: {
    age: number;
    passions: string[];
    marchingLoveInterest?: string;
    loveLanguage: string;
    preferences: FilterSettings;
  },
  candidate: LoverProfile
): CompatibilityBreakdown {
  // 1. Hard Filtering Check
  const genderMatch =
    user.preferences.genderPreference === 'all' ||
    candidate.gender === user.preferences.genderPreference;

  const ageMatch =
    candidate.age >= user.preferences.ageRange[0] &&
    candidate.age <= user.preferences.ageRange[1];

  const distanceMatch = candidate.distanceKm <= user.preferences.maxDistanceKm;

  const isHardMatch = genderMatch && ageMatch && distanceMatch;

  // 2. Shared Passions Jaccard Similarity (Max 40 points)
  const userPassionsSet = new Set(user.passions.map((p) => p.toLowerCase().trim()));
  const candidatePassionsSet = new Set(candidate.passions.map((p) => p.toLowerCase().trim()));

  const sharedPassions: string[] = [];
  candidatePassionsSet.forEach((passion) => {
    if (userPassionsSet.has(passion)) {
      sharedPassions.push(passion);
    }
  });

  const unionCount = new Set([...userPassionsSet, ...candidatePassionsSet]).size;
  const jaccardRatio = unionCount > 0 ? sharedPassions.length / unionCount : 0;
  // Scale Jaccard with a generous floor for romantic openness
  const passionScore = Math.min(40, Math.round(jaccardRatio * 60 + sharedPassions.length * 6));

  // 3. Marching & Musical Connection Harmony (Max 20 points)
  let marchingBonus = 0;
  const marchingKeywords = ['marching', 'brass', 'trumpet', 'drumline', 'percussion', 'trombone', 'flute', 'fanfare'];
  
  const userHasMarching =
    Boolean(user.marchingLoveInterest) ||
    user.passions.some((p) => marchingKeywords.some((kw) => p.toLowerCase().includes(kw)));
  
  const candidateHasMarching =
    Boolean(candidate.marchingLoveInterest) ||
    candidate.passions.some((p) => marchingKeywords.some((kw) => p.toLowerCase().includes(kw)));

  if (userHasMarching && candidateHasMarching) {
    marchingBonus = 20; // Maximum music & marching connection
  } else if (userHasMarching || candidateHasMarching) {
    marchingBonus = 10;
  } else {
    marchingBonus = 6;
  }

  // 4. Geographic Proximity Decay (Max 15 points)
  // Closer candidates score higher: 0km = 15pts, maxDistanceKm = 5pts
  const distanceRatio = Math.max(0, 1 - candidate.distanceKm / (user.preferences.maxDistanceKm * 1.5));
  const distanceScore = Math.round(5 + distanceRatio * 10);

  // 5. Age Proximity Affinity (Max 15 points)
  // Proximity to user's own age or the midpoint of their target range
  const idealAge = (user.preferences.ageRange[0] + user.preferences.ageRange[1]) / 2;
  const ageDelta = Math.abs(candidate.age - idealAge);
  const ageScore = Math.max(4, Math.round(15 - ageDelta * 1.2));

  // 6. Love Language Compatibility (Max 10 points)
  let loveLanguageScore = 5;
  if (
    user.loveLanguage.toLowerCase().includes(candidate.loveLanguage.toLowerCase()) ||
    candidate.loveLanguage.toLowerCase().includes(user.loveLanguage.toLowerCase())
  ) {
    loveLanguageScore = 10;
  }

  // Final Total Score bounded between 60 and 99 for high-intent dating
  const rawTotal = passionScore + marchingBonus + distanceScore + ageScore + loveLanguageScore;
  const totalScore = Math.min(99, Math.max(62, rawTotal));

  return {
    totalScore,
    sharedPassionsCount: sharedPassions.length,
    sharedPassions,
    passionScore,
    marchingBonus,
    distanceScore,
    ageScore,
    loveLanguageScore,
    isHardMatch,
  };
}

/**
 * Ranks candidate profiles by dynamic algorithmic compatibility.
 */
export function rankProfiles(
  user: {
    age: number;
    passions: string[];
    marchingLoveInterest?: string;
    loveLanguage: string;
    preferences: FilterSettings;
  },
  candidates: LoverProfile[]
): { profile: LoverProfile; breakdown: CompatibilityBreakdown }[] {
  return candidates
    .map((candidate) => {
      const breakdown = calculateCompatibility(user, candidate);
      return {
        profile: {
          ...candidate,
          matchScore: breakdown.totalScore,
        },
        breakdown,
      };
    })
    .sort((a, b) => b.breakdown.totalScore - a.breakdown.totalScore);
}
