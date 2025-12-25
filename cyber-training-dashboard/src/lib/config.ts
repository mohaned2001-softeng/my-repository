const rawBaseUrl = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? "http://localhost:8000";
export const API_BASE_URL = rawBaseUrl.replace(/\/$/, "");

export const buildAssetUrl = (path?: string | null) => {
  if (!path) {
    return null;
  }
  if (path.startsWith("http") || path.startsWith("blob:")) {
    return path;
  }
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${API_BASE_URL}${normalized}`;
};
