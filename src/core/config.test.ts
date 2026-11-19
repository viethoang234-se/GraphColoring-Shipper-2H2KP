import { describe, it, expect } from 'vitest';
import { DEFAULT_OPTIONS, travelMin } from './config';

describe('config', () => {
  it('1 km với tốc độ 25 km/h mất 2,4 phút', () => {
    expect(travelMin(1000, 25)).toBeCloseTo(2.4, 6);
  });
  it('0 mét mất 0 phút', () => {
    expect(travelMin(0, 25)).toBe(0);
  });
  it('ca 1 bắt đầu lúc 8:00 và bán kính xung đột 5 km', () => {
    expect(DEFAULT_OPTIONS.startMin).toBe(480);
    expect(DEFAULT_OPTIONS.radiusM).toBe(5000);
  });
});