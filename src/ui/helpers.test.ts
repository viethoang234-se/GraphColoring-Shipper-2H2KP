import { describe, expect, it } from 'vitest';
import type { ColoringStep } from '../core/types';
import { badEdges, colorsAtStep, edgeList, groupByColor, minutesToHHMM, packLanes, suggestShipper } from './helpers';
import { DEMO_ORDERS } from '../data/demoOrders';

describe('minutesToHHMM', () => {
  it('đổi phút sang giờ:phút', () => {
    expect(minutesToHHMM(0)).toBe('00:00');
    expect(minutesToHHMM(540)).toBe('09:00');
    expect(minutesToHHMM(1005)).toBe('16:45');
  });
});

describe('colorsAtStep', () => {
  const steps: ColoringStep[] = [
    { vertex: 0, color: 0, note: '' },
    { vertex: 1, color: 1, note: '' },
    { vertex: 1, color: -1, note: 'quay lui' },
    { vertex: 2, color: 0, note: '' },
  ];
  it('bước 0: chưa tô đỉnh nào', () => {
    expect(colorsAtStep(3, steps, 0)).toEqual([-1, -1, -1]);
  });
  it('tô dần theo từng bước', () => {
    expect(colorsAtStep(3, steps, 2)).toEqual([0, 1, -1]);
  });
  it('bước có color = -1 là bỏ màu (quay lui)', () => {
    expect(colorsAtStep(3, steps, 3)).toEqual([0, -1, -1]);
  });
  it('stepIndex vượt quá thì dừng ở bước cuối', () => {
    expect(colorsAtStep(3, steps, 99)).toEqual([0, -1, 0]);
  });
});

describe('badEdges / edgeList', () => {
  const triangle = [
    [1, 2],
    [0, 2],
    [0, 1],
  ];
  it('mỗi cạnh chỉ liệt kê một lần', () => {
    expect(edgeList(triangle)).toEqual([
      [0, 1],
      [0, 2],
      [1, 2],
    ]);
  });
  it('tô đúng thì không có cạnh hỏng', () => {
    expect(badEdges(triangle, [0, 1, 2])).toEqual([]);
  });
  it('phát hiện cạnh hai đầu cùng màu', () => {
    expect(badEdges(triangle, [0, 0, 1])).toEqual([[0, 1]]);
  });
  it('đỉnh chưa tô (-1) không tính là trùng màu', () => {
    expect(badEdges(triangle, [-1, -1, 0])).toEqual([]);
  });
});

describe('groupByColor', () => {
  it('gom đơn theo màu và sắp theo giờ bắt đầu', () => {
    const orders = DEMO_ORDERS.slice(0, 4);
    const groups = groupByColor(orders, [1, 0, 1, 0], 2);
    expect(groups).toEqual([
      [1, 3],
      [0, 2],
    ]);
  });
});

describe('suggestShipper', () => {
  it('chia vòng tròn các màu cho shipper', () => {
    expect(suggestShipper(0, 3)).toEqual({ shipper: 1, trip: 1 });
    expect(suggestShipper(2, 3)).toEqual({ shipper: 3, trip: 1 });
    expect(suggestShipper(3, 3)).toEqual({ shipper: 1, trip: 2 });
  });
});

describe('packLanes', () => {
  it('khoảng không giao nhau dùng chung một làn', () => {
    expect(packLanes([{ start: 0, end: 10 }, { start: 10, end: 20 }])).toEqual([0, 0]);
  });
  it('khoảng giao nhau tách sang làn khác', () => {
    expect(packLanes([{ start: 0, end: 10 }, { start: 5, end: 15 }, { start: 12, end: 20 }])).toEqual([0, 1, 0]);
  });
});
