
import { useEffect, useRef, useState } from "react";
import { usePaletteColors } from "../usePaletteColors";
import { FILMS } from "../data/films";
import { VISITOR } from "../data/split";
import { type Axes, principalAxes, project } from "../model/project";
import type { Model } from "../model/train";

type Props = {
  model: Model;
  picks: readonly number[];
  rated: ReadonlySet<number>;
  showVisitor: boolean;
};

type Frame = { points: [number, number][]; visitor: [number, number] };

const EASE = 0.14;
const WIDE = 560;

function target(model: Model, axes: Axes): Frame {
  const raw = FILMS.map((_, i) => project(model.itemFactors, i, axes));
  const reach = Math.max(1e-9, ...raw.map(([x, y]) => Math.hypot(x, y)));
  const [vx, vy] = project(model.userFactors, VISITOR, axes);
  const length = Math.hypot(vx, vy) || 1;
  return {
    points: raw.map(([x, y]) => [x / reach, y / reach]),
    visitor: [(0.92 * vx) / length, (0.92 * vy) / length],
  };
}

function lerp(from: Frame, to: Frame, t: number): Frame {
  const mix = (
    [ax, ay]: [number, number],
    [bx, by]: [number, number],
  ): [number, number] => [ax + (bx - ax) * t, ay + (by - ay) * t];
  return {
    points: to.points.map((p, i) => mix(from.points[i] ?? p, p)),
    visitor: mix(from.visitor, to.visitor),
  };
}

function settled(a: Frame, b: Frame) {
  return a.points.every(
    ([x, y], i) =>
      Math.abs(x - b.points[i][0]) + Math.abs(y - b.points[i][1]) < 0.002,
  );
}

function short(title: string) {
  return title.length > 18 ? `${title.slice(0, 17)}…` : title;
}

export default function MapCanvas({ model, picks, rated, showVisitor }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const axesRef = useRef<Axes | null>(null);
  const shownRef = useRef<Frame | null>(null);
  const [size, setSize] = useState(0);
  const [ink, muted, pick, mine, grid] = usePaletteColors([
    "--foreground",
    "--muted-foreground",
    "--accent-1",
    "--accent-3",
    "--border",
  ]);

  useEffect(() => {
    const resized = () => setSize((n) => n + 1);
    window.addEventListener("resize", resized);
    return () => window.removeEventListener("resize", resized);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    axesRef.current = principalAxes(
      model.itemFactors,
      FILMS.length,
      model.k,
      axesRef.current,
    );
    const goal = target(model, axesRef.current);
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const picked = new Set(picks);
    let frame = 0;

    const draw = (shot: Frame) => {
      const ratio = window.devicePixelRatio || 1;
      const width = canvas.clientWidth;
      const height = canvas.clientHeight;
      if (canvas.width !== Math.round(width * ratio))
        canvas.width = Math.round(width * ratio);
      if (canvas.height !== Math.round(height * ratio))
        canvas.height = Math.round(height * ratio);
      ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
      ctx.clearRect(0, 0, width, height);

      const pad = 28;
      const half = Math.min(width, height) / 2 - pad;
      const at = ([x, y]: [number, number]): [number, number] => [
        width / 2 + x * half,
        height / 2 - y * half,
      ];

      // grid
      ctx.strokeStyle = grid;
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(pad / 2, height / 2);
      ctx.lineTo(width - pad / 2, height / 2);
      ctx.moveTo(width / 2, pad / 2);
      ctx.lineTo(width / 2, height - pad / 2);
      ctx.stroke();
      ctx.beginPath();
      ctx.arc(width / 2, height / 2, half, 0, Math.PI * 2);
      ctx.stroke();

      // visitor
      if (showVisitor) {
        const [vx, vy] = at(shot.visitor);
        ctx.setLineDash([3, 4]);
        ctx.strokeStyle = ink;
        ctx.beginPath();
        ctx.moveTo(width / 2, height / 2);
        ctx.lineTo(vx, vy);
        ctx.stroke();
        ctx.setLineDash([]);
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(vx, vy, 7, 0, Math.PI * 2);
        ctx.stroke();
        ctx.fillStyle = ink;
        ctx.font = "600 11px ui-monospace, monospace";
        ctx.fillText("YOU", vx + 10, vy - 8);
      }

      // films
      const labelAll = width >= WIDE;
      shot.points.forEach((point, i) => {
        const [x, y] = at(point);
        const tone = picked.has(i) ? pick : rated.has(i) ? mine : muted;
        const strong = tone !== muted;
        ctx.fillStyle = tone;
        ctx.globalAlpha = strong ? 1 : 0.75;
        ctx.beginPath();
        ctx.arc(x, y, picked.has(i) ? 5 : strong ? 4 : 3, 0, Math.PI * 2);
        ctx.fill();
        if (strong || labelAll) {
          ctx.globalAlpha = strong ? 1 : 0.6;
          ctx.font = `${strong ? 600 : 400} 10px ui-monospace, monospace`;
          ctx.textAlign = x > width - 120 ? "right" : "left";
          ctx.fillText(
            short(FILMS[i].title),
            x + (ctx.textAlign === "right" ? -7 : 7),
            y + 3,
          );
          ctx.textAlign = "left";
        }
      });
      ctx.globalAlpha = 1;
    };

    const tick = () => {
      const from = shownRef.current;
      const next =
        !from || still || from.points.length !== goal.points.length
          ? goal
          : lerp(from, goal, EASE);
      shownRef.current = next;
      draw(next);
      if (next !== goal && !settled(next, goal))
        frame = requestAnimationFrame(tick);
    };
    tick();

    return () => cancelAnimationFrame(frame);
  }, [model, picks, rated, showVisitor, ink, muted, pick, mine, grid, size]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label="Map of film taste vectors projected to two dimensions, with your taste direction"
      className="panel map"
    />
  );
}
