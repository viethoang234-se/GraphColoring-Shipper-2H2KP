// Tải đường phố trong một khung tọa độ từ OpenStreetMap (qua Overpass API) và lưu thành src/data/graph.json.
// Chạy ở thư mục gốc repo:  node scripts/osm/fetch-osm.mjs
import { writeFileSync, mkdirSync } from 'node:fs';
import { buildGraph, largestComponent } from './buildGraph.mjs';

// Khung tọa độ: nam, tây, bắc, đông. Mặc định: khu trung tâm Quận 1 cũ, TP.HCM.
const BBOX = [10.762, 106.688, 10.795, 106.712];
const ROADS = 'primary|secondary|tertiary|residential|unclassified|living_street';
const query = `[out:json][timeout:90];way["highway"~"^(${ROADS})$"](${BBOX.join(',')});(._;>;);out body;`;

console.log('Đang tải dữ liệu từ Overpass API...');
const res = await fetch('https://overpass-api.de/api/interpreter', {
  method: 'POST',
  headers: { 'User-Agent': 'GraphColoring-Shipper (do an sinh vien)' },
  body: new URLSearchParams({ data: query }),
});
if (!res.ok) {
  console.error('Lỗi tải dữ liệu:', res.status, await res.text());
  process.exit(1);
}
const osm = await res.json();
const full = buildGraph(osm);
const g = largestComponent(full);
mkdirSync('src/data', { recursive: true });
writeFileSync('src/data/graph.json', JSON.stringify(g));
const edges = g.adj.reduce((s, a) => s + a.length, 0) / 2;
console.log(`Xong: ${full.nodes.length} nút ban đầu, giữ ${g.nodes.length} nút và ${edges} cạnh của thành phần liên thông lớn nhất.`);