export type Axes = [number[], number[]];

const ITERATIONS = 80;

function dot(a: readonly number[], b: readonly number[]): number {
  return a.reduce((sum, value, i) => sum + value * b[i], 0);
}

function multiply(matrix: number[][], vector: readonly number[]): number[] {
  return matrix.map((row) => dot(row, vector));
}

function normalized(
  vector: number[],
  against: number[] | null,
): number[] | null {
  const along = against ? dot(vector, against) : 0;
  const v = against
    ? vector.map((value, i) => value - along * against[i])
    : vector;
  const norm = Math.hypot(...v);
  return norm > 1e-12 ? v.map((value) => value / norm) : null;
}

function dominant(
  matrix: number[][],
  starts: number[][],
  against: number[] | null,
): number[] {
  const basis = matrix.map((_, i) => matrix.map((__, j) => (i === j ? 1 : 0)));
  let v =
    [...starts, ...basis]
      .map((s) => normalized(s, against))
      .find((s) => s !== null) ?? basis[0];
  for (let step = 0; step < ITERATIONS; step++) {
    const next = normalized(multiply(matrix, v), against);
    if (!next) break;
    v = next;
  }
  return v;
}

function aligned(axis: number[], previous: number[] | undefined): number[] {
  return previous && dot(axis, previous) < 0
    ? axis.map((value) => -value)
    : axis;
}

export function principalAxes(
  factors: Float64Array,
  rows: number,
  k: number,
  previous: Axes | null,
): Axes {
  const moment = Array.from({ length: k }, () => new Array<number>(k).fill(0));
  for (let r = 0; r < rows; r++) {
    for (let a = 0; a < k; a++) {
      for (let b = 0; b < k; b++)
        moment[a][b] += factors[r * k + a] * factors[r * k + b];
    }
  }

  const prev = previous && previous[0].length === k ? previous : null;
  const first = aligned(
    dominant(moment, prev ? [prev[0]] : [], null),
    prev?.[0],
  );
  const second = aligned(
    dominant(moment, prev ? [prev[1]] : [], first),
    prev?.[1],
  );
  return [first, second];
}

export function project(
  factors: Float64Array,
  row: number,
  axes: Axes,
): [number, number] {
  const k = axes[0].length;
  const vector = Array.from({ length: k }, (_, f) => factors[row * k + f]);
  return [dot(vector, axes[0]), dot(vector, axes[1])];
}
