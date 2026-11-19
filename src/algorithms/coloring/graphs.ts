// Các đồ thị mẫu dùng trong test. Đồ thị biểu diễn bằng danh sách kề: adj[v] = các đỉnh kề v.

/** Tạo đồ thị n đỉnh từ danh sách cạnh [u, v]. */
export function fromEdges(n: number, edges: [number, number][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

/** Đồ thị đầy đủ K_n: mọi cặp đỉnh đều kề nhau. χ = n. */
export function complete(n: number): number[][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j]);
  return fromEdges(n, edges);
}

/** Chu trình C_n: 0-1-2-...-(n-1)-0. χ = 2 nếu n chẵn, 3 nếu n lẻ. */
export function cycle(n: number): number[][] {
  return fromEdges(n, Array.from({ length: n }, (_, i) => [i, (i + 1) % n] as [number, number]));
}

/** Đồ thị vương miện: u_i = đỉnh 2i, v_i = đỉnh 2i+1, u_i kề v_j khi i ≠ j.
 *  Là đồ thị hai phía nên χ = 2, nhưng Greedy theo thứ tự 0,1,2,... dùng tới n màu. */
export function crown(n: number): number[][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) if (i !== j && i < j) {
    edges.push([2 * i, 2 * j + 1]);
    edges.push([2 * j, 2 * i + 1]);
  }
  return fromEdges(2 * n, edges);
}

/** Đồ thị Petersen: 10 đỉnh, 15 cạnh, χ = 3. */
export function petersen(): number[][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < 5; i++) {
    edges.push([i, (i + 1) % 5]); // vòng ngoài
    edges.push([i, i + 5]); // nan hoa
    edges.push([5 + i, 5 + ((i + 2) % 5)]); // ngôi sao bên trong
  }
  return fromEdges(10, edges);
}
