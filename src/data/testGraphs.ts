// Đồ thị nhỏ biết trước sắc số χ(G) — dữ liệu kiểm thử (TV4 + TV5).
// TV2 dùng để test thuật toán tô màu: thuật toán đúng phải cho k >= chi,
// thuật toán quay lui (chính xác) phải cho đúng k = chi.
// adj ở dạng danh sách kề vô hướng, giống ConflictGraph.adj.

export interface TestGraph {
  name: string;
  adj: number[][];
  chi: number; // sắc số đã biết
}

/** Tạo danh sách kề từ danh sách cạnh. */
export function fromEdges(n: number, edges: [number, number][]): number[][] {
  const adj: number[][] = Array.from({ length: n }, () => []);
  for (const [u, v] of edges) {
    adj[u].push(v);
    adj[v].push(u);
  }
  return adj;
}

function cycle(n: number): number[][] {
  return fromEdges(
    n,
    Array.from({ length: n }, (_, i) => [i, (i + 1) % n] as [number, number]),
  );
}

function complete(n: number): number[][] {
  const edges: [number, number][] = [];
  for (let i = 0; i < n; i++) for (let j = i + 1; j < n; j++) edges.push([i, j]);
  return fromEdges(n, edges);
}

export const TEST_GRAPHS: TestGraph[] = [
  { name: 'Đồ thị rỗng 4 đỉnh', adj: fromEdges(4, []), chi: 1 },
  {
    name: 'Đường đi P4',
    adj: fromEdges(4, [
      [0, 1],
      [1, 2],
      [2, 3],
    ]),
    chi: 2,
  },
  { name: 'Chu trình chẵn C6', adj: cycle(6), chi: 2 },
  { name: 'Chu trình lẻ C5', adj: cycle(5), chi: 3 },
  { name: 'Tam giác K3', adj: complete(3), chi: 3 },
  { name: 'Đầy đủ K5', adj: complete(5), chi: 5 },
  {
    name: 'Hai phía đầy đủ K3,3',
    adj: fromEdges(6, [
      [0, 3],
      [0, 4],
      [0, 5],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 4],
      [2, 5],
    ]),
    chi: 2,
  },
  {
    name: 'Bánh xe W5 (tâm + C5)',
    adj: fromEdges(6, [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
      [5, 0],
      [5, 1],
      [5, 2],
      [5, 3],
      [5, 4],
    ]),
    chi: 4,
  },
  {
    name: 'Petersen',
    adj: fromEdges(10, [
      [0, 1],
      [1, 2],
      [2, 3],
      [3, 4],
      [4, 0],
      [0, 5],
      [1, 6],
      [2, 7],
      [3, 8],
      [4, 9],
      [5, 7],
      [7, 9],
      [9, 6],
      [6, 8],
      [8, 5],
    ]),
    chi: 3,
  },
  {
    // Greedy theo thứ tự 0,1,2,... trên đồ thị này dùng 3 màu dù chi = 2:
    // ví dụ kinh điển cho thấy thứ tự duyệt đỉnh ảnh hưởng kết quả.
    name: 'Bẫy Greedy (vương miện 6 đỉnh)',
    adj: fromEdges(6, [
      [0, 3],
      [0, 5],
      [1, 2],
      [1, 4],
      [2, 5],
      [3, 4],
    ]),
    chi: 2,
  },
];
