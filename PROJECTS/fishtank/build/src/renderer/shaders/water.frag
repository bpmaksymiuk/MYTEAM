precision highp float;

varying vec2 vUv;
varying float vHeight;

uniform float uTime;

void main() {
  vec3 deepColor    = vec3(0.02, 0.07, 0.18);
  vec3 shallowColor = vec3(0.05, 0.18, 0.32);
  float t = clamp(vHeight * 8.0 + 0.5, 0.0, 1.0);
  vec3 col = mix(deepColor, shallowColor, t);
  float alpha = 0.72 + vHeight * 0.3;
  gl_FragColor = vec4(col, clamp(alpha, 0.6, 0.88));
}
