import { describe, it, expect } from 'vitest';
import { isValidColoring, cliqueLowerBound } from './validate';
import { fromEdges, complete, cycle, petersen } from './graphs';

describe('isValidColoring', () => {
  const tri = complete(3);
  it('tô đúng thì trả về true', () => {
    expect(isValidColoring(tri, [0, 1, 2])).toBe(true);
  });
  it('hai đỉnh kề cùng màu thì false', () => {
    expect(isValidColoring(tri, [0, 0, 1])).toBe(false);
  });
  it('thiếu màu cho một đỉnh thì false', () => {
    expect(isValidColoring(tri, [0, 1])).toBe(false);
  });
  it('màu âm (chưa tô) thì false', () => {
    expect(isValidColoring(tri, [0, 1, -1])).toBe(false);
  });
});

describe('cliqueLowerBound', () => {
  it('K4 chứa clique 4 đỉnh', () => {
    expect(cliqueLowerBound(complete(4))).toBe(4);
  });
  it('C5 và Petersen không có tam giác: cận dưới 2', () => {
    expect(cliqueLowerBound(cycle(5))).toBe(2);
    expect(cliqueLowerBound(petersen())).toBe(2);
  });
  it('tam giác có thêm một đỉnh treo: 3', () => {
    expect(cliqueLowerBound(fromEdges(4, [[0, 1], [1, 2], [0, 2], [2, 3]]))).toBe(3);
  });
  it('đồ thị rỗng: 0', () => {
    expect(cliqueLowerBound([])).toBe(0);
  });
});
