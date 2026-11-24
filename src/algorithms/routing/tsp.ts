/** Độ dài lộ trình: từ kho (điểm 0) qua lần lượt các điểm trong tour, không quay về kho. */
export function routeLength(dist: number[][], tour: number[]): number {
  if (tour.length === 0) return 0;

  let total = dist[0][tour[0]];
  for (let i = 0; i + 1 < tour.length; i++) {
    total += dist[tour[i]][tour[i + 1]];
  }
  return total;
}

/** Láng giềng gần nhất từ kho. Trả về thứ tự ghé các điểm 1..n-1. */
export function nearestNeighbor(dist: number[][]): number[] {
  const n = dist.length;
  if (n <= 1) return [];

  const visited = new Array<boolean>(n).fill(false);
  visited[0] = true;

  const tour: number[] = [];
  let cur = 0;

  for (let step = 1; step < n; step++) {
    let next = -1;
    let bestDist = Infinity;

    for (let v = 1; v < n; v++) {
      if (!visited[v] && dist[cur][v] < bestDist) {
        bestDist = dist[cur][v];
        next = v;
      }
    }

    // Phòng trường hợp các điểm còn lại đều cách Infinity: chọn điểm chưa ghé nhỏ nhất
    if (next === -1) {
      next = visited.findIndex((done, idx) => idx > 0 && !done);
    }

    visited[next] = true;
    tour.push(next);
    cur = next;
  }

  return tour;
}

/** Cải thiện tour bằng 2-opt cho đến khi không cải thiện được nữa. Không sửa mảng tour gốc. */
export function twoOpt(dist: number[][], tour: number[]): number[] {
  let best = [...tour];
  if (best.length < 2) return best;

  let bestLen = routeLength(dist, best);
  let improved = true;

  while (improved) {
    improved = false;
    for (let i = 0; i < best.length - 1; i++) {
      for (let j = i + 1; j < best.length; j++) {
        const candidate = [
          ...best.slice(0, i),
          ...best.slice(i, j + 1).reverse(),
          ...best.slice(j + 1),
        ];
        const candLen = routeLength(dist, candidate);
        if (candLen < bestLen - 1e-9) {
          best = candidate;
          bestLen = candLen;
          improved = true;
        }
      }
    }
  }

  return best;
}