// terrain.js — DI-031, AR-019
export const BIOME = { DEEP:0, SHALLOW:1, MUD:2, GRASS:3, SAND:4, CYPRESS:5 };

// Inline 2D Perlin noise (public domain)
const P = new Uint8Array(512);
function fade(t) { return t*t*t*(t*(t*6-15)+10); }
function lerp(t,a,b) { return a+t*(b-a); }
function grad(h,x,y) { const u=h<8?x:y,v=h<4?y:(h===12||h===14)?x:0; return ((h&1)?-u:u)+((h&2)?-v:v); }

function seedRng(s) {
  for (let i=0;i<256;i++) P[i]=i;
  let r=s|0;
  for (let i=255;i>0;i--) {
    r=(r*1664525+1013904223)>>>0;
    const j=r%(i+1);
    const tmp=P[i]; P[i]=P[j]; P[j]=tmp;
  }
  for (let i=0;i<256;i++) P[256+i]=P[i];
}

function noise(x,y) {
  const X=Math.floor(x)&255, Y=Math.floor(y)&255;
  x-=Math.floor(x); y-=Math.floor(y);
  const u=fade(x),v=fade(y);
  const a=P[X]+Y,aa=P[a],ab=P[a+1],b=P[X+1]+Y,ba=P[b],bb=P[b+1];
  return lerp(v, lerp(u,grad(P[aa],x,y),grad(P[ba],x-1,y)),
                  lerp(u,grad(P[ab],x,y-1),grad(P[bb],x-1,y-1)));
}

// Biome colour map
export const BIOME_COLOR = {
  [BIOME.DEEP]:    [27,79,94],
  [BIOME.SHALLOW]: [42,122,142],
  [BIOME.MUD]:     [122,82,48],
  [BIOME.GRASS]:   [46,92,40],
  [BIOME.SAND]:    [184,144,74],
  [BIOME.CYPRESS]: [26,61,32],
};

const BASE_THRESHOLDS = [-0.25, 0.05, 0.18, 0.35, 0.48, 0.62];

export function generateTerrain(seed, W, H, seasonOffset=0) {
  seedRng(seed);
  const [tDeep, tShallow, tMud, tGrass, tSand, tCypress] = BASE_THRESHOLDS.map(v => v + seasonOffset);
  const map = new Uint8Array(W * H);
  for (let y=0;y<H;y++) {
    for (let x=0;x<W;x++) {
      const n = noise(x/120, y/120) + 0.5*noise(x/50, y/50) + 0.25*noise(x/25, y/25);
      let b;
      if      (n < tDeep)    b = BIOME.DEEP;
      else if (n < tShallow) b = BIOME.SHALLOW;
      else if (n < tMud)     b = BIOME.MUD;
      else if (n < tGrass)   b = BIOME.GRASS;
      else if (n < tSand)    b = BIOME.SAND;
      else if (n < tCypress) b = BIOME.CYPRESS;
      else                   b = BIOME.DEEP;
      map[y*W+x] = b;
    }
  }
  return { biomeMap: map, seed };
}

export function zoneAt(biomeMap, x, y, W, H) {
  const ix = Math.max(0, Math.min(W-1, x|0));
  const iy = Math.max(0, Math.min(H-1, y|0));
  return biomeMap[iy*W+ix];
}

export function buildTerrainImageData(biomeMap, W, H) {
  const imgData = new ImageData(W, H);
  const d = imgData.data;
  for (let i=0; i<biomeMap.length; i++) {
    const [r,g,b] = BIOME_COLOR[biomeMap[i]];
    d[i*4]=r; d[i*4+1]=g; d[i*4+2]=b; d[i*4+3]=255;
  }
  return imgData;
}

const SEASONAL_SHIFT = { spring:0, summer:0.04, autumn:-0.02, winter:-0.06 };
export function applyTerrainSeason(terrainState, season) {
  terrainState.seasonOffset = SEASONAL_SHIFT[season] ?? 0;
  terrainState.dirty = true;
}
