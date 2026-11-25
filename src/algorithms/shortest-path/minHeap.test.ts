import { describe, it, expect } from 'vitest';
import { MinHeap } from './minHeap';

describe('MinHeap', () => {
  it('heap rỗng: size 0, pop trả về undefined', () => {
    const h = new MinHeap<string>();
    expect(h.size).toBe(0);
    expect(h.pop()).toBeUndefined();
  });

  it('luôn lấy ra phần tử có key nhỏ nhất trước', () => {
    const h = new MinHeap<string>();
    h.push('c', 5);
    h.push('a', 1);
    h.push('b', 3);
    expect(h.size).toBe(3);
    expect(h.pop()).toEqual({ item: 'a', key: 1 });
    expect(h.pop()).toEqual({ item: 'b', key: 3 });
    expect(h.pop()).toEqual({ item: 'c', key: 5 });
    expect(h.size).toBe(0);
  });

  it('1000 số ngẫu nhiên lấy ra theo thứ tự tăng dần', () => {
    const h = new MinHeap<number>();
    const xs = Array.from({ length: 1000 }, () => Math.random() * 1000);
    xs.forEach((x) => h.push(x, x));
    const out: number[] = [];
    while (h.size > 0) out.push(h.pop()!.key);
    expect(out).toEqual([...xs].sort((a, b) => a - b));
  });
});