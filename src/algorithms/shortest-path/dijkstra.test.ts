import { describe, it, expect } from 'vitest';
import type { RoadGraph } from '../../core/types';
import { dijkstra, pathTo } from './dijkstra';

/** Đồ thị vô hướng từ danh sách cạnh [u, v, mét]; tọa độ không dùng tới nên để 0. */
function road(n: number, edges: [number, number, number][]): RoadGraph {
  const g: RoadGraph = {
    nodes: Array.from({ length: n }, (_, id) => ({ id, lat: 0, lng: 0 })),
    adj: Array.from({ length: n }, () => []),
  };
  for (const [u, v, w] of edges) {
    g.adj[u].push({ to: v, w });
    g.adj[v].push({ to: u, w });
  }
  return g;
}

// Đồ thị chạy tay ở trên: hãy vẽ 6 đỉnh và 6 cạnh này ra giấy. Đỉnh 5 không nối với ai.
const g = road(6, [
  [0, 1, 4],
  [0, 2, 1],
  [2, 1, 2],
  [1, 3, 1],
  [2, 3, 5],
  [3, 4, 3],
]);

describe('dijkstra', () => {
  const { dist, prev } = dijkstra(g, 0);

  it('khoảng cách ngắn nhất khớp với kết quả tính tay', () => {
    expect(dist.slice(0, 5)).toEqual([0, 3, 1, 4, 7]);
  });

  it('đỉnh không tới được có khoảng cách Infinity', () => {
    expect(dist[5]).toBe(Infinity);
  });

  it('truy vết đường đi ngắn nhất 0 → 4', () => {
    expect(pathTo(prev, 0, 4)).toEqual([0, 2, 1, 3, 4]);
  });

  it('đường đi tới chính nó chỉ có 1 đỉnh, tới đỉnh không nối được thì rỗng', () => {
    expect(pathTo(prev, 0, 0)).toEqual([0]);
    expect(pathTo(prev, 0, 5)).toEqual([]);
  });

  it('chọn đường vòng rẻ hơn thay vì cạnh trực tiếp đắt', () => {
    // cạnh 0-1 dài 4, nhưng đi 0-2-1 chỉ 3
    expect(prev[1]).toBe(2);
  });
});