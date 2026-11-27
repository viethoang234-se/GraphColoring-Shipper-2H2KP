import { describe, it, expect } from 'vitest';
import { dsatur } from './dsatur';
import { complete, cycle, crown, petersen } from './graphs';
import { isValidColoring } from './validate';

describe('dsatur', () => {
  it('đồ thị rỗng: 0 màu', () => {
    expect(dsatur([]).k).toBe(0);
  });

  it('K5: 5 màu', () => {
    expect(dsatur(complete(5)).k).toBe(5);
  });

  it('chu trình chẵn C6: 2 màu, chu trình lẻ C5: 3 màu', () => {
    expect(dsatur(cycle(6)).k).toBe(2);
    expect(dsatur(cycle(5)).k).toBe(3);
  });

  it('đồ thị vương miện: đúng 2 màu (Greedy cần 4)', () => {
    expect(dsatur(crown(4)).k).toBe(2);
  });

  it('Petersen: 3 màu và hợp lệ', () => {
    const adj = petersen();
    const r = dsatur(adj);
    expect(r.k).toBe(3);
    expect(isValidColoring(adj, r.colors)).toBe(true);
  });

  it('bước đầu tiên chọn đỉnh bậc cao nhất', () => {
    // đỉnh 2 có bậc 3
    const adj = [[2], [2], [0, 1, 3], [2]];
    expect(dsatur(adj).steps[0].vertex).toBe(2);
  });
});
