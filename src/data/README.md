# src/data · TV4 + TV5

Bộ dữ liệu demo và dữ liệu kiểm thử (JSON/CSV).

## Bộ dữ liệu demo (T24)

Định dạng: mảng `Order` đúng kiểu trong `src/core/types.ts`, giờ tính bằng phút từ 0h (480 = 8:00).
Tọa độ nằm trong khung bản đồ của TV3 (khu trung tâm Quận 1 cũ).

| File | Số đơn | Dùng để |
|---|---|---|
| `demo-8.json` | 8 | Giải thích bằng tay. D01–D02 xung đột đủ 3 lý do (thời gian, khoảng cách, loại hàng); D03–D04 chỉ thời gian; D05–D06 chỉ loại hàng |
| `demo-30.json` | 30 | Chạy thử và so sánh thuật toán: khoảng 43 cạnh xung đột, có đủ 3 loại lý do |

Số cạnh ở trên đã thử bằng `buildConflictGraph` (T17) với quãng đường thật trên `graph.json` (T13).

