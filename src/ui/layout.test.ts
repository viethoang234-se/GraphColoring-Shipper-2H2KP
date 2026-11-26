import { describe, it, expect } from 'vitest';
import { circleLayout } from './layout';

describe('circleLayout', () => {
  it('không có đỉnh: mảng rỗng', () => {
    expect(circleLayout(0, 100, 100, 50)).toEqual([]);
  });

  it('đỉnh đầu tiên nằm trên cùng của vòng tròn', () => {
    const [p] = circleLayout(1, 100, 100, 50);
    expect(p.x).toBeCloseTo(100, 6);
    expect(p.y).toBeCloseTo(50, 6);
  });

  it('4 đỉnh chia đều theo chiều kim đồng hồ: trên, phải, dưới, trái', () => {
    const ps = circleLayout(4, 100, 100, 50);
    const rounded = ps.map((p) => [Math.round(p.x), Math.round(p.y)]);
    expect(rounded).toEqual([[100, 50], [150, 100], [100, 150], [50, 100]]);
  });

  it('mọi đỉnh cách tâm đúng bán kính', () => {
    for (const p of circleLayout(7, 0, 0, 80)) {
      expect(Math.hypot(p.x, p.y)).toBeCloseTo(80, 6);
    }
  });
});
