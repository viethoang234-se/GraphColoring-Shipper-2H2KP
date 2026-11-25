import { describe, it, expect } from 'vitest';
import { buildGraph, largestComponent } from './buildGraph.mjs';

// Dữ liệu giả lập đúng dạng Overpass trả về: một đường 3 nút và một đoạn rời 2 nút.
const osm = {
  elements: [
    { type: 'node', id: 101, lat: 10.77, lon: 106.69 },
    { type: 'node', id: 102, lat: 10.771, lon: 106.69 },
    { type: 'node', id: 103, lat: 10.772, lon: 106.69 },
    { type: 'node', id: 201, lat: 10.8, lon: 106.7 },
    { type: 'node', id: 202, lat: 10.801, lon: 106.7 },
    { type: 'way', id: 1, nodes: [101, 102, 103], tags: { highway: 'residential' } },
    { type: 'way', id: 2, nodes: [201, 202], tags: { highway: 'residential' } },
  ],
};

describe('buildGraph', () => {
  const g = buildGraph(osm);

  it('đánh số lại node từ 0 và nodes[i].id === i', () => {
    expect(g.nodes).toHaveLength(5);
    g.nodes.forEach((n, i) => expect(n.id).toBe(i));
  });

  it('mỗi đoạn đường thành cạnh hai chiều, trọng số là mét', () => {
    expect(g.adj[0]).toHaveLength(1);
    expect(g.adj[1]).toHaveLength(2);
    // 0,001 độ vĩ ≈ 111 m
    expect(Math.abs(g.adj[0][0].w - 111.2)).toBeLessThan(0.5);
  });
});

describe('largestComponent', () => {
  it('chỉ giữ thành phần liên thông lớn nhất và đánh số lại', () => {
    const big = largestComponent(buildGraph(osm));
    expect(big.nodes).toHaveLength(3);
    expect(big.adj[2]).toEqual([{ to: 1, w: big.adj[1][1].w }]);
    big.nodes.forEach((n, i) => expect(n.id).toBe(i));
  });
});