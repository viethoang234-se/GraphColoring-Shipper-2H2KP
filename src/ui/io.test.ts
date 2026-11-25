import { describe, it, expect } from 'vitest';
import { hhmmToMin, minToHhmm, parseOrdersCsv, parseOrdersJson, ordersToCsv } from './io';

const CSV = `id,lat,lng,start,end,serviceMin,category
A,10.7725,106.698,08:00,09:30,5,thuong
B,10.78,106.70,9:15,10:00,5,dong-lanh
`;

describe('đổi giờ', () => {
  it('HH:MM sang phút và ngược lại', () => {
    expect(hhmmToMin('08:00')).toBe(480);
    expect(hhmmToMin('9:15')).toBe(555);
    expect(minToHhmm(555)).toBe('09:15');
  });
  it('giờ sai dạng thì báo lỗi', () => {
    expect(() => hhmmToMin('25:00')).toThrow();
    expect(() => hhmmToMin('8h30')).toThrow();
  });
});

describe('parseOrdersCsv', () => {
  it('đọc đúng các cột', () => {
    const orders = parseOrdersCsv(CSV);
    expect(orders).toHaveLength(2);
    expect(orders[1]).toEqual({
      id: 'B',
      pos: { lat: 10.78, lng: 106.7 },
      window: { start: 555, end: 600 },
      serviceMin: 5,
      category: 'dong-lanh',
    });
  });
  it('thiếu cột thì báo lỗi nêu tên cột', () => {
    expect(() => parseOrdersCsv('id,lat,lng\nA,1,2')).toThrow();
  });
  it('loại hàng lạ thì báo lỗi', () => {
    expect(() => parseOrdersCsv(CSV.replace('thuong', 'hang-hoa'))).toThrow();
  });
  it('xuất ra CSV rồi đọc lại vẫn y nguyên', () => {
    const orders = parseOrdersCsv(CSV);
    expect(parseOrdersCsv(ordersToCsv(orders))).toEqual(orders);
  });
});

describe('parseOrdersJson', () => {
  it('đọc mảng đơn hàng', () => {
    const json = JSON.stringify(parseOrdersCsv(CSV));
    expect(parseOrdersJson(json)).toHaveLength(2);
  });
  it('JSON lỗi cú pháp hoặc không phải mảng thì báo lỗi', () => {
    expect(() => parseOrdersJson('{ hỏng')).toThrow();
    expect(() => parseOrdersJson('{"id":"A"}')).toThrow();
  });
  it('giờ kết thúc trước giờ bắt đầu thì báo lỗi', () => {
    const bad = [{ id: 'A', pos: { lat: 1, lng: 2 }, window: { start: 600, end: 500 }, serviceMin: 5, category: 'thuong' }];
    expect(() => parseOrdersJson(JSON.stringify(bad))).toThrow();
  });
});
