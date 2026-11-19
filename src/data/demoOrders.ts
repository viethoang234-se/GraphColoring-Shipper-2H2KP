// Bộ dữ liệu demo (TV4 + TV5).
// Thông số theo buổi họp T01: kho Bến Thành, bán kính 5 km, khu vực Quận 1 cũ, 3 shipper.
// Khung giờ tính bằng phút từ 0h: 480 = 8:00, 1020 = 17:00.
// Viết bằng .ts (thay vì .json) để TypeScript tự kiểm tra đúng kiểu Order trong core/types.ts.

import type { LatLng, Order } from '../core/types';

/** Kho xuất phát: chợ Bến Thành. */
export const DEPOT: LatLng = { lat: 10.7725, lng: 106.698 };

/** Bán kính phục vụ (mét). */
export const SERVICE_RADIUS_M = 5000;

/** Tốc độ shipper trung bình (km/h). */
export const SPEED_KMH = 25;

/** Số shipper mặc định. */
export const DEFAULT_SHIPPERS = 3;

/** 6 đơn: bộ nhỏ, dễ kiểm tra bằng tay khi thuyết trình. */
export const SMALL_ORDERS: Order[] = [
  {
    id: 'A1',
    pos: { lat: 10.7745, lng: 106.6935 },
    window: { start: 480, end: 570 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'A2',
    pos: { lat: 10.7768, lng: 106.7012 },
    window: { start: 510, end: 600 },
    serviceMin: 8,
    category: 'dong-lanh',
  },
  {
    id: 'A3',
    pos: { lat: 10.7699, lng: 106.6998 },
    window: { start: 540, end: 630 },
    serviceMin: 12,
    category: 'cong-kenh',
  },
  {
    id: 'A4',
    pos: { lat: 10.7801, lng: 106.6957 },
    window: { start: 600, end: 690 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'A5',
    pos: { lat: 10.7712, lng: 106.7044 },
    window: { start: 660, end: 750 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'A6',
    pos: { lat: 10.7672, lng: 106.6921 },
    window: { start: 690, end: 780 },
    serviceMin: 8,
    category: 'dong-lanh',
  },
];

/** 18 đơn rải trong ngày 8:00–18:00 quanh Quận 1 cũ. */
export const DEMO_ORDERS: Order[] = [
  {
    id: 'DH01',
    pos: { lat: 10.76745, lng: 106.69649 },
    window: { start: 480, end: 600 },
    serviceMin: 8,
    category: 'dong-lanh',
  },
  {
    id: 'DH02',
    pos: { lat: 10.76834, lng: 106.69246 },
    window: { start: 480, end: 600 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH03',
    pos: { lat: 10.78074, lng: 106.68924 },
    window: { start: 510, end: 630 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH04',
    pos: { lat: 10.77571, lng: 106.70753 },
    window: { start: 540, end: 600 },
    serviceMin: 12,
    category: 'cong-kenh',
  },
  {
    id: 'DH05',
    pos: { lat: 10.78003, lng: 106.69066 },
    window: { start: 540, end: 630 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH06',
    pos: { lat: 10.76889, lng: 106.69036 },
    window: { start: 570, end: 660 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH07',
    pos: { lat: 10.78013, lng: 106.70164 },
    window: { start: 600, end: 660 },
    serviceMin: 8,
    category: 'dong-lanh',
  },
  {
    id: 'DH08',
    pos: { lat: 10.7807, lng: 106.70078 },
    window: { start: 600, end: 690 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH09',
    pos: { lat: 10.76763, lng: 106.70224 },
    window: { start: 630, end: 750 },
    serviceMin: 8,
    category: 'dong-lanh',
  },
  {
    id: 'DH10',
    pos: { lat: 10.76661, lng: 106.69212 },
    window: { start: 660, end: 780 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH11',
    pos: { lat: 10.77936, lng: 106.70354 },
    window: { start: 780, end: 870 },
    serviceMin: 12,
    category: 'cong-kenh',
  },
  {
    id: 'DH12',
    pos: { lat: 10.78081, lng: 106.69706 },
    window: { start: 780, end: 870 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH13',
    pos: { lat: 10.77171, lng: 106.6916 },
    window: { start: 810, end: 870 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH14',
    pos: { lat: 10.76721, lng: 106.694 },
    window: { start: 840, end: 930 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH15',
    pos: { lat: 10.78863, lng: 106.70259 },
    window: { start: 870, end: 960 },
    serviceMin: 12,
    category: 'cong-kenh',
  },
  {
    id: 'DH16',
    pos: { lat: 10.78144, lng: 106.68946 },
    window: { start: 900, end: 1020 },
    serviceMin: 8,
    category: 'dong-lanh',
  },
  {
    id: 'DH17',
    pos: { lat: 10.77629, lng: 106.70314 },
    window: { start: 930, end: 990 },
    serviceMin: 5,
    category: 'thuong',
  },
  {
    id: 'DH18',
    pos: { lat: 10.7902, lng: 106.69643 },
    window: { start: 960, end: 1080 },
    serviceMin: 5,
    category: 'thuong',
  },
];
