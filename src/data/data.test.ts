import { describe, expect, it } from 'vitest';
import { DEMO_ORDERS, DEPOT, SERVICE_RADIUS_M, SMALL_ORDERS } from './demoOrders';
import { TEST_GRAPHS } from './testGraphs';

function distanceM(a: { lat: number; lng: number }, b: { lat: number; lng: number }) {
  const R = 6371000;
  const rad = (d: number) => (d * Math.PI) / 180;
  const h =
    Math.sin(rad(b.lat - a.lat) / 2) ** 2 +
    Math.cos(rad(a.lat)) * Math.cos(rad(b.lat)) * Math.sin(rad(b.lng - a.lng) / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

describe.each([
  ['DEMO_ORDERS', DEMO_ORDERS],
  ['SMALL_ORDERS', SMALL_ORDERS],
])('bộ đơn %s', (_name, orders) => {
  it('mã đơn không trùng', () => {
    expect(new Set(orders.map((o) => o.id)).size).toBe(orders.length);
  });
  it('khung giờ hợp lệ (bắt đầu < kết thúc, trong ngày)', () => {
    for (const o of orders) {
      expect(o.window.start).toBeLessThan(o.window.end);
      expect(o.window.start).toBeGreaterThanOrEqual(0);
      expect(o.window.end).toBeLessThanOrEqual(24 * 60);
    }
  });
  it('mọi đơn nằm trong bán kính phục vụ quanh kho', () => {
    for (const o of orders) expect(distanceM(DEPOT, o.pos)).toBeLessThanOrEqual(SERVICE_RADIUS_M);
  });
  it('thời gian giao một đơn dương', () => {
    for (const o of orders) expect(o.serviceMin).toBeGreaterThan(0);
  });
});

describe('TEST_GRAPHS', () => {
  it.each(TEST_GRAPHS.map((g) => [g.name, g] as const))('%s: danh sách kề đối xứng, không khuyên', (_n, g) => {
    g.adj.forEach((nbrs, u) => {
      for (const v of nbrs) {
        expect(v).not.toBe(u);
        expect(g.adj[v]).toContain(u);
      }
    });
  });

  it('Bẫy Greedy: tô Greedy theo thứ tự 0..n-1 dùng 3 màu dù chi = 2', () => {
    const g = TEST_GRAPHS.find((t) => t.name.startsWith('Bẫy Greedy'))!;
    const colors: number[] = [];
    g.adj.forEach((nbrs, v) => {
      const used = new Set(nbrs.filter((u) => u < v).map((u) => colors[u]));
      let c = 0;
      while (used.has(c)) c++;
      colors[v] = c;
    });
    expect(Math.max(...colors) + 1).toBe(3);
    expect(g.chi).toBe(2);
  });
});
