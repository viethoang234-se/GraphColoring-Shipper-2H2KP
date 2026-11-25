import { describe, it, expect } from 'vitest';
import { scheduleTrip, splitTrip } from './schedule';

describe('scheduleTrip', () => {
  it('đến kịp mọi đơn: lateIndex = -1', () => {
    // xuất phát 8:00 (480). Đi 10 phút tới đơn 1, giao 5 phút, đi 15 phút tới đơn 2.
    const r = scheduleTrip([10, 15], [{ start: 480, end: 600 }, { start: 480, end: 600 }], [5, 5], 480);
    expect(r.arrivals).toEqual([490, 510]);
    expect(r.lateIndex).toBe(-1);
  });

  it('đến sớm thì chờ tới giờ mở khung', () => {
    const r = scheduleTrip([10], [{ start: 540, end: 600 }], [5], 480);
    expect(r.arrivals).toEqual([540]);
  });

  it('đến trễ hơn giờ đóng khung: báo vị trí đơn trễ đầu tiên', () => {
    const r = scheduleTrip([10, 60, 5], [{ start: 480, end: 600 }, { start: 480, end: 520 }, { start: 480, end: 600 }], [5, 5, 5], 480);
    expect(r.lateIndex).toBe(1);
  });
});

describe('splitTrip', () => {
  it('không trễ thì giữ nguyên', () => {
    expect(splitTrip([4, 2, 7], -1)).toEqual({ kept: [4, 2, 7], moved: [] });
  });
  it('tách từ đơn trễ trở đi sang chuyến mới', () => {
    expect(splitTrip([4, 2, 7], 1)).toEqual({ kept: [4], moved: [2, 7] });
  });
});