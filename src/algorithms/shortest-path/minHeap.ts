/** Hàng đợi ưu tiên: luôn lấy ra phần tử có key nhỏ nhất. Cài bằng đống nhị phân (binary heap) trong mảng. */
export class MinHeap<T> {
  private data: { item: T; key: number }[] = [];

  get size(): number {
    return this.data.length;
  }

  push(item: T, key: number): void {
    this.data.push({ item, key });
    let i = this.data.length - 1;

    // Nổi lên (sift up) khi nhỏ hơn nút cha
    while (i > 0) {
      const parent = Math.floor((i - 1) / 2);
      if (this.data[i].key >= this.data[parent].key) break;
      [this.data[i], this.data[parent]] = [this.data[parent], this.data[i]];
      i = parent;
    }
  }

  pop(): { item: T; key: number } | undefined {
    if (this.data.length === 0) return undefined;

    const top = this.data[0];
    const last = this.data.pop()!;

    if (this.data.length > 0) {
      this.data[0] = last;
      let i = 0;
      const n = this.data.length;

      // Chìm xuống (sift down) khi lớn hơn con nhỏ nhất
      while (true) {
        const left = 2 * i + 1;
        const right = 2 * i + 2;
        let smallest = i;

        if (left < n && this.data[left].key < this.data[smallest].key) {
          smallest = left;
        }
        if (right < n && this.data[right].key < this.data[smallest].key) {
          smallest = right;
        }
        if (smallest === i) break;

        [this.data[i], this.data[smallest]] = [this.data[smallest], this.data[i]];
        i = smallest;
      }
    }

    return top;
  }
}