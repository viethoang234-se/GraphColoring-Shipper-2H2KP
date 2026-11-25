import { useState, type ChangeEvent } from 'react';
import './App.css';
import type { Order } from './core/types';
import { ordersToCsv, parseOrdersCsv, parseOrdersJson } from './ui/io';

type Tab = 'map' | 'conflict' | 'schedule' | 'compare';

const TABS: { id: Tab; label: string }[] = [
  { id: 'map', label: 'Bản đồ' },
  { id: 'conflict', label: 'Đồ thị xung đột' },
  { id: 'schedule', label: 'Lịch trình' },
  { id: 'compare', label: 'So sánh thuật toán' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('map');
  const [orders, setOrders] = useState<Order[]>([]); // danh sách đơn đã nạp
  const [loadError, setLoadError] = useState<string | null>(null); // câu báo lỗi khi nạp file

  // Chọn file: đọc chữ trong file, theo đuôi file mà gọi hàm đọc CSV hoặc JSON
  async function handleFile(e: ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const text = await file.text();
      const parsed = file.name.toLowerCase().endsWith('.json') ? parseOrdersJson(text) : parseOrdersCsv(text);
      setOrders(parsed);
      setLoadError(null);
    } catch (err) {
      // File sai: giữ nguyên danh sách đơn cũ, chỉ hiện câu báo lỗi
      setLoadError(err instanceof Error ? err.message : String(err));
    }
  }

  // Xuất CSV: tạo file tạm trong trình duyệt rồi tải về
  function handleExport() {
    const blob = new Blob([ordersToCsv(orders)], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'don-hang.csv';
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="app">
      <aside className="panel">
        <h1>Lịch giao hàng bằng tô màu đồ thị</h1>

        {/* T24: nạp file đơn hàng */}
        <label>
          Nạp file đơn hàng (.csv hoặc .json)
          <br />
          <input type="file" accept=".csv,.json" onChange={handleFile} />
        </label>
        {loadError && <p style={{ color: '#d32f2f' }}>{loadError}</p>}
        <p>Đã nạp {orders.length} đơn</p>
        <button onClick={handleExport} disabled={orders.length === 0}>
          Xuất CSV
        </button>

        {/* Việc 6: chọn thuật toán, nút Chạy, tóm tắt kết quả */}
      </aside>
      <main className="content">
        <nav className="tabs">
          {TABS.map((t) => (
            <button key={t.id} className={tab === t.id ? 'active' : ''} onClick={() => setTab(t.id)}>
              {t.label}
            </button>
          ))}
        </nav>
        {tab === 'map' && <p>Bản đồ (TV3 làm ở T21)</p>}
        {tab === 'conflict' && <p>Đồ thị xung đột (T22)</p>}
        {tab === 'schedule' && <p>Lịch trình (T23)</p>}
        {tab === 'compare' && <p>So sánh thuật toán (T27)</p>}
      </main>
    </div>
  );
}
