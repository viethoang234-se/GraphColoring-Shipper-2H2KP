import type { ConflictGraph, ConflictReason, Order } from '../core/types';
import type { PipelineOptions } from '../core/config';
import { travelMin } from '../core/config';

/** true nếu giao xong a rồi đi sang b vẫn kịp khung giờ của b. distM: quãng đường a → b (mét). */
export function canFollow(a: Order, b: Order, distM: number, speedKmh: number): boolean {
  // Thời điểm sớm nhất xong đơn a: bắt đầu ngay đầu khung giờ của a, cộng thời gian giao.
  const finishA = a.window.start + a.serviceMin;

  // Cộng thời gian di chuyển a → b (phút). distM = Infinity thì kết quả cũng là Infinity.
  const arriveB = finishA + travelMin(distM, speedKmh);

  // Kịp nếu đến b không muộn hơn cuối khung giờ của b.
  // Với Infinity phép so sánh cho false, tức là "không kịp" (đúng ý nghĩa).
  return arriveB <= b.window.end;
}

/** distM[i][j] = quãng đường ngắn nhất (mét) từ đơn i tới đơn j, Infinity nếu không có đường. */
export function buildConflictGraph(orders: Order[], distM: number[][], opts: PipelineOptions): ConflictGraph {
  const n = orders.length;

  // Danh sách kề rỗng cho mỗi đơn: adj[i] chứa chỉ số các đơn xung đột với đơn i.
  // Dùng Array.from để mỗi phần tử là một mảng riêng (new Array(n).fill([]) sẽ dùng chung một mảng).
  const adj: number[][] = Array.from({ length: n }, () => []);

  // Bảng lý do xung đột, khóa "i-j" với i < j.
  const reasons: Record<string, ConflictReason[]> = {};

  // Duyệt mọi cặp i < j đúng một lần (đồ thị vô hướng nên không cần xét lại (j, i)).
  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const a = orders[i];
      const b = orders[j];
      const found: ConflictReason[] = []; // gom lý do theo đúng thứ tự đề bài

      // Lý do 1: 'thoi-gian' — giao cái nào trước cũng không kịp cái còn lại.
      // Chiều j → i dùng distM[j][i], vì đường đi có thể không đối xứng (đường một chiều).
      if (
        !canFollow(a, b, distM[i][j], opts.speedKmh) &&
        !canFollow(b, a, distM[j][i], opts.speedKmh)
      ) {
        found.push('thoi-gian');
      }

      // Lý do 2: 'khoang-cach' — quá xa. Infinity > radiusM luôn đúng nên tự tính là xa.
      if (distM[i][j] > opts.radiusM) {
        found.push('khoang-cach');
      }

      // Lý do 3: 'loai-hang' — khác loại và không đơn nào là 'thuong'.
      if (a.category !== b.category && a.category !== 'thuong' && b.category !== 'thuong') {
        found.push('loai-hang');
      }

      // Có ít nhất một lý do thì nối cạnh hai chiều và ghi lại lý do.
      if (found.length > 0) {
        adj[i].push(j);
        adj[j].push(i);
        reasons[`${i}-${j}`] = found;
      }
    }
  }

  return { adj, reasons };
}