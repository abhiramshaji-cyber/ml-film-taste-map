type Props = {
  k: number;
  lr: number;
  lambda: number;
  active: boolean;
  onK: (k: number) => void;
  onLr: (lr: number) => void;
  onLambda: (lambda: number) => void;
  onToggle: () => void;
  onReset: () => void;
};

type SliderProps = {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  digits: number;
  onChange: (value: number) => void;
};

function Slider({
  label,
  value,
  min,
  max,
  step,
  digits,
  onChange,
}: SliderProps) {
  return (
    <label className="slider">
      <span className="label slider-head">
        {label}
        <span className="ink">{value.toFixed(digits)}</span>
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
    </label>
  );
}

export default function Controls({
  k,
  lr,
  lambda,
  active,
  onK,
  onLr,
  onLambda,
  onToggle,
  onReset,
}: Props) {
  return (
    <div className="controls">
      <div className="sliders">
        <Slider
          label="factors k"
          value={k}
          min={2}
          max={8}
          step={1}
          digits={0}
          onChange={onK}
        />
        <Slider
          label="learning rate"
          value={lr}
          min={0.002}
          max={0.08}
          step={0.002}
          digits={3}
          onChange={onLr}
        />
        <Slider
          label="lambda"
          value={lambda}
          min={0}
          max={0.3}
          step={0.01}
          digits={2}
          onChange={onLambda}
        />
      </div>
      <div className="buttons">
        <button type="button" className="pill pill-primary" onClick={onToggle}>
          {active ? "Pause" : "Play"}
        </button>
        <button type="button" className="pill" onClick={onReset}>
          Reset
        </button>
      </div>
    </div>
  );
}
