import type { ColoringStep } from '../../core/types';
import type { ColoringAlgorithm } from './index';

/**
 * DSatur: mỗi vòng chọn đỉnh chưa tô có độ bão hòa lớn nhất
 * (độ bão hòa = số màu KHÁC NHAU ở các đỉnh kề); bằng nhau thì bậc lớn hơn;
 * vẫn bằng thì số đỉnh nhỏ hơn. Bản đơn giản O(n²), không dùng hàng đợi ưu tiên.
 */
export const dsatur: ColoringAlgorithm = (adj) => {
  const start = performance.now();
  const n = adj.length;
  const colors: number[] = Array.from({ length: n }, () => -1); // -1 = chưa tô
  const steps: ColoringStep[] = [];

  // tập kề (bỏ cạnh trùng và khuyên) và tập màu đang có ở các đỉnh kề của mỗi đỉnh
  const nb = adj.map((list, u) => new Set(list.filter((v) => v !== u)));
  const seen: Set<number>[] = Array.from({ length: n }, () => new Set<number>());

  for (let round = 0; round < n; round++) {
    // chọn đỉnh chưa tô: bão hòa lớn nhất → bậc lớn hơn → số nhỏ hơn
    let v = -1;
    for (let u = 0; u < n; u++) {
      if (colors[u] !== -1) continue;
      if (
        v === -1 ||
        seen[u].size > seen[v].size ||
        (seen[u].size === seen[v].size && nb[u].size > nb[v].size)
      ) {
        v = u; // duyệt u tăng dần nên khi bằng hết thì giữ đỉnh số nhỏ hơn
      }
    }

    // màu nhỏ nhất chưa đỉnh kề nào dùng
    let c = 0;
    while (seen[v].has(c)) c++;

    const list = [...seen[v]].sort((a, b) => a - b);
    const note =
      `Đỉnh ${v} (bão hòa ${seen[v].size}, bậc ${nb[v].size}): ` +
      (list.length === 0
        ? `chưa có đỉnh kề nào được tô → chọn màu ${c}`
        : `kề màu {${list.join(',')}} → chọn màu ${c}`);

    colors[v] = c;
    for (const u of nb[v]) seen[u].add(c);
    steps.push({ vertex: v, color: c, note });
  }

  const k = new Set(colors).size - (colors.includes(-1) ? 1 : 0);
  return { algorithm: 'dsatur', colors, k, steps, ms: performance.now() - start };
};
