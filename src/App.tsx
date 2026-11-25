import { useState, type ChangeEvent } from 'react';
import './App.css';
import type { Order } from './core/types';
import { ordersToCsv, parseOrdersCsv, parseOrdersJson } from './ui/io';
// ?raw: Vite nạp nội dung file dưới dạng chuỗi, rồi đọc bằng parseOrdersJson như một file người dùng chọn
import demo8 from './data/demo-8.json?raw';
import demo30 from './data/demo-30.json?raw';

/** Bộ dữ liệu có sẵn, chọn nhanh bằng nút trong thanh bên. */
const DEMOS = [
  { label: 'Demo 8 đơn', text: demo8 },
  { label: 'Demo 30 đơn', text: demo30 },
];

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

  // Nạp một bộ dữ liệu có sẵn
  function loadDemo(text: string) {
    try {
      setOrders(parseOrdersJson(text));
      setLoadError(null);
    } catch (err) {
      setLoadError(err instanceof Error ? err.message : String(err));
    }
  }

  // Tải về một file: tạo file tạm trong trình duyệt rồi bấm link tải
  function download(content: string, fileName: string, type: string) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
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
        <div className="demo-buttons">
          {DEMOS.map((d) => (
            <button key={d.label} onClick={() => loadDemo(d.text)}>
              {d.label}
            </button>
          ))}
        </div>
        {loadError && <p className="error">{loadError}</p>}
        <p>Đã nạp {orders.length} đơn</p>
        <div className="demo-buttons">
          <button
            onClick={() => download(ordersToCsv(orders), 'don-hang.csv', 'text/csv;charset=utf-8')}
            disabled={orders.length === 0}
          >
            Xuất CSV
          </button>
          <button
            onClick={() => download(JSON.stringify(orders, null, 2), 'don-hang.json', 'application/json')}
            disabled={orders.length === 0}
          >
            Xuất JSON
          </button>
        </div>

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
