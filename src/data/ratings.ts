import { gaussian, seeded } from "../model/random";
import { FILMS } from "./films";

export type Rating = { user: number; item: number; value: number };

export const SEED_USERS = 60;
export const DATA_SEED = 20261017;

export function generateRatings(seed = DATA_SEED): Rating[] {
  const rng = seeded(seed);
  const acclaim = FILMS.map(() => 0.35 * gaussian(rng));
  const reach = FILMS.map(() => 0.25 + 0.4 * rng());
  const ratings: Rating[] = [];

  for (let user = 0; user < SEED_USERS; user++) {
    const taste = [0, 0, 0].map(() => 0.9 * gaussian(rng));
    const leniency = 0.35 * gaussian(rng);
    FILMS.forEach((film, item) => {
      if (rng() > reach[item]) return;
      const affinity = film.taste.reduce((sum, t, f) => sum + t * taste[f], 0);
      const raw =
        3.3 + leniency + acclaim[item] + 0.8 * affinity + 0.55 * gaussian(rng);
      ratings.push({
        user,
        item,
        value: Math.min(5, Math.max(1, Math.round(raw))),
      });
    });
  }

  return ratings;
}

export const SEED_RATINGS = generateRatings();
