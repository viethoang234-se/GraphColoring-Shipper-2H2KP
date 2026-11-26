export interface Point {
  x: number;
  y: number;
}

/** n điểm chia đều trên vòng tròn tâm (cx, cy) bán kính r; điểm 0 ở trên cùng, đi theo chiều kim đồng hồ. */
export function circleLayout(n: number, cx: number, cy: number, r: number): Point[] {
  const points: Point[] = [];
  for (let i = 0; i < n; i++) {
    // Góc của đỉnh i: bắt đầu từ -π/2 (trên cùng), mỗi đỉnh cách nhau 2π/n.
    // Trong SVG trục y hướng xuống, nên góc tăng dần là đi theo chiều kim đồng hồ.
    const theta = -Math.PI / 2 + (2 * Math.PI * i) / n;
    points.push({ x: cx + r * Math.cos(theta), y: cy + r * Math.sin(theta) });
  }
  return points;
}
