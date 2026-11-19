// Hook điều khiển animation tô màu: phát / tạm dừng / lùi / tiến từng bước.
// `step` = số bước đã chạy (0 .. totalSteps). Màu của các đỉnh tính bằng colorsAtStep().

import { useEffect, useState } from 'react';

export function useColoringAnimation(totalSteps: number, speedMs: number, autoPlay: boolean) {
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(autoPlay);

  const done = step >= totalSteps;
  const running = playing && !done; // tự dừng khi chạy hết bước

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(() => {
      setStep((s) => Math.min(s + 1, totalSteps));
    }, speedMs);
    return () => window.clearInterval(id);
  }, [running, speedMs, totalSteps]);

  return {
    step,
    playing: running,
    done,
    play: () => {
      if (done) setStep(0); // đã hết thì phát lại từ đầu
      setPlaying(true);
    },
    pause: () => setPlaying(false),
    next: () => {
      setPlaying(false);
      setStep((s) => Math.min(s + 1, totalSteps));
    },
    prev: () => {
      setPlaying(false);
      setStep((s) => Math.max(s - 1, 0));
    },
    toStart: () => {
      setPlaying(false);
      setStep(0);
    },
    toEnd: () => {
      setPlaying(false);
      setStep(totalSteps);
    },
    goTo: (s: number) => {
      setPlaying(false);
      setStep(Math.min(Math.max(s, 0), totalSteps));
    },
  };
}
