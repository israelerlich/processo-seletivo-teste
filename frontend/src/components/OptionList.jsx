import styles from './OptionList.module.css';

export default function OptionList({ options, votedOptionId, disabled, onVote }) {
  return (
    <div className={styles.list}>
      {options.map((option) => (
        <button
          className={votedOptionId === option.id ? styles.voted : styles.option}
          key={option.id}
          type="button"
          disabled={disabled || votedOptionId !== null}
          onClick={() => onVote(option.id)}
        >
          {option.text}
        </button>
      ))}
    </div>
  );
}
