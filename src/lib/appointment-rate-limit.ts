const WINDOW_MS = 15 * 60 * 1_000;
const MAX_REQUESTS_PER_WINDOW = 5;

const requestLog = new Map<string, number[]>();

export function checkAppointmentRateLimit(ipAddress: string) {
  const now = Date.now();
  const recentRequests = (requestLog.get(ipAddress) ?? []).filter(
    (timestamp) => now - timestamp < WINDOW_MS,
  );

  if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
    requestLog.set(ipAddress, recentRequests);
    return false;
  }

  recentRequests.push(now);
  requestLog.set(ipAddress, recentRequests);

  if (requestLog.size > 1_000) {
    for (const [ip, timestamps] of requestLog) {
      if (timestamps.every((timestamp) => now - timestamp >= WINDOW_MS)) {
        requestLog.delete(ip);
      }
    }
  }

  return true;
}
