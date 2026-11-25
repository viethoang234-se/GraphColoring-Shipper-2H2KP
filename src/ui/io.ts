import type { Category, Order } from '../core/types';

/** Các loại hàng hợp lệ (giống kiểu Category trong types.ts). */
const CATEGORIES: Category[] = ['thuong', 'dong-lanh', 'cong-kenh'];

/** Các cột bắt buộc của file CSV, theo đúng thứ tự khi xuất ra. */
const CSV_COLUMNS = ['id', 'lat', 'lng', 'start', 'end', 'serviceMin', 'category'];

/** "09:15" → 555. Sai dạng (giờ > 23, phút > 59, không có dấu :) thì throw Error. */
export function hhmmToMin(s: string): number {
  // Dạng hợp lệ: 1–2 chữ số giờ, dấu ":", đúng 2 chữ số phút. Ví dụ "9:15", "09:15".
  const m = /^(\d{1,2}):(\d{2})$/.exec(s.trim());
  if (!m) throw new Error(`Giờ "${s}" sai dạng, phải ghi HH:MM (ví dụ 09:15)`);
  const h = Number(m[1]);
  const min = Number(m[2]);
  if (h > 23 || min > 59) throw new Error(`Giờ "${s}" không có thật (giờ 0–23, phút 0–59)`);
  return h * 60 + min;
}

/** 555 → "09:15" (luôn 2 chữ số cho giờ và phút). */
export function minToHhmm(min: number): string {
  const h = Math.floor(min / 60);
  const m = min % 60;
  return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
}

/** true nếu x là một số thật (không phải NaN, không phải Infinity). */
function isNum(x: unknown): x is number {
  return typeof x === 'number' && Number.isFinite(x);
}

/** Hình dạng "thô" của một đơn khi vừa đọc từ file: chưa biết trường nào đúng kiểu. */
interface RawOrder {
  id?: unknown;
  pos?: { lat?: unknown; lng?: unknown };
  nodeId?: unknown;
  window?: { start?: unknown; end?: unknown };
  serviceMin?: unknown;
  category?: unknown;
}

/**
 * Kiểm tra một đơn hàng đọc được (từ JSON hoặc CSV) và trả về Order sạch.
 * `where` dùng để ghi vào câu báo lỗi, ví dụ "Đơn thứ 2" hoặc "Dòng 3".
 */
function checkOrder(raw: unknown, where: string): Order {
  if (typeof raw !== 'object' || raw === null) throw new Error(`${where}: không phải một đơn hàng`);
  const o = raw as RawOrder;

  if (typeof o.id !== 'string' || o.id.trim() === '') throw new Error(`${where}: thiếu mã đơn (id)`);
  // Dấu phẩy, ngoặc kép, xuống dòng làm lệch cột khi xuất CSV nên không cho phép trong mã đơn
  if (/[,"\r\n]/.test(o.id))
    throw new Error(`${where}: mã đơn "${o.id}" không được chứa dấu phẩy, ngoặc kép hay xuống dòng`);
  const lat = o.pos?.lat;
  const lng = o.pos?.lng;
  if (!isNum(lat) || !isNum(lng)) throw new Error(`${where}: tọa độ lat/lng phải là số`);
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) {
    throw new Error(`${where}: tọa độ (${lat}, ${lng}) ngoài miền (lat −90..90, lng −180..180)`);
  }
  const start = o.window?.start;
  const end = o.window?.end;
  if (!isNum(start) || !isNum(end)) throw new Error(`${where}: giờ bắt đầu/kết thúc phải là số`);
  if (start >= end) throw new Error(`${where}: giờ bắt đầu phải sớm hơn giờ kết thúc`);
  if (!isNum(o.serviceMin) || o.serviceMin < 0) throw new Error(`${where}: serviceMin phải là số không âm`);
  const category = o.category as Category;
  if (!CATEGORIES.includes(category)) {
    throw new Error(`${where}: loại hàng "${String(o.category)}" không hợp lệ (chỉ nhận ${CATEGORIES.join(', ')})`);
  }

  const order: Order = { id: o.id, pos: { lat, lng }, window: { start, end }, serviceMin: o.serviceMin, category };
  if (isNum(o.nodeId)) order.nodeId = o.nodeId; // giữ lại nếu file JSON đã có sẵn
  return order;
}

/** Đọc mảng đơn từ chuỗi JSON. Kiểm tra từng đơn: có id, tọa độ là số, start < end, loại hàng hợp lệ. */
export function parseOrdersJson(text: string): Order[] {
  let data: unknown;
  try {
    data = JSON.parse(text);
  } catch (e) {
    throw new Error('File JSON sai cú pháp, không đọc được', { cause: e }); // giữ lỗi gốc để dễ dò
  }
  if (!Array.isArray(data)) throw new Error('File JSON phải là một mảng các đơn hàng [ ... ]');
  return data.map((item, i) => checkOrder(item, `Đơn thứ ${i + 1}`));
}

/** Đọc CSV có dòng tiêu đề id,lat,lng,start,end,serviceMin,category. Thiếu cột thì throw Error nêu tên cột. */
export function parseOrdersCsv(text: string): Order[] {
  const lines = text.split(/\r?\n/); // \r?\n: chạy được cả file tạo trên Windows
  const header = lines[0].split(',').map((h) => h.trim());

  // Tìm vị trí của từng cột bắt buộc trong dòng tiêu đề
  const missing = CSV_COLUMNS.filter((c) => !header.includes(c));
  if (missing.length > 0) throw new Error(`File CSV thiếu cột: ${missing.join(', ')}`);
  const col = (name: string) => header.indexOf(name);

  const orders: Order[] = [];
  for (let i = 1; i < lines.length; i++) {
    if (lines[i].trim() === '') continue; // bỏ dòng trống (thường ở cuối file)
    const where = `Dòng ${i + 1}`; // số dòng giống khi mở file bằng Notepad
    const cells = lines[i].split(',').map((c) => c.trim());
    const get = (name: string) => cells[col(name)] ?? '';
    const num = (name: string) => (get(name) === '' ? NaN : Number(get(name))); // ô trống không được tính là 0

    let start: number;
    let end: number;
    try {
      start = hhmmToMin(get('start'));
      end = hhmmToMin(get('end'));
    } catch (e) {
      throw new Error(`${where}: ${(e as Error).message}`, { cause: e }); // giữ lỗi gốc để dễ dò
    }

    orders.push(
      checkOrder(
        {
          id: get('id'),
          pos: { lat: num('lat'), lng: num('lng') },
          window: { start, end },
          serviceMin: num('serviceMin'),
          category: get('category'),
        },
        where,
      ),
    );
  }
  return orders;
}

/**
 * Ghi danh sách đơn ra CSV cùng định dạng, đọc lại phải ra y nguyên.
 * Không ghi nodeId: trường này được tính lại khi ghép đơn vào bản đồ (T14).
 * Mã đơn không chứa dấu phẩy (checkOrder đã chặn khi nạp) nên ghép bằng dấu phẩy là an toàn.
 */
export function ordersToCsv(orders: Order[]): string {
  const rows = orders.map((o) =>
    [o.id, o.pos.lat, o.pos.lng, minToHhmm(o.window.start), minToHhmm(o.window.end), o.serviceMin, o.category].join(
      ',',
    ),
  );
  return [CSV_COLUMNS.join(','), ...rows].join('\n') + '\n';
}
