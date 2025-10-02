import React, { useState, useRef, useEffect } from 'react';

interface SoundOption {
  value: string;
  label: string;
  file?: string;
}

interface DurationOption {
  value: number;
  label: string;
}

const soundOptions: SoundOption[] = [
  { value: 'silence', label: '🔇 Silence' },
  { value: 'rain', label: '🌧️ Pluie', file: '/assets/ambient/rain.mp3' },
];

const durations: DurationOption[] = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
];

const AmbientSelector: React.FC = () => {
  const [selectedSound, setSelectedSound] = useState<string>('silence');
  const [duration, setDuration] = useState<number>(5);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const selectedSoundOption = soundOptions.find((s) => s.value === selectedSound);

  const handleDurationChange = (value: number) => {
    setDuration(value);
  };

  const handleAddCustomDuration = () => {
    const minutes = parseInt(customMinutes, 10);
    if (!isNaN(minutes) && minutes >= 1 && minutes <= 180) {
      setDuration(minutes);
      setShowCustomInput(false);
      setCustomMinutes('');
    }
  };

  const handlePlay = () => {
    setIsPlaying(true);
    setIsFinished(false);
    if (selectedSound !== 'silence' && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      audioRef.current.play().catch((err) => console.error('Erreur lecture audio:', err));
    }
  };

  const handlePause = () => {
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const handleStop = () => {
    setIsPlaying(false);
    setIsFinished(true);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  // Update audio volume dynamically
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div>
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '24px',
          boxShadow:
            '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
          padding: '32px',
          maxWidth: '448px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '1.875rem',
            fontWeight: 'bold',
            textAlign: 'center',
            color: '#1f2937',
            marginBottom: '32px',
          }}
        >
          🧘 Méditation Timer
        </h1>

        {/* Élément audio caché */}
        {selectedSound !== 'silence' && selectedSoundOption?.file && (
          <audio
            ref={audioRef}
            loop
            preload="auto"
            src={selectedSoundOption.file}
            style={{ display: 'none' }}
            onError={(e) => {
              console.error('Erreur de chargement audio:', e);
            }}
          />
        )}

        {/* Sélection du son ambiant */}
        {!isPlaying && !isFinished && (
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                textAlign: 'center',
                color: '#4b5563',
                marginBottom: '16px',
                fontWeight: '500',
              }}
            >
              Son ambiant
            </h2>
            <select
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.currentTarget.value)}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            >
              {soundOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {/* Contrôle du volume */}
            {selectedSound !== 'silence' && (
              <div style={{ marginTop: '20px', textAlign: 'center' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '0.875rem',
                    color: '#6b7280',
                    marginBottom: '8px',
                  }}
                >
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
                  style={{
                    width: '80%',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#d1d5db';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#e5e7eb';
                  }}
                />
              </div>
            )}
          </div>
        )}

        {/* Sélection de la durée */}
        {!isPlaying && !isFinished && (
          <div style={{ marginBottom: '32px' }}>
            <h2
              style={{
                textAlign: 'center',
                color: '#4b5563',
                marginBottom: '16px',
                fontWeight: '500',
              }}
            >
              Durée de méditation
            </h2>
            <select
              value={duration}
              onChange={(e) => handleDurationChange(parseInt(e.currentTarget.value))}
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                border: '1px solid #d1d5db',
                fontSize: '1rem',
              }}
            >
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {!showCustomInput ? (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: '#e0e7ff',
                    color: '#4c51bf',
                    border: 'none',
                    cursor: 'pointer',
                  }}
                  onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = '#c7d2fe')
                  }
                  onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = '#e0e7ff')
                  }
                >
                  ➕ Durée personnalisée
                </button>
              </div>
            ) : (
              <div
                style={{
                  marginTop: '16px',
                  padding: '16px',
                  backgroundColor: '#f9fafb',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    gap: '8px',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <input
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.currentTarget.value)}
                    placeholder="1-180"
                    min="1"
                    max="180"
                    style={{
                      width: '120px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem',
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddCustomDuration();
                    }}
                  />
                  <button
                    onClick={handleAddCustomDuration}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomMinutes('');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      border: 'none',
                      cursor: 'pointer',
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Boutons de contrôle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {(!isPlaying || isFinished) && (
            <button
              onClick={handlePlay}
              style={{
                width: '100%',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: isFinished ? '#10b981' : '#8b5cf6',
                color: 'white',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'scale(1.05)';
                e.currentTarget.style.backgroundColor = isFinished
                  ? '#059669'
                  : '#7c3aed';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'scale(1)';
                e.currentTarget.style.backgroundColor = isFinished
                  ? '#10b981'
                  : '#8b5cf6';
              }}
            >
              {isFinished ? '🔄 Recommencer' : '▶️ Démarrer'}
            </button>
          )}

          {isPlaying && !isFinished && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePause}
                style={{
                  flex: 1,
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#f97316',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#f97316';
                }}
              >
                ⏸️ Pause
              </button>

              <button
                onClick={handleStop}
                style={{
                  flex: 1,
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ef4444',
                  color: 'white',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                  e.currentTarget.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                  e.currentTarget.style.backgroundColor = '#ef4444';
                }}
              >
                ⏹️ Arrêter
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AmbientSelector;
