import React, { useEffect, useState } from 'react';

export default function AnimatedCounter({
  value,
  to,
  from = 0,
  duration = 1000,
  decimals = 0,
  suffix = '',
  prefix = ''
}) {
  const targetRaw = to !== undefined ? to : value;
  const numericTarget = typeof targetRaw === 'number'
    ? targetRaw
    : parseFloat(String(targetRaw || '0').replace(/,/g, '')) || 0;

  const durationMs = duration < 50 ? duration * 1000 : duration;

  const [current, setCurrent] = useState(typeof from === 'number' ? from : 0);

  useEffect(() => {
    let startTimestamp = null;
    let animationFrameId = null;
    const startVal = typeof from === 'number' ? from : 0;

    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const elapsed = timestamp - startTimestamp;
      const progress = Math.min(elapsed / (durationMs || 1000), 1);
      
      const nextVal = startVal + (numericTarget - startVal) * progress;
      setCurrent(nextVal);

      if (progress < 1) {
        animationFrameId = window.requestAnimationFrame(step);
      }
    };

    animationFrameId = window.requestAnimationFrame(step);
    return () => {
      if (animationFrameId) window.cancelAnimationFrame(animationFrameId);
    };
  }, [numericTarget, durationMs, from]);

  const formattedValue = decimals > 0
    ? current.toFixed(decimals)
    : Math.round(current).toLocaleString();

  return (
    <span className="font-mono tabular-nums">
      {prefix}
      {formattedValue}
      {suffix}
    </span>
  );
}
