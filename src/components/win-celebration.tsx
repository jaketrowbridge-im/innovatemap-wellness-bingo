"use client";

import { useEffect, useRef } from "react";
import confetti from "canvas-confetti";

export function WinCelebration({ show }: { show: boolean }) {
  const hasRun = useRef(false);

  useEffect(() => {
    if (show && !hasRun.current) {
      hasRun.current = true;

      const duration = 3000;
      const end = Date.now() + duration;

      const frame = () => {
        confetti({
          particleCount: 3,
          angle: 60,
          spread: 55,
          origin: { x: 0, y: 0.7 },
          colors: ["#10b981", "#8b5cf6", "#0ea5e9", "#f59e0b", "#f43f5e"],
        });
        confetti({
          particleCount: 3,
          angle: 120,
          spread: 55,
          origin: { x: 1, y: 0.7 },
          colors: ["#10b981", "#8b5cf6", "#0ea5e9", "#f59e0b", "#f43f5e"],
        });

        if (Date.now() < end) {
          requestAnimationFrame(frame);
        }
      };

      frame();
    }
  }, [show]);

  if (!show) return null;

  return (
    <div className="text-center py-4 px-6 bg-yellow-50 border border-yellow-200 rounded-xl mb-4">
      <h2 className="text-2xl font-bold text-yellow-700">BINGO!</h2>
      <p className="text-yellow-600 text-sm mt-1">Congratulations! You got a bingo!</p>
    </div>
  );
}
