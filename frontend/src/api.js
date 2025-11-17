const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

function getToken() {
  return localStorage.getItem('token');
}

async function request(path, opts = {}) {
  const headers = opts.headers ? { ...opts.headers } : {};
  // ensure we always send JSON when there's a body
  if (opts.body && typeof opts.body !== 'string') {
    opts.body = JSON.stringify(opts.body);
  }
  // Only set content-type if there is a body
  if (opts.body) headers['Content-Type'] = 'application/json';

  const token = getToken();
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const url = `${API_URL}${path}`;
  let res;
  try {
    res = await fetch(url, { ...opts, headers });
  } catch (networkErr) {
    console.error('Network error:', networkErr);
    throw { status: 0, data: { error: 'Network error. Is backend running?' } };
  }

  const text = await res.text();
  let data = {};
  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    // server returned non-JSON (rare) — keep raw text
    data = { raw: text };
  }

  if (!res.ok) {
    console.error('API error', res.status, data);
    throw { status: res.status, data };
  }
  return data;
}

export const auth = {
  signup: (username, password) => request('/auth/signup', { method: 'POST', body: { username, password } }),
  login: (username, password) => request('/auth/login', { method: 'POST', body: { username, password } })
};

export const tasks = {
  list: () => request('/tasks'),
  create: (task) => request('/tasks', { method: 'POST', body: task }),
  update: (id, updates) => request(`/tasks/${id}`, { method: 'PUT', body: updates }),
  delete: (id) => request(`/tasks/${id}`, { method: 'DELETE' })
};

export function saveToken(token) { localStorage.setItem('token', token); }
export function clearToken() { localStorage.removeItem('token'); }
export function getCurrentToken() { return getToken(); }
