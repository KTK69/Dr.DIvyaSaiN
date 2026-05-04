const DEFAULT_USERNAME = "Divya";
const DEFAULT_PASSWORD = "#DivyaSai123";
const DEFAULT_SESSION_TOKEN = "dev-admin-session";
const DEFAULT_SESSION_MAX_AGE = 30 * 60;

export const ADMIN_SESSION_COOKIE = "emmi-admin-session";

export function getAdminCredentials() {
  return {
    username: process.env.ADMIN_USERNAME ?? DEFAULT_USERNAME,
    password: process.env.ADMIN_PASSWORD ?? DEFAULT_PASSWORD,
  };
}

export function getSessionToken() {
  return process.env.ADMIN_SESSION_TOKEN ?? DEFAULT_SESSION_TOKEN;
}

export function getSessionMaxAge() {
  const raw = process.env.ADMIN_SESSION_MAX_AGE;
  if (!raw) {
    return DEFAULT_SESSION_MAX_AGE;
  }

  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return DEFAULT_SESSION_MAX_AGE;
  }

  return Math.floor(parsed);
}

export function isValidCredentials(username: string, password: string) {
  const credentials = getAdminCredentials();
  return username === credentials.username && password === credentials.password;
}

export function isValidSessionToken(token?: string | null) {
  return Boolean(token && token === getSessionToken());
}
