import type { Route } from '../core/types';
import { colorOf } from './palette';
import { scheduleRows } from './schedule';

interface Props {
  routes: Route[];
}

// Kiểu chữ cho ô bảng. Viết ngay trong file vì T23 không sửa App.css
const cell = { padding: '8px 10px', borderBottom: '1px solid var(--border)', textAlign: 'left' as const };

/** Bảng lịch trình: mỗi dòng là một chuyến giao. Phần tính toán nằm trong scheduleRows (schedule.ts). */
export function ScheduleTable({ routes }: Props) {
  const rows = scheduleRows(routes);

  if (rows.length === 0) return <p>Chưa có chuyến nào. Nạp dữ liệu rồi bấm Chạy.</p>;

  return (
    <table style={{ borderCollapse: 'collapse', width: '100%' }}>
      <thead>
        <tr>
          <th style={cell}>Chuyến</th>
          <th style={cell}>Shipper</th>
          <th style={cell}>Ca</th>
          <th style={cell}>Các đơn</th>
          <th style={cell}>Quãng đường (km)</th>
          <th style={cell}>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr key={r.trip}>
            <td style={cell}>
              {/* Ô màu cùng màu với chuyến trên bản đồ: chuyến thứ trip dùng màu số trip - 1 */}
              <span
                style={{
                  display: 'inline-block',
                  width: 12,
                  height: 12,
                  borderRadius: 3,
                  marginRight: 8,
                  verticalAlign: -1,
                  background: colorOf(r.trip - 1),
                }}
              />
              {r.trip}
            </td>
            <td style={cell}>{r.shipper}</td>
            <td style={cell}>{r.shift}</td>
            <td style={cell}>{r.stops}</td>
            <td style={cell}>{r.km}</td>
            <td style={cell}>
              {r.ok ? (
                'Kịp giờ'
              ) : (
                <span
                  style={{ background: '#d32f2f', color: '#fff', padding: '2px 8px', borderRadius: 4, fontWeight: 600 }}
                >
                  Không kịp giờ
                </span>
              )}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
