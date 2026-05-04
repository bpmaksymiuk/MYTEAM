precision highp float;

uniform float uTime;
uniform float uWaveAmplitude;
uniform float uWaveFrequency;

varying vec2 vUv;
varying float vHeight;

void main() {
  vUv = uv;
  float wave = sin(position.x * uWaveFrequency + uTime * 1.2)
             * cos(position.z * uWaveFrequency * 0.8 + uTime * 0.9)
             * uWaveAmplitude;
  vHeight = wave;
  vec3 displaced = position + vec3(0.0, wave, 0.0);
  gl_Position = projectionMatrix * modelViewMatrix * vec4(displaced, 1.0);
}
