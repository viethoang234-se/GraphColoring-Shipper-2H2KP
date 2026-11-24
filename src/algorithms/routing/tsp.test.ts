import { describe, it, expect } from 'vitest';
import { nearestNeighbor, twoOpt, routeLength } from './tsp';

/** Ma trận khoảng cách giữa các điểm trên một đường thẳng. Điểm 0 là kho. */
function onLine(xs: number[]): number[][] {
  return xs.map((a) => xs.map((b) => Math.abs(a - b)));
}

// kho ở vị trí 0, ba đơn ở vị trí 5, 1, 3
const D = onLine([0, 5, 1, 3]);

describe('routeLength', () => {
  it('cộng quãng đường từ kho qua từng đơn, không quay về kho', () => {
    expect(routeLength(D, [1, 2, 3])).toBe(5 + 4 + 2);
    expect(routeLength(D, [])).toBe(0);
  });
});

describe('nearestNeighbor', () => {
  it('luôn đi tới đơn gần nhất chưa ghé', () => {
    expect(nearestNeighbor(D)).toEqual([2, 3, 1]);
  });
  it('chỉ có kho: lộ trình rỗng', () => {
    expect(nearestNeighbor([[0]])).toEqual([]);
  });
});

describe('twoOpt', () => {
  it('sửa lộ trình vòng vèo thành lộ trình ngắn nhất', () => {
    const better = twoOpt(D, [1, 2, 3]);
    expect(routeLength(D, better)).toBe(5);
  });

  it('không bao giờ làm lộ trình dài hơn', () => {
    const square = [
      [0, 1, 1.4, 1, 2],
      [1, 0, 1, 1.4, 2.2],
      [1.4, 1, 0, 1, 1.4],
      [1, 1.4, 1, 0, 1],
      [2, 2.2, 1.4, 1, 0],
    ];
    const start = nearestNeighbor(square);
    expect(routeLength(square, twoOpt(square, start))).toBeLessThanOrEqual(routeLength(square, start));
  });

  it('giữ đủ các đơn, không mất không trùng', () => {
    expect([...twoOpt(D, [3, 1, 2])].sort()).toEqual([1, 2, 3]);
  });
});