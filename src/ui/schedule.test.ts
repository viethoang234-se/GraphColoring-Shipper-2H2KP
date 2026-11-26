import { describe, it, expect } from 'vitest';
import type { Route } from '../core/types';
import { scheduleRows } from './schedule';

function route(color: number, shipper: number, shift: number, orderIds: string[], lengthM: number, feasible = true): Route {
  return { color, shipper, shift, orderIds, path: [], lengthM, feasible };
}

describe('scheduleRows', () => {
  const rows = scheduleRows([
    route(0, 0, 0, ['A', 'B'], 2350),
    route(1, 1, 0, ['C'], 800),
    route(3, 0, 1, ['D', 'E', 'F'], 4120, false),
  ]);

  it('sắp theo shipper rồi theo ca', () => {
    expect(rows.map((r) => r.trip)).toEqual([1, 4, 2]);
  });

  it('đánh số từ 1 cho người đọc và ghi km một chữ số thập phân', () => {
    expect(rows[0]).toEqual({ trip: 1, shipper: 'Shipper 1', shift: 1, stops: 'A → B', km: '2.4', ok: true });
  });

  it('giữ cờ không kịp giờ', () => {
    expect(rows[1].ok).toBe(false);
    expect(rows[1].shift).toBe(2);
  });

  it('không làm đổi thứ tự mảng gốc', () => {
    const input = [route(0, 1, 0, ['A'], 0), route(1, 0, 0, ['B'], 0)];
    scheduleRows(input);
    expect(input.map((r) => r.shipper)).toEqual([1, 0]);
  });
});
