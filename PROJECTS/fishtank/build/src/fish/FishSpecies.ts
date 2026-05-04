export interface FishSpecies {
  id: string;
  displayName: string;
  color: number;
  scale: number;
  speed: number;
  weights: {
    seek: number;
    flee: number;
    wander: number;
    separate: number;
    align: number;
    cohere: number;
    avoidObstacle: number;
    preferredY: number;
  };
  preferredY: number;
  // Visual / morphology params
  bodyHeight: number;       // height/length ratio (e.g. 1.4 = tall like angelfish, 0.45 = slim like tetra)
  stripeCount: number;      // number of vertical bands; 0 disables
  stripeColour: number;     // colour of stripes
  lateralLine: number;      // 0..1 emphasis of lateral line stripe
  finRayColour: number;     // dark fin-ray accent colour
  highlightColour: number;  // iridescent highlight colour
}

export const SPECIES: Record<string, FishSpecies> = {
  clownfish: {
    id: 'clownfish', displayName: 'Clownfish', color: 0xff7a1a, scale: 0.18, speed: 1.4,
    weights: { seek:0.6, flee:1.2, wander:0.5, separate:1.5, align:0.8, cohere:0.6, avoidObstacle:2.0, preferredY:0.4 },
    preferredY: 0.5,
    bodyHeight: 0.62, stripeCount: 3, stripeColour: 0xffffff, lateralLine: 0.0,
    finRayColour: 0x141414, highlightColour: 0xffd99a,
  },
  angelfish: {
    id: 'angelfish', displayName: 'Angelfish', color: 0xeac76b, scale: 0.22, speed: 1.1,
    weights: { seek:0.5, flee:1.0, wander:0.6, separate:1.2, align:1.0, cohere:0.9, avoidObstacle:1.8, preferredY:0.5 },
    preferredY: 0.0,
    bodyHeight: 1.35, stripeCount: 4, stripeColour: 0x111111, lateralLine: 0.3,
    finRayColour: 0x1c1c1c, highlightColour: 0xfff4b8,
  },
  tetra: {
    id: 'tetra', displayName: 'Tetra', color: 0x1860c8, scale: 0.12, speed: 1.8,
    weights: { seek:0.7, flee:1.3, wander:0.9, separate:1.4, align:1.5, cohere:1.4, avoidObstacle:1.5, preferredY:0.3 },
    preferredY: 0.2,
    bodyHeight: 0.42, stripeCount: 0, stripeColour: 0x000000, lateralLine: 1.0,
    finRayColour: 0x202028, highlightColour: 0x88e0ff,
  },
  gourami: {
    id: 'gourami', displayName: 'Gourami', color: 0x6a4ecf, scale: 0.20, speed: 0.9,
    weights: { seek:0.4, flee:0.9, wander:0.7, separate:1.0, align:0.7, cohere:0.5, avoidObstacle:1.6, preferredY:0.6 },
    preferredY: 1.0,
    bodyHeight: 0.85, stripeCount: 0, stripeColour: 0x000000, lateralLine: 0.55,
    finRayColour: 0x2b1f4d, highlightColour: 0xc0a8ff,
  },
};

export function areCompatible(a: FishSpecies, b: FishSpecies): boolean {
  // Clownfish and angelfish are mildly aggressive; tetras school with everything
  const aggressive = new Set(['clownfish', 'angelfish']);
  if (aggressive.has(a.id) && aggressive.has(b.id) && a.id !== b.id) return false;
  return true;
}
