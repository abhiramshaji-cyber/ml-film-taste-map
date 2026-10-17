import { useCallback, useEffect, useRef, useState } from "react";
import { FILMS } from "../data/films";
import type { Rating } from "../data/ratings";
import { SPLIT, TRAIN_MEAN, USERS } from "../data/split";
import { rmse } from "../model/evaluate";
import {
  type Hyper,
  type Model,
  initModel,
  isStable,
  predict,
  trainEpoch,
} from "../model/train";

export type Point = { train: number; test: number };

export type Run = {
  model: Model;
  epoch: number;
  goal: number;
  history: Point[];
  diverged: boolean;
};

export const FIRST_GOAL = 120;
const EXTRA_EPOCHS = 40;
const INIT_SEED = 7;

function fresh(k: number): Run {
  return {
    model: initModel(USERS, FILMS.length, k, TRAIN_MEAN, INIT_SEED),
    epoch: 0,
    goal: FIRST_GOAL,
    history: [],
    diverged: false,
  };
}

function advance(
  run: Run,
  train: readonly Rating[],
  hyper: Hyper,
  budget: number,
): Run {
  let model = run.model;
  let epoch = run.epoch;
  const history = run.history.slice();

  for (let step = 0; step < Math.min(budget, run.goal - run.epoch); step++) {
    const next = trainEpoch(model, train, hyper, INIT_SEED + epoch);
    if (!isStable(next)) return { ...run, model, epoch, history, diverged: true };
    model = next;
    epoch += 1;
    history.push({
      train: rmse(train, (r) => predict(model, r.user, r.item)),
      test: rmse(SPLIT.test, (r) => predict(model, r.user, r.item)),
    });
  }

  return { ...run, model, epoch, history };
}

function reducedMotion() {
  return (
    typeof matchMedia === "function" &&
    matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function useTrainer(k: number, hyper: Hyper, train: readonly Rating[]) {
  const [run, setRun] = useState(() => fresh(k));
  const [playing, setPlaying] = useState(true);
  const live = useRef({ hyper, train });
  const active = playing && !run.diverged && run.epoch < run.goal;

  useEffect(() => {
    live.current = { hyper, train };
  }, [hyper, train]);

  useEffect(() => {
    if (!active) return;
    let frame = requestAnimationFrame(function tick() {
      const { hyper, train } = live.current;
      setRun((prev) =>
        advance(prev, train, hyper, reducedMotion() ? Infinity : 1),
      );
      frame = requestAnimationFrame(tick);
    });
    return () => cancelAnimationFrame(frame);
  }, [active]);

  const reset = useCallback((size: number) => {
    setRun(fresh(size));
    setPlaying(false);
  }, []);

  const extend = useCallback(() => {
    setRun((prev) =>
      prev.diverged
        ? prev
        : { ...prev, goal: Math.max(prev.goal, prev.epoch + EXTRA_EPOCHS) },
    );
    setPlaying(true);
  }, []);

  const toggle = useCallback(() => {
    setRun((prev) =>
      prev.epoch >= prev.goal && !prev.diverged
        ? { ...prev, goal: prev.epoch + EXTRA_EPOCHS }
        : prev,
    );
    setPlaying((was) => !(was && active));
  }, [active]);

  return { run, active, reset, extend, toggle };
}
