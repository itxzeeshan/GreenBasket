const baseUrl = import.meta.env.VITE_API_URL;

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

export async function getHealth() {
  const response = await fetch(`${baseUrl}/health`);

  // 503 = API up but database down. The body still has useful fields.
  if (response.ok || response.status === 503) {
    try {
      return await response.json();
    } catch {
      throw new Error(`Invalid response (status ${response.status})`);
    }
  }

  throw new Error(`Request failed with status ${response.status}`);
}
