import { describe, it, expect } from 'vitest';
import { greedy } from './greedy';
import { fromEdges, complete, crown } from './graphs';

describe('greedy', () => {
  it('đồ thị rỗng: 0 màu', () => {
    const r = greedy([]);
    expect(r.k).toBe(0);
    expect(r.colors).toEqual([]);
  });

  it('một đỉnh cô lập: 1 màu', () => {
    expect(greedy([[]]).k).toBe(1);
  });

  it('tam giác: đúng 3 màu, màu lần lượt 0, 1, 2', () => {
    const r = greedy(complete(3));
    expect(r.k).toBe(3);
    expect(r.colors).toEqual([0, 1, 2]);
  });

  it('đường đi 0-1-2: 2 màu xen kẽ', () => {
    expect(greedy(fromEdges(3, [[0, 1], [1, 2]])).colors).toEqual([0, 1, 0]);
  });

  it('ghi đủ một bước cho mỗi đỉnh, đúng thứ tự 0, 1, 2, ...', () => {
    const r = greedy(complete(4));
    expect(r.steps).toHaveLength(4);
    expect(r.steps.map((s) => s.vertex)).toEqual([0, 1, 2, 3]);
    expect(r.steps[3].color).toBe(3);
  });

  it('điểm yếu: đồ thị vương miện 8 đỉnh có χ = 2 nhưng Greedy dùng 4 màu', () => {
    expect(greedy(crown(4)).k).toBe(4);
  });
});
