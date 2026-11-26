import type { ConflictGraph } from '../core/types';
import { circleLayout } from './layout';
import { colorOf } from './palette';

interface Props {
  graph: ConflictGraph;
  labels: string[]; // id của đơn, theo thứ tự đỉnh
  colors: number[]; // màu từng đỉnh, -1 = chưa tô
  highlight?: number; // đỉnh đang được tô (animation T26 dùng)
}

/** Tên tiếng Việt của lý do xung đột, hiện khi di chuột lên cạnh. */
const REASON_TEXT: Record<string, string> = {
  'thoi-gian': 'thời gian',
  'khoang-cach': 'khoảng cách',
  'loai-hang': 'loại hàng',
};

export function ConflictGraphView({ graph, labels, colors, highlight }: Props) {
  const size = 480;
  const pts = circleLayout(graph.adj.length, size / 2, size / 2, size / 2 - 40);

  // Gom các cạnh, mỗi cạnh chỉ lấy một lần với i < j (vì adj[i] có j thì adj[j] cũng có i)
  const edges: [number, number][] = [];
  graph.adj.forEach((neighbors, i) => {
    for (const j of neighbors) if (i < j) edges.push([i, j]);
  });

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width="100%" style={{ maxWidth: size }}>
      {/* Vẽ cạnh trước: trong SVG cái vẽ sau nằm đè lên cái vẽ trước, nên đỉnh sẽ nằm trên cạnh */}
      {edges.map(([i, j]) => {
        const reasons = (graph.reasons[`${i}-${j}`] ?? []).map((r) => REASON_TEXT[r] ?? r).join(', ');
        return (
          <line
            key={`${i}-${j}`}
            x1={pts[i].x}
            y1={pts[i].y}
            x2={pts[j].x}
            y2={pts[j].y}
            stroke="#9e9e9e"
            strokeWidth={2}
          >
            <title>{`${labels[i]} – ${labels[j]}: ${reasons}`}</title>
          </line>
        );
      })}

      {/* Vẽ đỉnh: hình tròn tô màu theo colors[i], nhãn là id của đơn */}
      {pts.map((p, i) => (
        <g key={i}>
          <circle
            cx={p.x}
            cy={p.y}
            r={14}
            fill={colorOf(colors[i] ?? -1)}
            stroke={i === highlight ? '#000' : '#fff'}
            strokeWidth={i === highlight ? 4 : 2}
          />
          <text
            x={p.x}
            y={p.y}
            textAnchor="middle"
            dominantBaseline="central"
            fontSize={11}
            fontWeight={600}
            fill="#fff"
          >
            {labels[i]}
          </text>
        </g>
      ))}
    </svg>
  );
}
