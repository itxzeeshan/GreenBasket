const baseUrl = import.meta.env.VITE_API_URL;
console.log("API URL", import.meta.env.VITE_API_URL);

if (!baseUrl) {
  throw new Error(
    "VITE_API_URL is missing. Add it to client/.env and restart the dev server.",
  );
}

export async function apiGet(path) {
  const response = await fetch(`${baseUrl}${path}`);

  if (!response.ok) {
    throw new Error(`Request failed with status ${response.status}`);
  }

  return response.json();
}

export function getHealth() {
  return apiGet("/health");
}
