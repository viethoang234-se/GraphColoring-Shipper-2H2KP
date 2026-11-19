# src/ui · TV4

Giao diện: thanh điều khiển, 3 tab, animation tô màu.

## Các file

| File | Nội dung |
|---|---|
| `ShipperApp.tsx` | Khung chính: tiêu đề, thanh điều khiển, 3 tab |
| `ControlBar.tsx` | Chọn bộ dữ liệu, thuật toán, số shipper, tốc độ; nút **Chạy tô màu** |
| `ConflictTab.tsx` | Tab 1: vẽ đồ thị xung đột (SVG), animation tô từng bước, chi tiết đơn, nhật ký bước |
| `AlgorithmCompare.tsx` | Bảng so sánh mọi thuật toán (số màu k, thời gian, hợp lệ) |
| `ScheduleTab.tsx` | Tab 2: thống kê, biểu đồ khung giờ theo nhóm màu, bảng phân nhóm cho shipper |
| `MapTab.tsx` | Tab 3: sơ đồ vị trí đơn + kho (khung chờ cho bản đồ Leaflet của TV3) |
| `useColoringAnimation.ts` | Hook phát / dừng / tiến / lùi animation |
| `helpers.ts` | Hàm thuần: màu, định dạng giờ, `colorsAtStep`, `badEdges`, bố cục đồ thị... |
| `contracts.ts` | Hợp đồng giữa UI và phần xử lý (`UiPipeline`) |
| `devPipeline.ts` | ⚠️ Pipeline TẠM để UI chạy được khi chưa có module thật — xóa khi TV1 nối xong |
| `ui.css` | CSS, mọi class bắt đầu bằng `sa-` |

## Nối với module thật (việc của TV1)

```tsx
<ShipperApp
  pipeline={{
    buildConflictGraph,              // T17 – src/conflict
    algorithms: [                    // TV2 – src/algorithms/coloring
      { id: 'greedy', label: 'Greedy', run: greedy },
      { id: 'welsh-powell', label: 'Welsh–Powell', run: welshPowell },
      { id: 'dsatur', label: 'DSatur', run: dsatur },
      { id: 'backtracking', label: 'Quay lui (chính xác)', run: backtracking },
    ],
    buildRoutes,                     // T18 – không bắt buộc
  }}
  datasets={[...]}
  depot={DEPOT}
  mapSlot={<BanDoLeaflet ... />}     // TV3 – không bắt buộc
/>
```

## Giao diện cần gì từ các bạn khác

- **TV2:** mỗi thuật toán trả `Coloring` có `steps` đầy đủ (mỗi lần gán màu là 1 bước). `note` viết tiếng Việt, ngắn, giải thích vì sao chọn màu đó — giao diện hiện nguyên văn. Thuật toán quay lui muốn hiện bước bỏ màu thì ghi `color: -1`.
- **TV1:** `reasons` dùng khóa `"i-j"` với i < j (như trong `types.ts`).
- **TV3 / TV1:** `Route.shipper` và `Route.shift` đếm từ 0 (giao diện tự cộng 1 khi hiển thị).
