const VOTER_KEY = 'mural-voter-id';

export function getVoterId() {
  let voterId = localStorage.getItem(VOTER_KEY);

  if (!voterId) {
    voterId = crypto.randomUUID();
    localStorage.setItem(VOTER_KEY, voterId);
  }

  return voterId;
}

export function getVotedOption(pollId) {
  const value = localStorage.getItem(`mural-vote-${pollId}`);

  return value ? Number(value) : null;
}

export function saveVotedOption(pollId, optionId) {
  localStorage.setItem(`mural-vote-${pollId}`, String(optionId));
}
