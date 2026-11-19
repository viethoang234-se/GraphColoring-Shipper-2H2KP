// Các hàm thuần (không dùng React) của giao diện. Tách riêng để viết test dễ.

import type { ColoringStep, Category, LatLng, Order } from '../core/types';

// ---------- Màu ----------

const PALETTE = [
  '#e6194b',
  '#3cb44b',
  '#4363d8',
  '#f58231',
  '#911eb4',
  '#2bb3c0',
  '#f032e6',
  '#9a6324',
  '#469990',
  '#808000',
];
const PALETTE_NAMES = ['Đỏ', 'Lục', 'Lam', 'Cam', 'Tím', 'Ngọc', 'Hồng', 'Nâu', 'Rêu', 'Ô liu'];

/** Mã màu hiển thị cho màu số c. c < 0 nghĩa là đỉnh chưa tô. */
export function colorHex(c: number): string {
  if (c < 0) return '#c4c8d0';
  return PALETTE[c % PALETTE.length];
}

/** Tên màu tiếng Việt, vd "Màu 1 (Đỏ)". Màu đếm từ 0 trong code nhưng hiện từ 1 cho người xem. */
export function colorLabel(c: number): string {
  if (c < 0) return 'Chưa tô';
  const name = PALETTE_NAMES[c % PALETTE_NAMES.length];
  return `Màu ${c + 1} (${name})`;
}

export const CATEGORY_LABEL: Record<Category, string> = {
  thuong: 'Thường',
  'dong-lanh': 'Đông lạnh',
  'cong-kenh': 'Cồng kềnh',
};

export const REASON_LABEL: Record<string, string> = {
  'thoi-gian': 'trùng khung giờ',
  'khoang-cach': 'quá xa nhau',
  'loai-hang': 'loại hàng không đi chung',
};

// ---------- Định dạng ----------

