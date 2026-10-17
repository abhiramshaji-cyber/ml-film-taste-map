import type { Rating } from "../data/ratings";
import { seeded } from "./random";

export type Biases = { mean: number; user: Float64Array; item: Float64Array };

export function holdOut(
  ratings: readonly Rating[],
  fraction: number,
  seed: number,
) {
  const rng = seeded(seed);
  const train: Rating[] = [];
  const test: Rating[] = [];
  for (const rating of ratings) (rng() < fraction ? test : train).push(rating);
  return { train, test };
}

export function rmse(
  ratings: readonly Rating[],
  predict: (rating: Rating) => number,
): number {
  if (ratings.length === 0) return NaN;
  const squared = ratings.reduce(
    (sum, r) => sum + (r.value - predict(r)) ** 2,
    0,
  );
  return Math.sqrt(squared / ratings.length);
}

export function globalMean(ratings: readonly Rating[]): number {
  if (ratings.length === 0) return 3;
  return ratings.reduce((sum, r) => sum + r.value, 0) / ratings.length;
}

export function fitBiases(
  ratings: readonly Rating[],
  users: number,
  items: number,
  damping = 5,
  sweeps = 8,
): Biases {
  const mean = globalMean(ratings);
  const user = new Float64Array(users);
  const item = new Float64Array(items);

  for (let sweep = 0; sweep < sweeps; sweep++) {
    const itemSum = new Float64Array(items);
    const itemCount = new Float64Array(items);
    for (const r of ratings) {
      itemSum[r.item] += r.value - mean - user[r.user];
      itemCount[r.item] += 1;
    }
    for (let i = 0; i < items; i++)
      item[i] = itemSum[i] / (damping + itemCount[i]);

    const userSum = new Float64Array(users);
    const userCount = new Float64Array(users);
    for (const r of ratings) {
      userSum[r.user] += r.value - mean - item[r.item];
      userCount[r.user] += 1;
    }
    for (let u = 0; u < users; u++)
      user[u] = userSum[u] / (damping + userCount[u]);
  }

  return { mean, user, item };
}

export function predictBiases(
  biases: Biases,
  user: number,
  item: number,
): number {
  return Math.min(
    5,
    Math.max(1, biases.mean + biases.user[user] + biases.item[item]),
  );
}
