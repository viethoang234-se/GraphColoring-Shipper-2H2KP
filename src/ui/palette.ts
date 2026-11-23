/** 12 màu dễ phân biệt cho các chuyến và màu tô đồ thị. Số lớn hơn 11 thì quay vòng; số âm (chưa tô) là màu xám. */
export const PALETTE = ['#e6194b', '#3cb44b', '#4363d8', '#f58231', '#911eb4', '#42d4f4', '#f032e6', '#bfef45', '#469990', '#9a6324', '#800000', '#000075'];

export function colorOf(i: number): string {
  return i < 0 ? '#9e9e9e' : PALETTE[i % PALETTE.length];
}
