const EARTH_RADIUS_M = 6371000;

/** Khoảng cách Haversine (mét) giữa 2 điểm { lat, lng }. */
function haversineM(a, b) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_M * Math.atan2(Math.sqrt(h), Math.sqrt(1 - h));
}

/** Biến JSON của Overpass thành { nodes: [{ id, lat, lng }], adj: [[{ to, w }]] }, với nodes[i].id === i. */
export function buildGraph(osm) {
  const coordByOsmId = new Map();
  for (const el of osm.elements) {
    if (el.type === 'node') {
      coordByOsmId.set(el.id, { lat: el.lat, lng: el.lon });
    }
  }

  const idMap = new Map();
  const nodes = [];
  const adj = [];

  function getOrCreateNode(osmId) {
    if (!coordByOsmId.has(osmId)) return -1;
    if (idMap.has(osmId)) return idMap.get(osmId);

    const id = nodes.length;
    const { lat, lng } = coordByOsmId.get(osmId);
    idMap.set(osmId, id);
    nodes.push({ id, lat, lng });
    adj.push([]);
    return id;
  }

  for (const el of osm.elements) {
    if (el.type !== 'way' || !Array.isArray(el.nodes)) continue;
    for (let i = 0; i + 1 < el.nodes.length; i++) {
      const u = getOrCreateNode(el.nodes[i]);
      const v = getOrCreateNode(el.nodes[i + 1]);
      if (u === -1 || v === -1 || u === v) continue;

      const w = Math.round(haversineM(nodes[u], nodes[v]) * 10) / 10;
      adj[u].push({ to: v, w });
      adj[v].push({ to: u, w });
    }
  }

  return { nodes, adj };
}

/** Giữ thành phần liên thông lớn nhất (tìm bằng BFS), đánh số lại nút từ 0. */
export function largestComponent(g) {
  const n = g.nodes.length;
  if (n === 0) return { nodes: [], adj: [] };

  const visited = new Array(n).fill(false);
  let bestComp = [];

  for (let start = 0; start < n; start++) {
    if (visited[start]) continue;

    const comp = [];
    const queue = [start];
    visited[start] = true;
    let head = 0;

    while (head < queue.length) {
      const u = queue[head++];
      comp.push(u);
      for (const { to } of g.adj[u]) {
        if (!visited[to]) {
          visited[to] = true;
          queue.push(to);
        }
      }
    }

    if (comp.length > bestComp.length) {
      bestComp = comp;
    }
  }

  bestComp.sort((a, b) => a - b);

  const oldToNew = new Map();
  const nodes = bestComp.map((oldId, newId) => {
    oldToNew.set(oldId, newId);
    const { lat, lng } = g.nodes[oldId];
    return { id: newId, lat, lng };
  });

  const adj = bestComp.map((oldId) =>
    g.adj[oldId]
      .filter((e) => oldToNew.has(e.to))
      .map((e) => ({ to: oldToNew.get(e.to), w: e.w })),
  );

  return { nodes, adj };
}