/** 540 -> "09:00". */
export function minutesToHHMM(min: number): string {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

export function formatMs(ms: number): string {
  if (ms < 1) return `${ms.toFixed(3)} ms`;
  if (ms < 100) return `${ms.toFixed(2)} ms`;
  return `${Math.round(ms)} ms`;
}

// ---------- Animation ----------

/**
 * Màu của mọi đỉnh sau khi đã chạy `stepIndex` bước đầu tiên.
 * stepIndex = 0: chưa tô gì; stepIndex = steps.length: tô xong.
 * Bước có color = -1 nghĩa là bỏ màu (dùng cho thuật toán quay lui).
 */
export function colorsAtStep(n: number, steps: ColoringStep[], stepIndex: number): number[] {
  const colors = new Array<number>(n).fill(-1);
  const last = Math.min(Math.max(stepIndex, 0), steps.length);
  for (let i = 0; i < last; i++) {
    const { vertex, color } = steps[i];
    if (vertex >= 0 && vertex < n) colors[vertex] = color;
  }
  return colors;
}

// ---------- Kiểm tra kết quả ----------

/** Các cạnh (i < j) mà hai đầu đã tô CÙNG một màu — tô màu đúng thì danh sách này rỗng. */
export function badEdges(adj: number[][], colors: number[]): [number, number][] {
  const bad: [number, number][] = [];
  adj.forEach((nbrs, i) => {
    for (const j of nbrs) {
      if (i < j && colors[i] >= 0 && colors[i] === colors[j]) bad.push([i, j]);
    }
  });
  return bad;
}

/** Danh sách cạnh không trùng (i < j) để vẽ. */
export function edgeList(adj: number[][]): [number, number][] {
  const edges: [number, number][] = [];
  adj.forEach((nbrs, i) => {
    for (const j of nbrs) if (i < j) edges.push([i, j]);
  });
  return edges;
}

/** Gom chỉ số đơn theo màu: groups[c] = các đỉnh có màu c, mỗi nhóm sắp theo giờ bắt đầu. */
export function groupByColor(orders: Order[], colors: number[], k: number): number[][] {
  const groups: number[][] = Array.from({ length: k }, () => []);
  colors.forEach((c, i) => {
    if (c >= 0 && c < k) groups[c].push(i);
  });
  for (const g of groups) g.sort((a, b) => orders[a].window.start - orders[b].window.start);
  return groups;
}

/**
 * Gợi ý xếp nhóm màu cho shipper khi CHƯA có lộ trình thật từ pipeline:
 * màu c -> shipper (c mod S) + 1, chuyến thứ floor(c / S) + 1.
 */
export function suggestShipper(color: number, shippers: number): { shipper: number; trip: number } {
  const s = Math.max(1, shippers);
  return { shipper: (color % s) + 1, trip: Math.floor(color / s) + 1 };
}

/**
 * Xếp các khoảng thời gian vào ít "làn" nhất để thanh trên biểu đồ không đè nhau.
 * Duyệt theo giờ bắt đầu, đặt vào làn đầu tiên đã trống — chính là tô màu
 * đồ thị khoảng bằng Greedy. Trả về lanes[i] = làn của khoảng thứ i.
 */
export function packLanes(intervals: { start: number; end: number }[]): number[] {
  const order = intervals.map((_, i) => i).sort((a, b) => intervals[a].start - intervals[b].start);
  const laneEnd: number[] = [];
  const lanes = new Array<number>(intervals.length).fill(0);
  for (const i of order) {
    let lane = laneEnd.findIndex((end) => end <= intervals[i].start);
    if (lane === -1) {
      lane = laneEnd.length;
      laneEnd.push(0);
    }
    laneEnd[lane] = intervals[i].end;
    lanes[i] = lane;
  }
  return lanes;
}

// ---------- Bố cục vẽ đồ thị ----------

export interface Point {
  x: number;
  y: number;
}

/** Chiếu kinh độ/vĩ độ lên khung w×h (giữ đúng tỉ lệ, chừa lề pad). */
export function projectLatLng(points: LatLng[], w: number, h: number, pad: number): Point[] {
  if (points.length === 0) return [];
  const midLat = points.reduce((s, p) => s + p.lat, 0) / points.length;
  const kx = Math.cos((midLat * Math.PI) / 180); // 1 độ kinh ngắn hơn 1 độ vĩ
  const xs = points.map((p) => p.lng * kx);
  const ys = points.map((p) => p.lat);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  const spanX = maxX - minX || 1e-9;
  const spanY = maxY - minY || 1e-9;
  const scale = Math.min((w - 2 * pad) / spanX, (h - 2 * pad) / spanY);
  const offX = (w - spanX * scale) / 2;
  const offY = (h - spanY * scale) / 2;
  // Vĩ độ lớn ở phía bắc -> vẽ lên trên, nên lật trục y.
  return xs.map((x, i) => ({ x: offX + (x - minX) * scale, y: h - (offY + (ys[i] - minY) * scale) }));
}

/**
 * Đẩy nhẹ các đỉnh nằm quá sát nhau (dưới minDist) ra xa nhau cho dễ nhìn,
 * vẫn giữ trong khung w×h. Vị trí gần như giữ nguyên nên hình vẫn giống bản đồ.
 */
export function spreadOverlaps(points: Point[], minDist: number, w: number, h: number, pad: number): Point[] {
  const p = points.map((q) => ({ ...q }));
  for (let iter = 0; iter < 60; iter++) {
    let moved = false;
    for (let i = 0; i < p.length; i++) {
      for (let j = i + 1; j < p.length; j++) {
        let dx = p[j].x - p[i].x;
        let dy = p[j].y - p[i].y;
        let d = Math.hypot(dx, dy);
        if (d >= minDist) continue;
        if (d < 1e-6) {
          // trùng hẳn: tách theo một hướng cố định
          dx = 1;
          dy = 0;
          d = 1;
        }
        const push = (minDist - d) / 2;
        p[i].x -= (dx / d) * push;
        p[i].y -= (dy / d) * push;
        p[j].x += (dx / d) * push;
        p[j].y += (dy / d) * push;
        moved = true;
      }
    }
    for (const q of p) {
      q.x = Math.min(w - pad, Math.max(pad, q.x));
      q.y = Math.min(h - pad, Math.max(pad, q.y));
    }
    if (!moved) break;
  }
  return p;
}

/** Xếp n đỉnh đều trên một vòng tròn. */
export function circleLayout(n: number, w: number, h: number, pad: number): Point[] {
  const r = Math.min(w, h) / 2 - pad;
  return Array.from({ length: n }, (_, i) => {
    const a = (2 * Math.PI * i) / Math.max(n, 1) - Math.PI / 2;
    return { x: w / 2 + r * Math.cos(a), y: h / 2 + r * Math.sin(a) };
  });
}
