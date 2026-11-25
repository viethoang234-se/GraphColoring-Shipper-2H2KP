import { describe, it, expect } from 'vitest';
import type { Order, RoadGraph } from '../core/types';
import { haversineM } from './geo';
import { nearestNode, snapOrders } from './snap';

describe('haversineM', () => {
  it('cùng một điểm: 0 mét', () => {
    expect(haversineM({ lat: 10.77, lng: 106.7 }, { lat: 10.77, lng: 106.7 })).toBe(0);
  });

  it('lệch 1 độ vĩ: khoảng 111 195 mét', () => {
    const d = haversineM({ lat: 10, lng: 106 }, { lat: 11, lng: 106 });
    expect(Math.abs(d - 111195)).toBeLessThan(1);
  });

  it('đối xứng: A → B bằng B → A', () => {
    const a = { lat: 10.7725, lng: 106.698 };
    const b = { lat: 10.7798, lng: 106.699 };
    expect(haversineM(a, b)).toBeCloseTo(haversineM(b, a), 6);
  });
});

describe('nearestNode và snapOrders', () => {
  const g: RoadGraph = {
    nodes: [
      { id: 0, lat: 10.77, lng: 106.69 },
      { id: 1, lat: 10.78, lng: 106.7 },
      { id: 2, lat: 10.79, lng: 106.71 },
    ],
    adj: [[], [], []],
  };

  it('chọn node gần nhất', () => {
    expect(nearestNode(g, { lat: 10.781, lng: 106.701 })).toBe(1);
    expect(nearestNode(g, { lat: 10.7, lng: 106.6 })).toBe(0);
  });

  it('gán nodeId cho mọi đơn mà không sửa mảng gốc', () => {
    const orders: Order[] = [
      { id: 'A', pos: { lat: 10.789, lng: 106.709 }, window: { start: 480, end: 540 }, serviceMin: 5, category: 'thuong' },
    ];
    const snapped = snapOrders(orders, g);
    expect(snapped[0].nodeId).toBe(2);
    expect(orders[0].nodeId).toBeUndefined();
  });
});