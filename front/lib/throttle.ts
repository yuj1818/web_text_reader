export function throttle<T extends (...args: any[]) => void>(
  func: T,
  limit: number,
) {
  let lastFunc: number;
  let lastRan: number;
  return (...args: Parameters<T>) => {
    const now = Date.now();
    if (!lastRan) {
      func(...args);
      lastRan = now;
    } else {
      clearTimeout(lastFunc);
      lastFunc = window.setTimeout(
        () => {
          if (now - lastRan >= limit) {
            func(...args);
            lastRan = now;
          }
        },
        limit - (now - lastRan),
      );
    }
  };
}
