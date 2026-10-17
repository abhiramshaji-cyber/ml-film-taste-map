import type { Point } from "../training/useTrainer";

type Props = { history: readonly Point[]; baseline: number; epochs: number };

const W = 320;
const H = 120;
const PAD = 6;

export default function RmseChart({ history, baseline, epochs }: Props) {
  const values = history
    .flatMap((p) => [p.train, p.test])
    .filter(Number.isFinite);
  const top = Math.max(baseline, ...values) + 0.05;
  const bottom = Math.max(0, Math.min(baseline, ...values) - 0.05);
  const span = Math.max(1, epochs, history.length);
  const x = (i: number) => PAD + ((i + 1) / span) * (W - 2 * PAD);
  const y = (v: number) => PAD + ((top - v) / (top - bottom)) * (H - 2 * PAD);
  const line = (pick: (p: Point) => number) =>
    history
      .map((p, i) => `${x(i).toFixed(1)},${y(pick(p)).toFixed(1)}`)
      .join(" ");
  const last = history[history.length - 1];

  return (
    <figure className="chart">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="chart-svg"
        role="img"
        aria-label="Train and held-out RMSE over epochs"
      >
        <line
          x1={PAD}
          x2={W - PAD}
          y1={H - PAD}
          y2={H - PAD}
          stroke="var(--border)"
        />
        <line
          x1={PAD}
          x2={W - PAD}
          y1={y(baseline)}
          y2={y(baseline)}
          stroke="var(--muted-foreground)"
          strokeDasharray="4 4"
        />
        <polyline
          points={line((p) => p.train)}
          fill="none"
          stroke="var(--accent-3)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
        <polyline
          points={line((p) => p.test)}
          fill="none"
          stroke="var(--accent-1)"
          strokeWidth={2}
          vectorEffect="non-scaling-stroke"
        />
      </svg>
      <figcaption className="label chart-legend">
        <span className="accent-3">
          train {last ? last.train.toFixed(3) : "·"}
        </span>
        <span className="accent-1">
          held-out {last ? last.test.toFixed(3) : "·"}
        </span>
        <span>bias-only {baseline.toFixed(3)}</span>
      </figcaption>
    </figure>
  );
}
