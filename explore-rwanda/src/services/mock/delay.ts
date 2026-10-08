/** Simulates network latency so loading states are exercised. Remove when a real API is connected. */
export const delay = <T>(value: T, ms = 300): Promise<T> =>
  new Promise((resolve) => setTimeout(() => resolve(value), ms));

export const reference = (prefix: string): string => `${prefix}-${Math.floor(10000 + Math.random() * 89999)}`;
