export default function GongFrequencySelector({ frequency, onFrequencyChange }) {
  const frequencyOptions = [
    { id: 'none', name: 'Aucun gong' },
    { id: 'start', name: 'Début uniquement' },
    { id: 'end', name: 'Fin uniquement' },
    { id: 'start-end', name: 'Début + Fin' },
    { id: '5min', name: 'Toutes les 5 minutes' },
    { id: '15min', name: 'Toutes les 15 minutes' },
    { id: '30min', name: 'Toutes les 30 minutes' },
  ];
  
  return (
    <div style={{ marginBottom: '15px' }}>
      <label htmlFor="gong-frequency">
        Fréquence des gongs :
      </label>
      <select
        id="gong-frequency"
        value={frequency}
        onChange={(e) => onFrequencyChange(e.target.value)}
        style={{ marginLeft: '10px', padding: '5px' }}
      >
        {frequencyOptions.map((option) => (
          <option key={option.id} value={option.id}>
            {option.name}
          </option>
        ))}
      </select>
    </div>
  );
}