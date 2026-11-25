export interface TripSchedule {
  arrivals: number[]; // giờ bắt đầu giao từng đơn (phút từ 0h)
  lateIndex: number; // vị trí đơn trễ đầu tiên, -1 nếu không trễ
}

/** legsMin[i]: số phút đi từ điểm trước tới đơn i (đơn 0 đi từ kho). */
export function scheduleTrip(
  legsMin: number[],
  windows: { start: number; end: number }[],
  serviceMin: number[],
  startMin: number,
): TripSchedule {
  const arrivals: number[] = [];
  let lateIndex = -1;
  let now = startMin;

  for (let i = 0; i < legsMin.length; i++) {
    const arrive = now + legsMin[i];

    // Chỉ ghi nhận vị trí đơn bị trễ ĐẦU TIÊN
    if (arrive > windows[i].end && lateIndex === -1) {
      lateIndex = i;
    }

    // Đến sớm hơn giờ mở khung thì chờ tới windows[i].start
    const startService = Math.max(arrive, windows[i].start);
    arrivals.push(startService);

    // Thời điểm rời đi sau khi giao xong đơn i
    now = startService + serviceMin[i];
  }

  return { arrivals, lateIndex };
}

/** Tách tour tại lateIndex: kept = các đơn trước đó, moved = từ đó trở đi. lateIndex = -1 thì giữ nguyên. */
export function splitTrip(tour: number[], lateIndex: number): { kept: number[]; moved: number[] } {
  if (lateIndex < 0 || lateIndex >= tour.length) {
    return { kept: [...tour], moved: [] };
  }
  return {
    kept: tour.slice(0, lateIndex),
    moved: tour.slice(lateIndex),
  };
}