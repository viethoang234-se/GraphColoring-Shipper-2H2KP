import type { LatLng } from './types';

/** Các tham số của mô hình, đã chốt ở buổi họp T01. */
export interface PipelineOptions {
  depot: LatLng; // vị trí kho, nơi mọi chuyến xuất phát
  radiusM: number; // bán kính xung đột: 2 đơn xa hơn số mét này thì không đi chung chuyến
  speedKmh: number; // tốc độ trung bình của shipper
  shippers: number; // số shipper
  startMin: number; // giờ bắt đầu ca 1, tính bằng phút từ 0h (480 = 8:00)
  shiftMin: number; // độ dài một ca, tính bằng phút
}

export const DEFAULT_OPTIONS: PipelineOptions = {
  depot: { lat: 10.7725, lng: 106.698 }, // khu chợ Bến Thành
  radiusM: 5000,
  speedKmh: 25,
  shippers: 3,
  startMin: 480,
  shiftMin: 240,
};

/** Đổi quãng đường (mét) thành số phút di chuyển với tốc độ speedKmh. */
export function travelMin(distM: number, speedKmh: number): number {
  return (distM / 1000 / speedKmh) * 60;
}