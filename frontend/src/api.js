const BASE_URL = import.meta.env.VITE_API_URL;
const TOKEN = import.meta.env.VITE_API_TOKEN;

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
      Authorization: `Bearer ${TOKEN}`,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.message || 'Não foi possível concluir a requisição.');
  }

  return body;
}

export function listPolls() {
  return request('/polls');
}

export function createPoll(payload) {
  return request('/polls', { method: 'POST', body: JSON.stringify(payload) });
}

export function getPoll(pollId) {
  return request(`/polls/${pollId}`);
}

export function sendVote(pollId, payload) {
  return request(`/polls/${pollId}/votes`, { method: 'POST', body: JSON.stringify(payload) });
}
