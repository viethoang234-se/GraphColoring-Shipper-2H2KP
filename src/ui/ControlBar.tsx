// Thanh điều khiển: chọn dữ liệu, thuật toán, số shipper, tốc độ animation, nút chạy.

import type { UiAlgorithm, UiDataset, UiSettings } from './contracts';

interface Props {
  datasets: UiDataset[];
  algorithms: UiAlgorithm[];
  settings: UiSettings;
  onChange: (patch: Partial<UiSettings>) => void;
  onRun: () => void;
}

const SPEEDS = [
  { ms: 1200, label: 'Chậm' },
  { ms: 600, label: 'Vừa' },
  { ms: 250, label: 'Nhanh' },
  { ms: 60, label: 'Rất nhanh' },
];

export function ControlBar({ datasets, algorithms, settings, onChange, onRun }: Props) {
  return (
    <div className="sa-controls">
      <label className="sa-field">
        <span>Bộ dữ liệu</span>
        <select value={settings.datasetId} onChange={(e) => onChange({ datasetId: e.target.value })}>
          {datasets.map((d) => (
            <option key={d.id} value={d.id}>
              {d.label} ({d.orders.length} đơn)
            </option>
          ))}
        </select>
      </label>

      <label className="sa-field">
        <span>Thuật toán tô màu</span>
        <select value={settings.algorithmId} onChange={(e) => onChange({ algorithmId: e.target.value })}>
          {algorithms.map((a) => (
            <option key={a.id} value={a.id}>
              {a.label}
            </option>
          ))}
        </select>
      </label>

      <label className="sa-field sa-field-narrow">
        <span>Số shipper</span>
        <input
          type="number"
          min={1}
          max={10}
          value={settings.shippers}
          onChange={(e) => onChange({ shippers: Math.min(10, Math.max(1, Number(e.target.value) || 1)) })}
        />
      </label>

      <label className="sa-field">
        <span>Tốc độ animation</span>
        <select value={settings.speedMs} onChange={(e) => onChange({ speedMs: Number(e.target.value) })}>
          {SPEEDS.map((s) => (
            <option key={s.ms} value={s.ms}>
              {s.label}
            </option>
          ))}
        </select>
      </label>

      <button type="button" className="sa-btn sa-btn-primary" onClick={onRun} disabled={algorithms.length === 0}>
        ▶ Chạy tô màu
      </button>
    </div>
  );
}
