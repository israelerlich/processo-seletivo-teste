import { useState } from 'react';
import { createPoll } from '../api';
import styles from './CreatePollForm.module.css';

export default function CreatePollForm({ onCreated }) {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState(['', '']);
  const [duration, setDuration] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  function handleOptionChange(index, value) {
    const updated = [...options];
    updated[index] = value;
    setOptions(updated);
  }

  function addOption() {
    if (options.length < 6) {
      setOptions([...options, '']);
    }
  }

  function removeOption(index) {
    if (options.length > 2) {
      setOptions(options.filter((option, current) => current !== index));
    }
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      const poll = await createPoll({
        question,
        options: options.map((option) => option.trim()).filter(Boolean),
        duration_seconds: duration ? Number(duration) : null,
      });

      onCreated(poll);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h2 className={styles.title}>Nova enquete</h2>

      <label className={styles.label}>
        Pergunta
        <input
          className={styles.input}
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          placeholder="Qual o melhor jogador da rodada?"
          required
        />
      </label>

      <span className={styles.label}>Opções</span>

      {options.map((option, index) => (
        <div className={styles.optionRow} key={index}>
          <input
            className={styles.input}
            value={option}
            onChange={(event) => handleOptionChange(index, event.target.value)}
            placeholder={`Opção ${index + 1}`}
            required
          />
          {options.length > 2 && (
            <button className={styles.remove} type="button" onClick={() => removeOption(index)}>
              remover
            </button>
          )}
        </div>
      ))}

      <button className={styles.add} type="button" onClick={addOption} disabled={options.length >= 6}>
        adicionar opção
      </button>

      <label className={styles.label}>
        Encerrar depois de (segundos, opcional)
        <input
          className={styles.input}
          type="number"
          min="10"
          max="3600"
          value={duration}
          onChange={(event) => setDuration(event.target.value)}
          placeholder="60"
        />
      </label>

      {error && <p className={styles.error}>{error}</p>}

      <button className={styles.submit} type="submit" disabled={saving}>
        {saving ? 'Criando...' : 'Criar enquete'}
      </button>
    </form>
  );
}
