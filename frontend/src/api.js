// Small wrapper around fetch(): adds the JSON header + Bearer token and throws
// an Error with the backend's message when the response is not OK.
const BASE = '/api/v1';

export async function api(path, { method = 'GET', body, token } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    /* response had no JSON body */
  }

  if (!res.ok) {
    const detail = data?.errors?.map((e) => e.message).join(', ');
    throw new Error(detail || data?.message || `Request failed (${res.status})`);
  }
  return data;
}
