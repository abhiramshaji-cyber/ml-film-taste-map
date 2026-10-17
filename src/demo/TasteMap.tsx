import { useMemo, useState } from "react";
import { FILMS } from "../data/films";
import { BASELINE, BIAS_RMSE, SPLIT, VISITOR } from "../data/split";
import { predict, score } from "../model/train";
import { FIRST_GOAL, useTrainer } from "../training/useTrainer";
import {
  type Stars,
  loadStars,
  saveStars,
  toRatings,
} from "../training/visitor";
import Controls from "./Controls";
import MapCanvas from "./MapCanvas";
import RatingDeck from "./RatingDeck";
import RmseChart from "./RmseChart";

const NEEDED = 5;
const PICKS = 5;

export default function TasteMap() {
  const [stars, setStars] = useState<Stars>(loadStars);
  const [k, setK] = useState(2);
  const [lr, setLr] = useState(0.02);
  const [lambda, setLambda] = useState(0.1);
  const hyper = useMemo(() => ({ lr, lambda }), [lr, lambda]);
  const train = useMemo(
    () => SPLIT.train.concat(toRatings(stars, VISITOR)),
    [stars],
  );
  const { run, active, reset, extend, toggle } = useTrainer(k, hyper, train);

  const rated = useMemo(
    () => new Set(FILMS.flatMap((film, i) => (film.id in stars ? [i] : []))),
    [stars],
  );
  const count = rated.size;
  const cold = count < NEEDED;
  const picks = useMemo(() => {
    const rank = (i: number) =>
      cold ? BASELINE.item[i] : score(run.model, VISITOR, i);
    return FILMS.map((_, i) => i)
      .filter((i) => !rated.has(i))
      .sort((a, b) => rank(b) - rank(a))
      .slice(0, PICKS);
  }, [cold, rated, run.model]);

  const update = (next: Stars) => {
    setStars(next);
    saveStars(next);
    extend();
  };

  const rate = (id: string, value: number | null) => {
    const next = { ...stars };
    if (value === null) delete next[id];
    else next[id] = value;
    update(next);
  };

  return (
    <div className="layout">
      <section className="stack-lg">
        <MapCanvas
          model={run.model}
          picks={picks}
          rated={rated}
          showVisitor={count > 0}
        />
        <p className="label">
          epoch {run.epoch} / {run.goal} · k {k}
          {run.diverged && (
            <span className="danger">
              {" "}
              · diverged, lower the learning rate and reset
            </span>
          )}
        </p>
        <Controls
          k={k}
          lr={lr}
          lambda={lambda}
          active={active}
          onK={(next) => {
            setK(next);
            reset(next);
            extend();
          }}
          onLr={setLr}
          onLambda={setLambda}
          onToggle={toggle}
          onReset={() => reset(k)}
        />
        <RmseChart
          history={run.history}
          baseline={BIAS_RMSE}
          epochs={Math.max(FIRST_GOAL, run.goal)}
        />
      </section>

      <aside className="stack-xl">
        <section className="stack">
          <h2 className="heading">Your top {PICKS}</h2>
          <p className="note">
            {cold
              ? `Cold start · rate ${NEEDED - count} more to unlock personal picks. Until then these rank by item bias, how far above average each film rates.`
              : "Ranked by your predicted rating from the factor model."}
          </p>
          <ol className="picks">
            {picks.map((i, n) => (
              <li key={FILMS[i].id} className="panel pick">
                <span className="pick-title">
                  <span className="pick-rank">{n + 1}</span>
                  {FILMS[i].title}
                </span>
                <span className="pick-score">
                  {cold
                    ? `${BASELINE.item[i] >= 0 ? "+" : ""}${BASELINE.item[i].toFixed(2)}`
                    : `${predict(run.model, VISITOR, i).toFixed(1)} ★`}
                </span>
              </li>
            ))}
          </ol>
        </section>
        <RatingDeck
          stars={stars}
          onRate={rate}
          onClear={() => {
            update({});
            reset(k);
            extend();
          }}
        />
      </aside>
    </div>
  );
}
