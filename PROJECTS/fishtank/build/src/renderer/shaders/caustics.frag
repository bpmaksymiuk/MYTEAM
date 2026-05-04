precision highp float;

varying vec2 vUv;

uniform float uTime;
uniform float uCausticIntensity;

float hash(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv1 = vUv * 4.0 + vec2(uTime * 0.07, uTime * 0.05);
  vec2 uv2 = vUv * 6.5 - vec2(uTime * 0.04, uTime * 0.08);
  float n = noise(uv1) * 0.6 + noise(uv2) * 0.4;
  float caustic = pow(n, 2.2) * uCausticIntensity;
  vec3 lightColor = vec3(0.45, 0.72, 0.95);
  gl_FragColor = vec4(lightColor * caustic, caustic * 0.6);
}
