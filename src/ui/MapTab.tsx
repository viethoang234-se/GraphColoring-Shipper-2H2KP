// Tab 3: Bản đồ. Đây là KHUNG CHỜ cho TV3: khi lớp bản đồ Leaflet (src/map) xong,
// TV1 truyền vào qua prop `mapSlot` và khung chờ này tự ẩn.
// Trong lúc chờ: vẽ sơ đồ vị trí đơn (tô theo màu) và kho, chưa có đường phố.

import type { ReactNode } from 'react';
import type { Coloring, LatLng, Order } from '../core/types';
import { colorHex, colorLabel, projectLatLng, spreadOverlaps } from './helpers';

const W = 760;
const H = 440;

interface Props {
  orders: Order[];
  coloring: Coloring | null;
  depot: LatLng;
  mapSlot?: ReactNode;
}

export function MapTab({ orders, coloring, depot, mapSlot }: Props) {
  if (mapSlot) return <div className="sa-card">{mapSlot}</div>;

  const pts = spreadOverlaps(projectLatLng([depot, ...orders.map((o) => o.pos)], W, H, 36), 26, W, H, 20);
  const d = pts[0];
  const colors = coloring?.colors ?? orders.map(() => -1);
  const k = coloring?.k ?? 0;

  return (
    <div className="sa-card">
      <div className="sa-card-head">
        <h3>Sơ đồ vị trí đơn hàng</h3>
        <span className="sa-badge">Bản xem trước — chờ bản đồ OSM của TV3</span>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} className="sa-map" role="img" aria-label="Sơ đồ vị trí">
        {orders.map((o, i) => (
          <line key={`l-${o.id}`} x1={d.x} y1={d.y} x2={pts[i + 1].x} y2={pts[i + 1].y} className="sa-map-ray" />
        ))}
        {orders.map((o, i) => (
          <g key={o.id} transform={`translate(${pts[i + 1].x},${pts[i + 1].y})`}>
            <circle r={9} fill={colorHex(colors[i])} className="sa-node-dot" />
            <text y={-14} className="sa-map-label">
              {o.id}
            </text>
          </g>
        ))}
        <g transform={`translate(${d.x},${d.y})`}>
          <rect x={-11} y={-11} width={22} height={22} rx={4} className="sa-depot" />
          <text dy="0.35em" className="sa-node-label">
            K
          </text>
          <text y={-18} className="sa-map-label strong">
            Kho Bến Thành
          </text>
        </g>
      </svg>
      <div className="sa-legend">
        {Array.from({ length: k }, (_, c) => (
          <span key={c} className="sa-chip">
            <i style={{ background: colorHex(c) }} />
            {colorLabel(c)}
          </span>
        ))}
        {k === 0 && <span className="sa-muted">Chạy tô màu để thấy các nhóm trên sơ đồ.</span>}
      </div>
    </div>
  );
}
