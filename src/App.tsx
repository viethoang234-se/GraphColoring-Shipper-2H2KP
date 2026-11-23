import { useState } from 'react';
import './App.css';

type Tab = 'map' | 'conflict' | 'schedule' | 'compare';

const TABS: { id: Tab; label: string }[] = [
  { id: 'map', label: 'Bản đồ' },
  { id: 'conflict', label: 'Đồ thị xung đột' },
  { id: 'schedule', label: 'Lịch trình' },
  { id: 'compare', label: 'So sánh thuật toán' },
];

export default function App() {
  const [tab, setTab] = useState<Tab>('map');

  return (
    <div className="app">
      <aside className="panel">
        <h1>Lịch giao hàng bằng tô màu đồ thị</h1>
        {/* T24: nạp file đơn hàng */}
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
