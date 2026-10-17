import { FILMS } from "../data/films";
import type { Rating } from "../data/ratings";

export type Stars = Record<string, number>;

const KEY = "film-taste-map:ratings";
const INDEX = new Map(FILMS.map((film, i) => [film.id, i]));

export function loadStars(): Stars {
  try {
    const parsed: unknown = JSON.parse(localStorage.getItem(KEY) ?? "{}");
    if (!parsed || typeof parsed !== "object") return {};
    return Object.fromEntries(
      Object.entries(parsed).filter(
        ([id, value]) =>
          INDEX.has(id) && Number.isInteger(value) && value >= 1 && value <= 5,
      ),
    );
  } catch {
    return {};
  }
}

export function saveStars(stars: Stars) {
  try {
    localStorage.setItem(KEY, JSON.stringify(stars));
  } catch {}
}

export function toRatings(stars: Stars, user: number): Rating[] {
  return Object.entries(stars).map(([id, value]) => ({
    user,
    item: INDEX.get(id)!,
    value,
  }));
}
