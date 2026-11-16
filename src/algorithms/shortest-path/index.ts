import type { RoadGraph } from '../../core/types';

/** dist[v]: số mét từ nguồn đến v; prev[v]: đỉnh đứng trước v trên đường ngắn nhất (-1 nếu không có). */
export type ShortestPathResult = { dist: number[]; prev: number[] };
export type ShortestPathFn = (g: RoadGraph, source: number) => ShortestPathResult;
