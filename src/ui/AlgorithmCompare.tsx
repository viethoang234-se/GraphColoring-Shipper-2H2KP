// Bảng so sánh: chạy mọi thuật toán trên cùng đồ thị, so số màu và thời gian.
// Dùng cho phần "Đánh giá thực nghiệm" trong báo cáo.

import { useState } from 'react';
import type { ConflictGraph } from '../core/types';
import type { UiAlgorithm } from './contracts';
import { badEdges, formatMs } from './helpers';

interface Row {
  label: string;
  k: number;
  ms: number;
  valid: boolean;
  error?: string;
}

export function AlgorithmCompare({ algorithms, conflict }: { algorithms: UiAlgorithm[]; conflict: ConflictGraph }) {
  const [rows, setRows] = useState<Row[] | null>(null);

  const runAll = () => {
    setRows(
      algorithms.map((a) => {
        try {
          const res = a.run(conflict.adj);
          return { label: a.label, k: res.k, ms: res.ms, valid: badEdges(conflict.adj, res.colors).length === 0 };
        } catch (e) {
          return { label: a.label, k: NaN, ms: NaN, valid: false, error: String(e) };
        }
      }),
    );
  };

  const best = rows ? Math.min(...rows.filter((r) => r.valid).map((r) => r.k)) : Infinity;

  return (
    <div className="sa-card">
      <div className="sa-card-head">
        <h3>So sánh thuật toán</h3>
        <button type="button" className="sa-btn" onClick={runAll}>
          Chạy so sánh
        </button>
      </div>
      {rows === null ? (
        <p className="sa-muted">Chạy tất cả {algorithms.length} thuật toán trên cùng đồ thị hiện tại.</p>
      ) : (
        <table className="sa-table">
          <thead>
            <tr>
              <th>Thuật toán</th>
              <th>Số màu k</th>
              <th>Thời gian</th>
              <th>Hợp lệ</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.label} className={r.valid && r.k === best ? 'best' : ''}>
                <td>{r.label}</td>
                <td>{Number.isNaN(r.k) ? '—' : r.k}</td>
                <td>{Number.isNaN(r.ms) ? '—' : formatMs(r.ms)}</td>
                <td>{r.error ? `Lỗi: ${r.error}` : r.valid ? '✓' : '✗'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
