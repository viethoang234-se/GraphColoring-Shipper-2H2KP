// Khung giao diện chính: tiêu đề + thanh điều khiển + 3 tab.
// Cách dùng (TV1 nối trong App.tsx):
//   <ShipperApp pipeline={pipelineThat} datasets={[...]} depot={DEPOT} />

import { useMemo, useState, type ReactNode } from 'react';
import type { Coloring, LatLng } from '../core/types';
import { AlgorithmCompare } from './AlgorithmCompare';
import { ConflictTab } from './ConflictTab';
import { ControlBar } from './ControlBar';
import type { TabId, UiDataset, UiPipeline, UiSettings } from './contracts';
import { edgeList } from './helpers';
import { MapTab } from './MapTab';
import { ScheduleTab } from './ScheduleTab';
import './ui.css';

interface Props {
  pipeline: UiPipeline;
  datasets: UiDataset[];
  depot: LatLng;
  defaultShippers?: number;
  mapSlot?: ReactNode; // bản đồ Leaflet của TV3 (nếu có)
}

const TABS: { id: TabId; label: string }[] = [
  { id: 'conflict', label: '1. Đồ thị xung đột & tô màu' },
  { id: 'schedule', label: '2. Lịch giao hàng' },
  { id: 'map', label: '3. Bản đồ lộ trình' },
];

export function ShipperApp({ pipeline, datasets, depot, defaultShippers = 3, mapSlot }: Props) {
  const [settings, setSettings] = useState<UiSettings>({
    datasetId: datasets[0]?.id ?? '',
    algorithmId: pipeline.algorithms[0]?.id ?? '',
    shippers: defaultShippers,
    speedMs: 600,
    layout: 'geo',
  });
  const [tab, setTab] = useState<TabId>('conflict');
  // runKey đổi mỗi lần bấm "Chạy" -> animation khởi động lại từ đầu
  const [run, setRun] = useState<{ coloring: Coloring; runKey: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const dataset = datasets.find((d) => d.id === settings.datasetId) ?? datasets[0];
  const orders = useMemo(() => dataset?.orders ?? [], [dataset]);
  const conflict = useMemo(() => pipeline.buildConflictGraph(orders), [pipeline, orders]);
  const coloring = run?.coloring ?? null;
  const routes = useMemo(
    () => (coloring && pipeline.buildRoutes ? pipeline.buildRoutes(orders, coloring, settings.shippers) : undefined),
    [pipeline, orders, coloring, settings.shippers],
  );

  const m = edgeList(conflict.adj).length;
  const maxDeg = conflict.adj.reduce((mx, a) => Math.max(mx, a.length), 0);

  const changeSettings = (patch: Partial<UiSettings>) => {
    setSettings((s) => ({ ...s, ...patch }));
    // Đổi dữ liệu hoặc thuật toán thì kết quả cũ không còn đúng -> xóa
    if (patch.datasetId !== undefined || patch.algorithmId !== undefined) setRun(null);
  };

  const runColoring = () => {
    const alg = pipeline.algorithms.find((a) => a.id === settings.algorithmId) ?? pipeline.algorithms[0];
    if (!alg) return;
    try {
      const result = alg.run(conflict.adj);
      setRun({ coloring: result, runKey: Date.now() });
      setError(null);
      setTab('conflict');
    } catch (e) {
      setError(`Thuật toán “${alg.label}” bị lỗi: ${String(e)}`);
      setRun(null);
    }
  };

  return (
    <div className="sa-app">
      <header className="sa-header">
        <div>
          <h1>Tô màu đồ thị · Lập lịch giao hàng cho shipper</h1>
          <p className="sa-sub">
            Mỗi đơn là một đỉnh, hai đơn không đi chung chuyến được thì nối cạnh. Tô màu sao cho hai đỉnh kề khác màu →
            mỗi màu là một chuyến giao.
          </p>
        </div>
        <div className="sa-header-stats">
          <span>
            <b>{orders.length}</b> đỉnh
          </span>
          <span>
            <b>{m}</b> cạnh
          </span>
          <span>
            Δ = <b>{maxDeg}</b>
          </span>
        </div>
      </header>

      <ControlBar
        datasets={datasets}
        algorithms={pipeline.algorithms}
        settings={settings}
        onChange={changeSettings}
        onRun={runColoring}
      />
      {error && <div className="sa-result err">{error}</div>}

      <nav className="sa-tabs" role="tablist">
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            role="tab"
            aria-selected={tab === t.id}
            className={tab === t.id ? 'on' : ''}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <main className="sa-panel">
        {/* Tab 1 chỉ ẩn đi chứ không gỡ, để quay lại không bị phát animation lại từ đầu */}
        <div className="sa-stack" hidden={tab !== 'conflict'}>
          <ConflictTab
            key={`${settings.datasetId}-${run?.runKey ?? 0}`}
            orders={orders}
            conflict={conflict}
            coloring={coloring}
            settings={settings}
            onLayoutChange={(layout) => changeSettings({ layout })}
            below={<AlgorithmCompare key={settings.datasetId} algorithms={pipeline.algorithms} conflict={conflict} />}
          />
        </div>
        {tab === 'schedule' && (
          <ScheduleTab orders={orders} coloring={coloring} routes={routes} shippers={settings.shippers} />
        )}
        {tab === 'map' && <MapTab orders={orders} coloring={coloring} depot={depot} mapSlot={mapSlot} />}
      </main>
    </div>
  );
}
