import type { Coloring, ColoringStep } from '../../core/types';
import type { ColoringAlgorithm } from './index';

/** Tô màu tham lam theo một thứ tự đỉnh cho trước. Welsh–Powell (T08) dùng lại hàm này. */
export function colorInOrder(adj: number[][], order: number[], algorithm: string): Coloring {
  const start = performance.now();
  const colors: number[] = Array.from({ length: adj.length }, () => -1); // -1 = chưa tô
  const steps: ColoringStep[] = [];

  for (const v of order) {
    // các màu đã có ở những đỉnh kề v
    const used = new Set<number>();
    for (const u of adj[v]) if (colors[u] >= 0) used.add(colors[u]);

    // màu nhỏ nhất chưa ai dùng
    let c = 0;
    while (used.has(c)) c++;
    colors[v] = c;

    const list = [...used].sort((a, b) => a - b);
    const note =
      list.length === 0
        ? `Đỉnh ${v}: chưa có đỉnh kề nào được tô → chọn màu ${c}`
        : `Đỉnh ${v}: kề màu {${list.join(',')}} → chọn màu ${c}`;
    steps.push({ vertex: v, color: c, note });
  }

  const k = new Set(colors.filter((c) => c >= 0)).size;
  return { algorithm, colors, k, steps, ms: performance.now() - start };
}

export const greedy: ColoringAlgorithm = (adj) => colorInOrder(adj, adj.map((_, i) => i), 'greedy');
