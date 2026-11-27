import type { Coloring } from '../../core/types';
import { dsatur } from './dsatur';
import { greedy } from './greedy';

/** Hợp đồng chung: mọi thuật toán tô màu đều có dạng này. */
export type ColoringAlgorithm = (adj: number[][]) => Coloring;

/** Danh bạ thuật toán. Mỗi thuật toán mới xong thì thêm một dòng vào đây. */
export const ALGORITHMS: Record<string, ColoringAlgorithm> = {
  greedy,
  dsatur,
};
