import type { ShortestPathFn } from './index';
import { MinHeap } from './minHeap';

export const dijkstra: ShortestPathFn = (g, source) => {
  const n = g.nodes.length;
  const dist = new Array<number>(n).fill(Infinity);
  const prev = new Array<number>(n).fill(-1);

  dist[source] = 0;
  const heap = new MinHeap<number>();
  heap.push(source, 0);

  while (heap.size > 0) {
    const { item: u, key } = heap.pop()!;
    // Bỏ qua bản cũ (lazy deletion)
    if (key > dist[u]) continue;

    for (const { to, w } of g.adj[u]) {
      const alt = dist[u] + w;
      if (alt < dist[to]) {
        dist[to] = alt;
        prev[to] = u;
        heap.push(to, alt);
      }
    }
  }

  return { dist, prev };
};

/** Đường đi từ source tới target theo prev. target === source thì [source]; không có đường thì []. */
export function pathTo(prev: number[], source: number, target: number): number[] {
  if (target === source) return [source];
  if (prev[target] === -1) return [];

  const path: number[] = [];
  let cur = target;
  while (cur !== -1) {
    path.push(cur);
    if (cur === source) return path.reverse();
    cur = prev[cur];
  }

  return [];
}