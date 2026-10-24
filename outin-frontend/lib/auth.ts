const TOKEN_KEY = 'authToken';

export const getToken = () =>
typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;

export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export const authHeaders = (): HeadersInit => {
const token = getToken();
return token ? { Authorization: `Bearer ${token}` } : {};
};