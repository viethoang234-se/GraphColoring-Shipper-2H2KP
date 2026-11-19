// Hợp đồng giữa giao diện (TV4) và phần xử lý (TV1 pipeline, TV2 tô màu, TV3 lộ trình).
// Giao diện KHÔNG tự gọi thẳng module của người khác; TV1 truyền mọi thứ vào qua UiPipeline.
// Nhờ vậy TV4 làm giao diện song song được, chưa cần chờ các module kia xong.

import type { ColoringAlgorithm } from '../algorithms/coloring';
import type { Coloring, ConflictGraph, Order, Route } from '../core/types';

export interface UiAlgorithm {
  id: string; // 'greedy', 'welsh-powell', 'dsatur', 'backtracking'
  label: string; // tên hiện trên giao diện
  run: ColoringAlgorithm;
}

export interface UiDataset {
  id: string;
  label: string;
  orders: Order[];
}

/** Các lựa chọn trên thanh điều khiển. */
export interface UiSettings {
  datasetId: string;
  algorithmId: string;
  shippers: number;
  speedMs: number; // thời gian mỗi bước animation
  layout: 'geo' | 'circle'; // vẽ đồ thị theo vị trí thật hay xếp vòng tròn
}

export type TabId = 'conflict' | 'schedule' | 'map';

export interface UiPipeline {
  /** Việc T17 (TV1): dựng đồ thị xung đột từ danh sách đơn. */
  buildConflictGraph: (orders: Order[]) => ConflictGraph;
  /** Các thuật toán tô màu (TV2). */
  algorithms: UiAlgorithm[];
  /** Việc T18 (TV1 + TV3): từ kết quả tô màu ra lộ trình. Chưa có thì bỏ trống. */
  buildRoutes?: (orders: Order[], coloring: Coloring, shippers: number) => Route[];
}
