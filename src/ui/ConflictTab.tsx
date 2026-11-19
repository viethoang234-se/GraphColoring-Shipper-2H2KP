// Tab 1: Đồ thị xung đột + animation tô màu từng bước.
// Mỗi đỉnh = 1 đơn hàng; cạnh = 2 đơn không được đi chung một chuyến; màu = nhóm giao.

import { useMemo, useState, type ReactNode } from 'react';
import type { Coloring, ConflictGraph, Order } from '../core/types';
import type { UiSettings } from './contracts';
import {
  CATEGORY_LABEL,
  REASON_LABEL,
  badEdges,
  circleLayout,
  colorHex,
  colorLabel,
  colorsAtStep,
  edgeList,
  formatMs,
  minutesToHHMM,
  projectLatLng,
  spreadOverlaps,
} from './helpers';
import { useColoringAnimation } from './useColoringAnimation';

const W = 640;
const H = 470;
const R = 15; // bán kính đỉnh

interface Props {
  orders: Order[];
  conflict: ConflictGraph;
  coloring: Coloring | null;
  settings: UiSettings;
  onLayoutChange: (layout: UiSettings['layout']) => void;
  below?: ReactNode; // nội dung đặt dưới hình đồ thị (bảng so sánh thuật toán)
}

export function ConflictTab({ orders, conflict, coloring, settings, onLayoutChange, below }: Props) {
  const steps = useMemo(() => coloring?.steps ?? [], [coloring]);
  const anim = useColoringAnimation(steps.length, settings.speedMs, coloring !== null);
  const [selected, setSelected] = useState<number | null>(null);

  const n = orders.length;
  const edges = useMemo(() => edgeList(conflict.adj), [conflict]);
  const pos = useMemo(
    () =>
      settings.layout === 'geo'
        ? spreadOverlaps(
            projectLatLng(
              orders.map((o) => o.pos),
              W,
              H,
              30,
            ),
            2 * R + 8,
            W,
            H,
            R + 4,
          )
        : circleLayout(n, W, H, 30),
    [orders, n, settings.layout],
  );

  const colors = colorsAtStep(n, steps, anim.step);
  const bad = badEdges(conflict.adj, colors);
  const badSet = new Set(bad.map(([i, j]) => `${i}-${j}`));
  const current = anim.step > 0 ? steps[anim.step - 1] : null;
  const focus = selected ?? current?.vertex ?? null; // đỉnh đang được làm nổi bật

  // Đếm số đỉnh mỗi màu đang có trên hình (để làm chú thích)
  const usedColors = new Map<number, number>();
  for (const c of colors) if (c >= 0) usedColors.set(c, (usedColors.get(c) ?? 0) + 1);
  const legend = [...usedColors.entries()].sort((a, b) => a[0] - b[0]);

  return (
    <div className="sa-tab-grid">
      <div className="sa-stack">
        <div className="sa-card sa-graph-card">
          <div className="sa-card-head">
            <h3>Đồ thị xung đột</h3>
            <div className="sa-seg">
              <button
                type="button"
                className={settings.layout === 'geo' ? 'on' : ''}
                onClick={() => onLayoutChange('geo')}
              >
                Theo vị trí
              </button>
              <button
                type="button"
                className={settings.layout === 'circle' ? 'on' : ''}
                onClick={() => onLayoutChange('circle')}
              >
                Vòng tròn
              </button>
            </div>
          </div>

          <svg viewBox={`0 0 ${W} ${H}`} className="sa-graph" role="img" aria-label="Đồ thị xung đột">
            {edges.map(([i, j]) => {
              const key = `${i}-${j}`;
              const isBad = badSet.has(key);
              const isFocus = focus !== null && (i === focus || j === focus);
              return (
                <line
                  key={key}
                  x1={pos[i].x}
                  y1={pos[i].y}
                  x2={pos[j].x}
                  y2={pos[j].y}
                  className={isBad ? 'sa-edge bad' : isFocus ? 'sa-edge focus' : 'sa-edge'}
                >
                  <title>
                    {orders[i].id} – {orders[j].id}:{' '}
                    {(conflict.reasons[key] ?? []).map((r) => REASON_LABEL[r] ?? r).join(', ')}
                  </title>
                </line>
              );
            })}
            {orders.map((o, i) => (
              <g
                key={o.id}
                className="sa-node"
                transform={`translate(${pos[i].x},${pos[i].y})`}
                onClick={() => setSelected(selected === i ? null : i)}
              >
                {current?.vertex === i && <circle r={R + 6} className="sa-node-ring" />}
                {selected === i && <circle r={R + 6} className="sa-node-ring selected" />}
                <circle r={R} fill={colorHex(colors[i])} className="sa-node-dot" />
                <text dy="0.35em" className={colors[i] < 0 ? 'sa-node-label dark' : 'sa-node-label'}>
                  {i + 1}
                </text>
                <title>
                  {o.id} · {minutesToHHMM(o.window.start)}–{minutesToHHMM(o.window.end)} · {CATEGORY_LABEL[o.category]}
                </title>
              </g>
            ))}
          </svg>

          <div className="sa-legend">
            {legend.length === 0 && <span className="sa-muted">Chưa tô đỉnh nào — bấm “Chạy tô màu”.</span>}
            {legend.map(([c, count]) => (
              <span key={c} className="sa-chip">
                <i style={{ background: colorHex(c) }} />
                {colorLabel(c)}: {count} đơn
              </span>
            ))}
            {bad.length > 0 && <span className="sa-chip bad">⚠ {bad.length} cạnh trùng màu</span>}
          </div>
        </div>
        {below}
      </div>

      <div className="sa-side">
        <div className="sa-card">
          <h3>Animation</h3>
          {coloring === null ? (
            <p className="sa-muted">Chọn thuật toán rồi bấm “Chạy tô màu” ở thanh trên.</p>
          ) : (
            <>
              <div className="sa-player">
                <button type="button" onClick={anim.toStart} title="Về đầu">
                  ⏮
                </button>
                <button type="button" onClick={anim.prev} title="Lùi 1 bước">
                  ◀
                </button>
                {anim.playing ? (
                  <button type="button" className="sa-btn-primary" onClick={anim.pause} title="Tạm dừng">
                    ⏸
                  </button>
                ) : (
                  <button type="button" className="sa-btn-primary" onClick={anim.play} title="Phát">
                    ▶
                  </button>
                )}
                <button type="button" onClick={anim.next} title="Tiến 1 bước">
                  ▶|
                </button>
                <button type="button" onClick={anim.toEnd} title="Đến cuối">
                  ⏭
                </button>
              </div>
              <input
                type="range"
                className="sa-range"
                min={0}
                max={steps.length}
                value={anim.step}
                onChange={(e) => anim.goTo(Number(e.target.value))}
                aria-label="Bước"
              />
              <p className="sa-step-count">
                Bước {anim.step}/{steps.length}
              </p>
              <p className="sa-step-note">
                {current
                  ? `Đỉnh ${current.vertex + 1} (${orders[current.vertex]?.id}) → ${colorLabel(current.color)}. ${current.note}`
                  : 'Chưa bắt đầu.'}
              </p>
              {anim.done && (
                <div className={bad.length === 0 ? 'sa-result ok' : 'sa-result err'}>
                  <b>{coloring.algorithm}</b>: dùng <b>{coloring.k}</b> màu · {formatMs(coloring.ms)}
                  <br />
                  {bad.length === 0
                    ? '✓ Tô màu hợp lệ (không cạnh nào trùng màu)'
                    : `✗ Sai: ${bad.length} cạnh trùng màu`}
                </div>
              )}
            </>
          )}
        </div>

        <div className="sa-card">
          <h3>Chi tiết đơn</h3>
          {focus === null ? (
            <p className="sa-muted">Bấm vào một đỉnh để xem đơn hàng và lý do xung đột.</p>
          ) : (
            <VertexDetail index={focus} orders={orders} conflict={conflict} colors={colors} />
          )}
        </div>

        {coloring !== null && (
          <div className="sa-card">
            <h3>Nhật ký các bước</h3>
            <ol className="sa-log">
              {steps.map((s, idx) => (
                <li key={idx} className={idx === anim.step - 1 ? 'now' : idx >= anim.step ? 'later' : ''}>
                  <button type="button" onClick={() => anim.goTo(idx + 1)}>
                    <i style={{ background: colorHex(s.color) }} />
                    Đỉnh {s.vertex + 1} → màu {s.color < 0 ? '—' : s.color + 1}
                  </button>
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

function VertexDetail({
  index,
  orders,
  conflict,
  colors,
}: {
  index: number;
  orders: Order[];
  conflict: ConflictGraph;
  colors: number[];
}) {
  const o = orders[index];
  const nbrs = conflict.adj[index] ?? [];
  return (
    <div className="sa-detail">
      <p>
        <b>
          Đỉnh {index + 1} · {o.id}
        </b>{' '}
        <span className="sa-chip">
          <i style={{ background: colorHex(colors[index]) }} />
          {colorLabel(colors[index])}
        </span>
      </p>
      <p>
        Khung giờ {minutesToHHMM(o.window.start)}–{minutesToHHMM(o.window.end)} · {CATEGORY_LABEL[o.category]} · giao{' '}
        {o.serviceMin} phút
      </p>
      <p>
        Bậc (số đơn xung đột): <b>{nbrs.length}</b>
      </p>
      {nbrs.length > 0 && (
        <ul className="sa-nbrs">
          {nbrs.map((j) => {
            const key = index < j ? `${index}-${j}` : `${j}-${index}`;
            return (
              <li key={j}>
                <i style={{ background: colorHex(colors[j]) }} />
                {orders[j].id}: {(conflict.reasons[key] ?? []).map((r) => REASON_LABEL[r] ?? r).join(', ') || '—'}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
