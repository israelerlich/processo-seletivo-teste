import styles from './Countdown.module.css';

export default function Countdown({ seconds }) {
  if (seconds === null) {
    return null;
  }

  if (seconds <= 0) {
    return <span className={styles.finished}>Enquete encerrada</span>;
  }

  const minutes = Math.floor(seconds / 60);
  const rest = seconds % 60;

  return (
    <span className={styles.running}>
      Encerra em {minutes}:{String(rest).padStart(2, '0')}
    </span>
  );
}
