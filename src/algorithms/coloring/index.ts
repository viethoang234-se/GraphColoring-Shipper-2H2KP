import type { Coloring } from '../../core/types';

/** Hợp đồng chung: mọi thuật toán tô màu đều có dạng này. */
export type ColoringAlgorithm = (adj: number[][]) => Coloring;
