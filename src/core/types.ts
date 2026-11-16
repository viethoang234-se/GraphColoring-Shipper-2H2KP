// Kiểu dữ liệu dùng chung cho cả nhóm. Muốn sửa file này phải báo cả nhóm trước.

export type LatLng = { lat: number; lng: number };
export type Category = 'thuong' | 'dong-lanh' | 'cong-kenh';

export interface Order {
  id: string;
  pos: LatLng;
  nodeId?: number; // node đường gần nhất (TV3 gán)
  window: { start: number; end: number }; // phút tính từ 0h, vd 540 = 9:00
  serviceMin: number; // số phút giao một đơn
  category: Category;
}

export interface RoadGraph {
  nodes: { id: number; lat: number; lng: number }[];
  adj: { to: number; w: number }[][]; // w tính bằng mét
}

export type ConflictReason = 'thoi-gian' | 'khoang-cach' | 'loai-hang';

export interface ConflictGraph {
  adj: number[][]; // đỉnh i ứng với orders[i]
  reasons: Record<string, ConflictReason[]>; // khóa "i-j" với i < j
}

export interface ColoringStep {
  vertex: number;
  color: number;
  note: string;
}

export interface Coloring {
  algorithm: string;
  colors: number[]; // colors[i] = màu của đỉnh i, bắt đầu từ 0
  k: number; // số màu đã dùng
  steps: ColoringStep[]; // danh sách bước, dùng cho animation
  ms: number; // thời gian chạy (mili giây)
}

export interface Route {
  color: number;
  shipper: number;
  shift: number;
  orderIds: string[];
  path: number[]; // dãy node đường
  lengthM: number;
  feasible: boolean;
}
