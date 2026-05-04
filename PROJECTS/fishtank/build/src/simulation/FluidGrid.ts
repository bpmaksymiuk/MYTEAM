export class FluidGrid {
  private static readonly GRID = 64;
  private static readonly DECAY = 0.985;
  private readonly N = FluidGrid.GRID;

  private u: Float32Array;  // x-velocity
  private v: Float32Array;  // z-velocity
  private uNext: Float32Array;
  private vNext: Float32Array;

  constructor() {
    const size = this.N * this.N;
    this.u = new Float32Array(size);
    this.v = new Float32Array(size);
    this.uNext = new Float32Array(size);
    this.vNext = new Float32Array(size);
  }

  private idx(i: number, j: number): number {
    const ci = Math.max(0, Math.min(this.N - 1, i));
    const cj = Math.max(0, Math.min(this.N - 1, j));
    return cj * this.N + ci;
  }

  addImpulse(x: number, z: number, ux: number, uz: number, radius = 3): void {
    const cx = Math.round(x * this.N);
    const cz = Math.round(z * this.N);
    for (let dj = -radius; dj <= radius; dj++) {
      for (let di = -radius; di <= radius; di++) {
        if (di * di + dj * dj <= radius * radius) {
          const idx = this.idx(cx + di, cz + dj);
          this.u[idx] += ux;
          this.v[idx] += uz;
        }
      }
    }
  }

  sample(x: number, z: number): [number, number] {
    const fx = x * this.N;
    const fz = z * this.N;
    const i = Math.floor(fx);
    const j = Math.floor(fz);
    const tx = fx - i;
    const tz = fz - j;
    const i0j0 = this.idx(i, j);
    const i1j0 = this.idx(i + 1, j);
    const i0j1 = this.idx(i, j + 1);
    const i1j1 = this.idx(i + 1, j + 1);
    const su = (1 - tx) * (1 - tz) * this.u[i0j0]
             + tx * (1 - tz) * this.u[i1j0]
             + (1 - tx) * tz * this.u[i0j1]
             + tx * tz * this.u[i1j1];
    const sv = (1 - tx) * (1 - tz) * this.v[i0j0]
             + tx * (1 - tz) * this.v[i1j0]
             + (1 - tx) * tz * this.v[i0j1]
             + tx * tz * this.v[i1j1];
    return [su, sv];
  }

  step(dt: number): void {
    const N = this.N;
    const decay = FluidGrid.DECAY;

    // Semi-Lagrangian advection
    for (let j = 0; j < N; j++) {
      for (let i = 0; i < N; i++) {
        const idx = j * N + i;
        const fx = i / N - this.u[idx] * dt * N;
        const fz = j / N - this.v[idx] * dt * N;
        const [su, sv] = this.sample(
          Math.max(0, Math.min(1 - 1e-4, fx / N)),
          Math.max(0, Math.min(1 - 1e-4, fz / N))
        );
        this.uNext[idx] = su * decay;
        this.vNext[idx] = sv * decay;
      }
    }

    const tmpU = this.u; this.u = this.uNext; this.uNext = tmpU;
    const tmpV = this.v; this.v = this.vNext; this.vNext = tmpV;
  }
}
