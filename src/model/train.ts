import type { Rating } from "../data/ratings";
import { gaussian, seeded, shuffled } from "./random";

export type Model = {
  k: number;
  mean: number;
  userBias: Float64Array;
  itemBias: Float64Array;
  userFactors: Float64Array;
  itemFactors: Float64Array;
};

export type Hyper = { lr: number; lambda: number };

export function initModel(
  users: number,
  items: number,
  k: number,
  mean: number,
  seed: number,
): Model {
  const rng = seeded(seed);
  const noise = (n: number) =>
    Float64Array.from({ length: n }, () => 0.1 * gaussian(rng));
  return {
    k,
    mean,
    userBias: new Float64Array(users),
    itemBias: new Float64Array(items),
    userFactors: noise(users * k),
    itemFactors: noise(items * k),
  };
}

export function score(model: Model, user: number, item: number): number {
  const { k, userFactors: p, itemFactors: q } = model;
  let dot = 0;
  for (let f = 0; f < k; f++) dot += p[user * k + f] * q[item * k + f];
  return model.mean + model.userBias[user] + model.itemBias[item] + dot;
}

export function predict(model: Model, user: number, item: number): number {
  return Math.min(5, Math.max(1, score(model, user, item)));
}

export function trainEpoch(
  model: Model,
  ratings: readonly Rating[],
  { lr, lambda }: Hyper,
  seed: number,
): Model {
  const next: Model = {
    ...model,
    userBias: model.userBias.slice(),
    itemBias: model.itemBias.slice(),
    userFactors: model.userFactors.slice(),
    itemFactors: model.itemFactors.slice(),
  };
  const {
    k,
    userBias: bu,
    itemBias: bi,
    userFactors: p,
    itemFactors: q,
  } = next;

  for (const { user, item, value } of shuffled(ratings, seeded(seed))) {
    const error = value - score(next, user, item);
    bu[user] += lr * (error - lambda * bu[user]);
    bi[item] += lr * (error - lambda * bi[item]);
    for (let f = 0; f < k; f++) {
      const pu = p[user * k + f];
      const qi = q[item * k + f];
      p[user * k + f] += lr * (error * qi - lambda * pu);
      q[item * k + f] += lr * (error * pu - lambda * qi);
    }
  }

  return next;
}

export function isStable(model: Model): boolean {
  return [
    model.userBias,
    model.itemBias,
    model.userFactors,
    model.itemFactors,
  ].every((values) => values.every(Number.isFinite));
}
