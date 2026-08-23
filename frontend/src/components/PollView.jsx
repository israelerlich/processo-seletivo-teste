import { useEffect, useState } from 'react';
import { getPoll, sendVote } from '../api';
import { getVotedOption, getVoterId, saveVotedOption } from '../voter';
import { usePollSocket } from '../hooks/usePollSocket';
import Countdown from './Countdown';
import OptionList from './OptionList';
import ResultList from './ResultList';
import styles from './PollView.module.css';

export default function PollView({ pollId, onBack }) {
  const [poll, setPoll] = useState(null);
  const [votedOptionId, setVotedOptionId] = useState(getVotedOption(pollId));
  const [remaining, setRemaining] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    getPoll(pollId)
      .then(setPoll)
      .catch((requestError) => setError(requestError.message));
  }, [pollId]);

  usePollSocket(pollId, setPoll);

  useEffect(() => {
    if (!poll || !poll.closes_at) {
      return undefined;
    }

    function update() {
      const seconds = Math.ceil((new Date(poll.closes_at).getTime() - Date.now()) / 1000);
      setRemaining(Math.max(0, seconds));
    }

    update();
    const timer = setInterval(update, 1000);

    return () => clearInterval(timer);
  }, [poll]);

  async function handleVote(optionId) {
    setError('');

    try {
      const updated = await sendVote(pollId, { option_id: optionId, voter_id: getVoterId() });
      setPoll(updated);
      setVotedOptionId(optionId);
      saveVotedOption(pollId, optionId);
    } catch (requestError) {
      setError(requestError.message);
    }
  }

  if (!poll) {
    return (
      <section className={styles.card}>
        <p>{error || 'Carregando enquete...'}</p>
        <button className={styles.back} type="button" onClick={onBack}>
          voltar
        </button>
      </section>
    );
  }

  const closed = poll.closed || remaining === 0;

  return (
    <section className={styles.card}>
      <div className={styles.top}>
        <button className={styles.back} type="button" onClick={onBack}>
          voltar
        </button>
        <Countdown seconds={remaining} />
      </div>

      <h2 className={styles.question}>{poll.question}</h2>

      <OptionList
        options={poll.options}
        votedOptionId={votedOptionId}
        disabled={closed}
        onVote={handleVote}
      />

      {error && <p className={styles.error}>{error}</p>}

      <ResultList options={poll.options} totalVotes={poll.total_votes} />
    </section>
  );
}
