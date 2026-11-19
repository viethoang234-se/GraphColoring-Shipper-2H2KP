// ⚠️ PIPELINE TẠM của TV4 — chỉ để giao diện chạy được trong lúc chờ module thật.
// Khi TV1 xong T17 (conflict) + TV2 xong tô màu, TV1 truyền pipeline thật vào <ShipperApp pipeline={...} />
// rồi XÓA file này. Quy tắc xung đột ở đây là tạm, KHÔNG phải quy tắc chính thức của nhóm.

import type { ColoringAlgorithm } from '../algorithms/coloring';
import type { ColoringStep, ConflictGraph, ConflictReason, LatLng, Order } from '../core/types';
import type { UiPipeline } from './contracts';

function distanceM(a: LatLng, b: LatLng): number {
  const R = 6371000;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const h = Math.sin(dLat / 2) ** 2 + Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * R * Math.asin(Math.sqrt(h));
}

/** Xung đột tạm: hai đơn KHÔNG được đi chung một chuyến nếu... */
function mockConflictGraph(orders: Order[]): ConflictGraph {
  const n = orders.length;
  const adj: number[][] = Array.from({ length: n }, () => []);
  const reasons: Record<string, ConflictReason[]> = {};
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = orders[i];
      const b = orders[j];
      const why: ConflictReason[] = [];
      // ...khung giờ cách nhau quá 1 tiếng (không thể gộp một chuyến)
      const gap = Math.max(a.window.start, b.window.start) - Math.min(a.window.end, b.window.end);
      if (gap > 60) why.push('thoi-gian');
      // ...cách nhau quá 2,5 km
      if (distanceM(a.pos, b.pos) > 2500) why.push('khoang-cach');
      // ...hàng đông lạnh không chở chung hàng cồng kềnh
      const cats = [a.category, b.category];
      if (cats.includes('dong-lanh') && cats.includes('cong-kenh')) why.push('loai-hang');
      if (why.length > 0) {
        adj[i].push(j);
        adj[j].push(i);
        reasons[`${i}-${j}`] = why;
      }
    }
  }
  return { adj, reasons };
}

/** Greedy tạm: duyệt đỉnh 0,1,2,... gán màu nhỏ nhất chưa bị hàng xóm dùng. */
const mockGreedy: ColoringAlgorithm = (adj) => {
  const t0 = performance.now();
  const n = adj.length;
  const colors = new Array<number>(n).fill(-1);
  const steps: ColoringStep[] = [];
  for (let v = 0; v < n; v++) {
    const used = new Set(adj[v].map((u) => colors[u]).filter((c) => c >= 0));
    let c = 0;
    while (used.has(c)) c++;
    colors[v] = c;
    const usedText = used.size
      ? [...used]
          .sort((x, y) => x - y)
          .map((x) => x + 1)
          .join(', ')
      : 'không có';
    steps.push({ vertex: v, color: c, note: `Hàng xóm đã dùng màu: ${usedText} → chọn màu ${c + 1}` });
  }
  const k = n === 0 ? 0 : Math.max(...colors) + 1;
  return { algorithm: 'Greedy (tạm)', colors, k, steps, ms: performance.now() - t0 };
};

export const devPipeline: UiPipeline = {
  buildConflictGraph: mockConflictGraph,
  algorithms: [{ id: 'greedy-mock', label: 'Greedy (bản tạm của TV4)', run: mockGreedy }],
};
