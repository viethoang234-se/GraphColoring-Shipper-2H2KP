/** true nếu colors là một cách tô màu hợp lệ của đồ thị adj. */
export function isValidColoring(adj: number[][], colors: number[]): boolean {
  // mảng màu phải dài đúng bằng số đỉnh (thiếu hoặc thừa thì false, không báo lỗi)
  if (colors.length !== adj.length) return false;
  // mỗi đỉnh có màu là số nguyên ≥ 0 (-1 nghĩa là chưa tô)
  for (const c of colors) {
    if (!Number.isInteger(c) || c < 0) return false;
  }
  // không cạnh nào nối hai đỉnh cùng màu
  for (let u = 0; u < adj.length; u++) {
    for (const v of adj[u]) {
      if (u !== v && colors[u] === colors[v]) return false;
    }
  }
  return true;
}

/** Kích thước một clique tìm bằng cách tham lam. Luôn ≤ ω(G) ≤ χ(G). Đồ thị rỗng trả về 0. */
export function cliqueLowerBound(adj: number[][]): number {
  const n = adj.length;
  if (n === 0) return 0;

  // tập kề (bỏ cạnh trùng và khuyên) để kiểm tra "kề nhau" trong O(1)
  const nb = adj.map((list, u) => new Set(list.filter((v) => v !== u)));

  let best = 1; // một đỉnh bất kỳ là clique cỡ 1
  for (let v = 0; v < n; v++) {
    const clique = [v];
    // xét đỉnh kề v theo bậc giảm dần, bằng bậc thì số nhỏ trước
    const candidates = [...nb[v]].sort((a, b) => nb[b].size - nb[a].size || a - b);
    for (const u of candidates) {
      // đỉnh u kề với mọi đỉnh đã có trong clique thì thêm vào
      if (clique.every((w) => nb[u].has(w))) clique.push(u);
    }
    if (clique.length > best) best = clique.length;
  }
  return best;
}
