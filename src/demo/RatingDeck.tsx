import { FILMS } from "../data/films";
import type { Stars } from "../training/visitor";

type Props = {
  stars: Stars;
  onRate: (id: string, value: number | null) => void;
  onClear: () => void;
};

const LEVELS = [1, 2, 3, 4, 5];

export default function RatingDeck({ stars, onRate, onClear }: Props) {
  const count = Object.keys(stars).length;

  return (
    <section className="stack">
      <div className="row-head">
        <h2 className="heading">Rate films</h2>
        {count > 0 && (
          <button type="button" className="label text-button" onClick={onClear}>
            clear {count}
          </button>
        )}
      </div>
      <ul className="panel deck">
        {FILMS.map((film) => {
          const current = stars[film.id] ?? 0;
          return (
            <li key={film.id} className="deck-row">
              <span className="deck-title">
                {film.title} <span className="muted">{film.year}</span>
              </span>
              <span
                className="stars"
                role="group"
                aria-label={`Rate ${film.title}`}
              >
                {LEVELS.map((level) => (
                  <button
                    key={level}
                    type="button"
                    aria-label={`${level} star${level > 1 ? "s" : ""}`}
                    aria-pressed={current === level}
                    className={level <= current ? "star star-on" : "star"}
                    onClick={() =>
                      onRate(film.id, current === level ? null : level)
                    }
                  >
                    ★
                  </button>
                ))}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
