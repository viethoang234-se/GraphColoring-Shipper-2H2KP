import type { Route } from '../core/types';

export interface ScheduleRow {
  trip: number; // số chuyến, đánh số từ 1
  shipper: string; // "Shipper 1", "Shipper 2"...
  shift: number; // ca, đánh số từ 1
  stops: string; // "A → B → C"
  km: string; // một chữ số thập phân, ví dụ "2.4"
  ok: boolean; // false nếu chuyến không kịp giờ
}

/** Sắp theo shipper rồi theo ca. Không làm đổi mảng routes gốc. */
export function scheduleRows(routes: Route[]): ScheduleRow[] {
  // [...routes] tạo bản sao: sort() sắp xếp ngay trên mảng, nếu không sao chép sẽ làm đảo thứ tự mảng của người gọi
  const sorted = [...routes].sort((a, b) => a.shipper - b.shipper || a.shift - b.shift);

  // Trong code mọi thứ đánh số từ 0, còn người đọc quen đếm từ 1 nên cộng thêm 1 khi hiển thị
  return sorted.map((r) => ({
    trip: r.color + 1, // Route.color là số thứ tự chuyến (xem T18)
    shipper: `Shipper ${r.shipper + 1}`,
    shift: r.shift + 1,
    stops: r.orderIds.join(' → '),
    km: (r.lengthM / 1000).toFixed(1), // mét → km, giữ 1 chữ số thập phân
    ok: r.feasible,
  }));
}
