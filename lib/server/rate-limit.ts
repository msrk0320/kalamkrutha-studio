import "server-only";

// Fixed-window in-memory limiter. On Vercel each serverless instance has its own memory,
// so this limits bursts per instance; pair it with Turnstile for real protection.
const hits = new Map<string, { count: number; resetAt: number }>();

export function rateLimit(key: string, { limit, windowMs }: { limit: number; windowMs: number }): { allowed: boolean } {
  const now = Date.now();
  const entry = hits.get(key);
  if (!entry || entry.resetAt <= now) {
    hits.set(key, { count: 1, resetAt: now + windowMs });
    if (hits.size > 5000) {
      for (const [k, v] of hits) if (v.resetAt <= now) hits.delete(k);
    }
    return { allowed: true };
  }
  entry.count += 1;
  return { allowed: entry.count <= limit };
}
