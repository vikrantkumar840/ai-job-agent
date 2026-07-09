export const ACCESS_TOKEN = "access_token";
export const REFRESH_TOKEN = "refresh_token";

export function getAccessToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(ACCESS_TOKEN);
}

export function getRefreshToken() {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(REFRESH_TOKEN);
}

export function saveTokens(
  access: string,
  refresh: string
) {
  localStorage.setItem(ACCESS_TOKEN, access);
  localStorage.setItem(REFRESH_TOKEN, refresh);
}

export function clearTokens() {
  localStorage.removeItem(ACCESS_TOKEN);
  localStorage.removeItem(REFRESH_TOKEN);
}

export function isLoggedIn() {
  return !!getAccessToken();
}

export function authHeader() {
  const token = getAccessToken();

  return token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : {};
}
