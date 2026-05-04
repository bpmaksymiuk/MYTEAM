import * as THREE from 'three';

export interface ScaleTextureOptions {
  scaleRows: number;
  baseColour: string;
  highlightColour: string;
  stripeColour?: string;
  stripeCount?: number;
  lateralLine?: number;
  size?: number;
}

/**
 * Generates a high-detail fish skin texture into a 1024x512 render target.
 *
 * UV convention assumed for the body geometry:
 *   U: 0 = dorsal (top), 0.25 = side, 0.5 = ventral (bottom), 0.75 = side, 1 = dorsal (seam)
 *   V: 0 = head, 1 = tail
 *
 * Bakes the following effects into the texture so the body can use a plain
 * MeshStandardMaterial and benefit from scene PBR lighting:
 *   - countershading (dorsal dark, ventral pale)
 *   - hexagonal scale tessellation with edge AO and per-scale highlight
 *   - iridescent side band
 *   - lateral line stripe (toggled by species)
 *   - gill arch dark curve near head
 *   - vertical species stripes (clownfish-style banding)
 */
export function generateScaleTexture(
  renderer: THREE.WebGLRenderer,
  opts: ScaleTextureOptions
): THREE.Texture {
  const {
    size = 1024,
    scaleRows = 16,
    baseColour,
    highlightColour,
    stripeColour = '#ffffff',
    stripeCount = 0,
    lateralLine = 1.0,
  } = opts;

  const fragShader = /* glsl */ `
    precision highp float;
    uniform vec3 uBase;
    uniform vec3 uHighlight;
    uniform vec3 uStripe;
    uniform float uStripeCount;
    uniform float uLateralLine;
    uniform float uScaleRows;
    varying vec2 vUv;

    // Hex scale distance from cell centre (skewed grid)
    float hexCell(vec2 uv, float density, out vec2 cellId) {
      vec2 p = uv * density;
      // skew so neighbouring rows offset
      vec2 q = vec2(p.x, p.y + p.x * 0.5);
      vec2 ic = floor(q);
      vec2 f  = fract(q) - 0.5;
      cellId = ic;
      // approximate hex distance
      return length(vec2(f.x, f.y - f.x * 0.5));
    }

    float hash(vec2 p) {
      return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
    }

    void main() {
      vec2 uv = vUv;

      // ---- Base body colour with countershading ----
      // topness: 1 at dorsal seam (u=0,1), 0 at ventral (u=0.5)
      float topness = 0.5 + 0.5 * cos(uv.x * 6.2831853);
      // dorsal darkening + ventral lightening
      float shade = 1.0
        - 0.55 * pow(topness, 1.4)
        + 0.45 * pow(1.0 - topness, 2.0);
      shade *= mix(0.85, 1.05, 1.0 - uv.y); // head slightly brighter than tail
      vec3 col = uBase * clamp(shade, 0.35, 1.6);

      // ---- Iridescent side band (peaks at u=0.25 and u=0.75) ----
      float side = abs(sin(uv.x * 6.2831853));
      col += uHighlight * 0.22 * pow(side, 4.0) * (0.6 + 0.4 * sin(uv.y * 9.0));

      // ---- Hex scale pattern ----
      vec2 cellId;
      float hd = hexCell(uv * vec2(2.0, 1.0), uScaleRows, cellId);
      float jitter = hash(cellId) * 0.06;
      float edge = smoothstep(0.36 + jitter, 0.46 + jitter, hd);
      // dark edges (gap between scales)
      col *= 1.0 - 0.22 * edge;
      // small highlight at scale centre (faux specular)
      float centre = 1.0 - smoothstep(0.0, 0.18, hd);
      col += uHighlight * 0.10 * centre;

      // ---- Lateral line ----
      // a horizontal stripe along each side at u=0.25 and u=0.75, slightly above mid
      float lat1 = exp(-pow((uv.x - 0.25) / 0.025, 2.0));
      float lat2 = exp(-pow((uv.x - 0.75) / 0.025, 2.0));
      float latLine = (lat1 + lat2) * smoothstep(0.05, 0.10, uv.y) * smoothstep(0.95, 0.85, uv.y);
      // slightly brighter iridescent line (darker on sides for some species, brighter for tetra)
      col = mix(col, uHighlight * 1.2, latLine * 0.45 * uLateralLine);
      col *= 1.0 - 0.10 * latLine * uLateralLine;

      // ---- Gill arch (dark curve near head) ----
      // curve shape: v_target = 0.13 + 0.04 * |sin(u*pi)|
      float gillV = 0.13 + 0.045 * abs(sin(uv.x * 3.14159));
      float gill = exp(-pow((uv.y - gillV) / 0.018, 2.0));
      // only on sides, not on top/bottom
      gill *= pow(side, 1.5);
      col *= 1.0 - 0.30 * gill;

      // ---- Species stripes (vertical bands around body) ----
      if (uStripeCount > 0.5) {
        float band = sin(uv.y * 3.14159 * uStripeCount * 2.0);
        float bandMask = smoothstep(0.85, 0.95, band);
        // soft white outline edge inside the stripe
        col = mix(col, uStripe, bandMask * 0.9);
        // dark thin edge
        float edgeMask = smoothstep(0.78, 0.86, abs(band)) - smoothstep(0.86, 0.95, abs(band));
        col *= 1.0 - 0.4 * edgeMask;
      }

      // ---- Subtle dorsal shimmer ----
      col += uHighlight * 0.05 * pow(topness, 6.0);

      gl_FragColor = vec4(col, 1.0);
    }
  `;

  const scene = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const geo = new THREE.PlaneGeometry(2, 2);
  const mat = new THREE.ShaderMaterial({
    fragmentShader: fragShader,
    vertexShader: /* glsl */ `
      varying vec2 vUv;
      void main() { vUv = uv; gl_Position = vec4(position, 1.0); }
    `,
    uniforms: {
      uBase:        { value: new THREE.Color(baseColour) },
      uHighlight:   { value: new THREE.Color(highlightColour) },
      uStripe:      { value: new THREE.Color(stripeColour) },
      uStripeCount: { value: stripeCount },
      uLateralLine: { value: lateralLine },
      uScaleRows:   { value: scaleRows },
    },
  });

  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);

  const rt = new THREE.WebGLRenderTarget(size, size / 2, {
    minFilter: THREE.LinearMipmapLinearFilter,
    magFilter: THREE.LinearFilter,
    generateMipmaps: true,
    wrapS: THREE.RepeatWrapping,
    wrapT: THREE.ClampToEdgeWrapping,
  });

  const prev = renderer.getRenderTarget();
  renderer.setRenderTarget(rt);
  renderer.render(scene, camera);
  renderer.setRenderTarget(prev);

  mat.dispose();
  geo.dispose();

  return rt.texture;
}
