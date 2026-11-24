import { describe, it, expect } from 'vitest';
import type { Category, Order } from '../core/types';
import { DEFAULT_OPTIONS } from '../core/config';
import { buildConflictGraph, canFollow } from './buildConflictGraph';

/** Tạo nhanh một đơn hàng. Giờ tính bằng phút từ 0h: 480 = 8:00, 540 = 9:00. */
function order(id: string, start: number, end: number, category: Category = 'thuong'): Order {
  return { id, pos: { lat: 0, lng: 0 }, window: { start, end }, serviceMin: 5, category };
}

// Tham số mặc định: bán kính 5000 m, tốc độ 25 km/h (1000 m mất 2,4 phút).
const opts = DEFAULT_OPTIONS;

describe('canFollow', () => {
  it('giao xong A rồi đi 1 km vẫn kịp khung giờ của B', () => {
    // 480 + 5 + 2,4 = 487,4 ≤ 540
    expect(canFollow(order('A', 480, 540), order('B', 480, 540), 1000, 25)).toBe(true);
  });
  it('khung giờ quá sát và xa nhau thì không kịp', () => {
    // 480 + 5 + 9,6 = 494,6 > 490
    expect(canFollow(order('A', 480, 490), order('B', 480, 490), 4000, 25)).toBe(false);
  });
});

describe('buildConflictGraph', () => {
  it('hai đơn gần nhau, khung giờ rộng: không xung đột', () => {
    const g = buildConflictGraph([order('A', 480, 540), order('B', 480, 540)], [[0, 1000], [1000, 0]], opts);
    expect(g.adj).toEqual([[], []]);
    expect(g.reasons).toEqual({});
  });

  it('không kịp thời gian theo cả hai chiều: xung đột thoi-gian', () => {
    const g = buildConflictGraph([order('A', 480, 490), order('B', 480, 490)], [[0, 4000], [4000, 0]], opts);
    expect(g.adj).toEqual([[1], [0]]);
    expect(g.reasons['0-1']).toEqual(['thoi-gian']);
  });

  it('xa hơn bán kính 5000 m: xung đột khoang-cach', () => {
    const g = buildConflictGraph([order('A', 480, 720), order('B', 480, 720)], [[0, 6000], [6000, 0]], opts);
    expect(g.reasons['0-1']).toEqual(['khoang-cach']);
  });

  it('đông lạnh và cồng kềnh không đi chung: xung đột loai-hang', () => {
    const g = buildConflictGraph(
      [order('A', 480, 720, 'dong-lanh'), order('B', 480, 720, 'cong-kenh'), order('C', 480, 720, 'thuong')],
      [[0, 100, 100], [100, 0, 100], [100, 100, 0]],
      opts,
    );
    expect(g.reasons['0-1']).toEqual(['loai-hang']);
    expect(g.reasons['0-2']).toBeUndefined(); // hàng thường đi chung được với mọi loại
  });

  it('một cặp có thể có nhiều lý do, ghi theo thứ tự thoi-gian, khoang-cach, loai-hang', () => {
    const g = buildConflictGraph(
      [order('A', 480, 490, 'dong-lanh'), order('B', 480, 490, 'cong-kenh')],
      [[0, 8000], [8000, 0]],
      opts,
    );
    expect(g.reasons['0-1']).toEqual(['thoi-gian', 'khoang-cach', 'loai-hang']);
  });

  it('không tới được nhau (Infinity) thì coi là xung đột', () => {
    const g = buildConflictGraph([order('A', 480, 720), order('B', 480, 720)], [[0, Infinity], [Infinity, 0]], opts);
    expect(g.adj).toEqual([[1], [0]]);
  });
});