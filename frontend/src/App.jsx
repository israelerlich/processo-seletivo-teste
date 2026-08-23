import { useEffect, useState } from 'react';
import { listPolls } from './api';
import CreatePollForm from './components/CreatePollForm';
import PollList from './components/PollList';
import PollView from './components/PollView';
import styles from './App.module.css';

export default function App() {
  const [polls, setPolls] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const [error, setError] = useState('');

  function loadPolls() {
    listPolls()
      .then(setPolls)
      .catch((requestError) => setError(requestError.message));
  }

  useEffect(() => {
    loadPolls();
  }, []);

  function handleCreated(poll) {
    setSelectedId(poll.id);
  }

  function handleBack() {
    setSelectedId(null);
    loadPolls();
  }

  return (
    <main className={styles.page}>
      <header className={styles.header}>
        <h1 className={styles.title}>Mural de Enquetes ao Vivo</h1>
        <p className={styles.subtitle}>Crie uma enquete e acompanhe os votos em tempo real.</p>
      </header>

      {error && <p className={styles.error}>{error}</p>}

      {selectedId ? (
        <PollView pollId={selectedId} onBack={handleBack} />
      ) : (
        <div className={styles.home}>
          <CreatePollForm onCreated={handleCreated} />
          <PollList polls={polls} onSelect={setSelectedId} />
        </div>
      )}
    </main>
  );
}
