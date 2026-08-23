import styles from './ResultList.module.css';

export default function ResultList({ options, totalVotes }) {
  return (
    <div className={styles.results}>
      <p className={styles.total}>{totalVotes} voto(s)</p>

      {options.map((option) => (
        <div className={styles.row} key={option.id}>
          <div className={styles.info}>
            <span>{option.text}</span>
            <span>{option.percentage}% ({option.votes})</span>
          </div>
          <div className={styles.track}>
            <div className={styles.bar} style={{ width: `${option.percentage}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
