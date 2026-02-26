const AUTH_TOKEN_KEY = "hs_auth_token";

export const getAuthToken = () => localStorage.getItem(AUTH_TOKEN_KEY);

export const setAuthToken = (token) => {
  if (!token) return;
  localStorage.setItem(AUTH_TOKEN_KEY, token);
};

export const clearAuthToken = () => {
  localStorage.removeItem(AUTH_TOKEN_KEY);
};

export const hasAuthToken = () => Boolean(getAuthToken());
