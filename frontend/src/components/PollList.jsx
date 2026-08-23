import styles from './PollList.module.css';

export default function PollList({ polls, onSelect }) {
  if (polls.length === 0) {
    return <p className={styles.empty}>Nenhuma enquete criada ainda.</p>;
  }

  return (
    <section className={styles.list}>
      <h2 className={styles.title}>Enquetes</h2>

      {polls.map((poll) => (
        <button className={styles.item} key={poll.id} type="button" onClick={() => onSelect(poll.id)}>
          <span>{poll.question}</span>
          <span className={poll.closed ? styles.closed : styles.open}>
            {poll.closed ? 'encerrada' : 'aberta'}
          </span>
        </button>
      ))}
    </section>
  );
}
