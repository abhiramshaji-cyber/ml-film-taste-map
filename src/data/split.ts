import {
  fitBiases,
  globalMean,
  holdOut,
  predictBiases,
  rmse,
} from "../model/evaluate";
import { FILMS } from "./films";
import { DATA_SEED, SEED_RATINGS, SEED_USERS } from "./ratings";

export const VISITOR = SEED_USERS;
export const USERS = SEED_USERS + 1;
export const HOLD_OUT = 0.2;

export const SPLIT = holdOut(SEED_RATINGS, HOLD_OUT, DATA_SEED + 1);
export const TRAIN_MEAN = globalMean(SPLIT.train);
export const BASELINE = fitBiases(SPLIT.train, USERS, FILMS.length);
export const MEAN_RMSE = rmse(SPLIT.test, () => TRAIN_MEAN);
export const BIAS_RMSE = rmse(SPLIT.test, (r) =>
  predictBiases(BASELINE, r.user, r.item),
);
