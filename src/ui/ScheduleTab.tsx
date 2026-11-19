// Tab 2: Lịch giao hàng. Mỗi màu = một nhóm đơn đi chung một chuyến.
// Nếu pipeline đã có lộ trình (Route[]) thì hiện lộ trình thật; chưa có thì hiện bản gợi ý.

import type { Coloring, Order, Route } from '../core/types';
import {
  CATEGORY_LABEL,
  colorHex,
  colorLabel,
  groupByColor,
  minutesToHHMM,
  packLanes,
  suggestShipper,
} from './helpers';

const DAY_START = 7 * 60; // trục thời gian 7:00
const DAY_END = 19 * 60; // đến 19:00

interface Props {
  orders: Order[];
  coloring: Coloring | null;
  routes?: Route[];
  shippers: number;
}

function pct(min: number) {
  return `${((min - DAY_START) / (DAY_END - DAY_START)) * 100}%`;
}

export function ScheduleTab({ orders, coloring, routes, shippers }: Props) {
  if (coloring === null) {
    return <div className="sa-card sa-empty">Chưa có kết quả tô màu. Bấm “Chạy tô màu” trước.</div>;
  }

  const groups = groupByColor(orders, coloring.colors, coloring.k);
  const hours = Array.from({ length: (DAY_END - DAY_START) / 60 + 1 }, (_, i) => DAY_START + i * 60);

  return (
    <div className="sa-stack">
      <div className="sa-stats">
        <div className="sa-stat">
          <b>{coloring.k}</b>
          <span>nhóm giao (số màu)</span>
        </div>
        <div className="sa-stat">
          <b>{shippers}</b>
          <span>shipper</span>
        </div>
        <div className="sa-stat">
          <b>{Math.ceil(coloring.k / Math.max(1, shippers))}</b>
          <span>chuyến nhiều nhất / shipper</span>
        </div>
        <div className="sa-stat">
          <b>{orders.length}</b>
          <span>đơn hàng</span>
        </div>
      </div>

      <div className="sa-card">
        <h3>Biểu đồ khung giờ theo nhóm</h3>
        <div className="sa-gantt">
          <div className="sa-gantt-axis">
            {hours.map((h) => (
              <span key={h} style={{ left: pct(h) }}>
                {minutesToHHMM(h).slice(0, 2)}h
              </span>
            ))}
          </div>
          {groups.map((g, c) => {
            const lanes = packLanes(g.map((i) => orders[i].window));
            const laneCount = Math.max(1, ...lanes.map((l) => l + 1));
            return (
              <div key={c} className="sa-gantt-row">
                <div className="sa-gantt-label">
                  <i style={{ background: colorHex(c) }} />
                  {colorLabel(c)}
                </div>
                <div className="sa-gantt-track" style={{ height: `${laneCount * 16 + 10}px` }}>
                  {hours.map((h) => (
                    <span key={h} className="sa-gantt-grid" style={{ left: pct(h) }} />
                  ))}
                  {g.map((i, idx) => {
                    const o = orders[i];
                    return (
                      <div
                        key={o.id}
                        className="sa-gantt-bar"
                        title={`${o.id}: ${minutesToHHMM(o.window.start)}–${minutesToHHMM(o.window.end)}`}
                        style={{
                          left: pct(o.window.start),
                          width: `calc(${pct(o.window.end)} - ${pct(o.window.start)})`,
                          top: `${5 + lanes[idx] * 16}px`,
                          background: colorHex(c),
                        }}
                      >
                        {o.id}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {routes && routes.length > 0 ? (
        <div className="sa-card">
          <h3>Lộ trình từ pipeline</h3>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Shipper</th>
                <th>Chuyến</th>
                <th>Thứ tự ghé</th>
                <th>Quãng đường</th>
                <th>Kịp giờ</th>
              </tr>
            </thead>
            <tbody>
              {routes.map((r) => (
                <tr key={`${r.color}-${r.shipper}-${r.shift}`}>
                  <td>
                    <i className="sa-dot" style={{ background: colorHex(r.color) }} />
                    {colorLabel(r.color)}
                  </td>
                  <td>Shipper {r.shipper + 1}</td>
                  <td>{r.shift + 1}</td>
                  <td>{r.orderIds.join(' → ')}</td>
                  <td>{(r.lengthM / 1000).toFixed(2)} km</td>
                  <td>{r.feasible ? '✓' : '✗ trễ'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="sa-card">
          <h3>Phân nhóm cho shipper (gợi ý)</h3>
          <p className="sa-muted">
            Chưa có lộ trình thật (việc T18). Tạm xếp: màu c → shipper (c mod {shippers}) + 1, chuyến ⌊c / {shippers}⌋ +
            1.
          </p>
          <table className="sa-table">
            <thead>
              <tr>
                <th>Nhóm</th>
                <th>Shipper</th>
                <th>Chuyến</th>
                <th>Đơn (theo giờ)</th>
                <th>Khung giờ</th>
                <th>Loại hàng</th>
              </tr>
            </thead>
            <tbody>
              {groups.map((g, c) => {
                const { shipper, trip } = suggestShipper(c, shippers);
                const start = Math.min(...g.map((i) => orders[i].window.start));
                const end = Math.max(...g.map((i) => orders[i].window.end));
                const cats = [...new Set(g.map((i) => CATEGORY_LABEL[orders[i].category]))];
                return (
                  <tr key={c}>
                    <td>
                      <i className="sa-dot" style={{ background: colorHex(c) }} />
                      {colorLabel(c)}
                    </td>
                    <td>Shipper {shipper}</td>
                    <td>{trip}</td>
                    <td>{g.map((i) => orders[i].id).join(', ')}</td>
                    <td>{g.length ? `${minutesToHHMM(start)}–${minutesToHHMM(end)}` : '—'}</td>
                    <td>{cats.join(', ')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
