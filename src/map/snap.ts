import type { LatLng, Order, RoadGraph } from '../core/types';
import { haversineM } from './geo';

/** Số thứ tự nút đường gần pos nhất. */
export function nearestNode(g: RoadGraph, pos: LatLng): number {
  let bestId = 0;
  let bestDist = Infinity;

  for (const node of g.nodes) {
    const d = haversineM(pos, node);
    // Dùng < (không dùng <=) để nếu bằng khoảng cách thì giữ nút có id nhỏ hơn
    if (d < bestDist) {
      bestDist = d;
      bestId = node.id;
    }
  }

  return bestId;
}

/** Trả về BẢN SAO của các đơn, mỗi đơn có thêm nodeId. Không sửa mảng gốc. */
export function snapOrders(orders: Order[], g: RoadGraph): Order[] {
  return orders.map((o) => ({
    ...o,
    nodeId: nearestNode(g, o.pos),
  }));
}