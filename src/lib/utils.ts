export function generateId(): string {
  return crypto.randomUUID();
}

export function formatDate(date: Date): string {
  return date.toISOString();
}

export function getCookie(name: string, cookieHeader: string | null): string | null {
  if (!cookieHeader) return null;
  const match = cookieHeader.match(new RegExp(`(?:^|; )${name}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}
