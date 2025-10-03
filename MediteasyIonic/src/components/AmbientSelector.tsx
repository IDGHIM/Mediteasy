import React, { useState, useRef, useEffect } from 'react';
import '../pages/Tab1.css';

interface SoundOption {
  value: string;
  label: string;
  file?: string;
}

interface DurationOption {
  value: number;
  label: string;
}

interface AudioFile {
  id: string;
  name: string;
  url: string;
}

interface AmbientSelectorProps {
  uploadedFiles?: AudioFile[];
}

const baseSoundOptions: SoundOption[] = [
  { value: 'silence', label: '🔇 Silence' },
  { value: 'rain', label: '🌧️ Pluie', file: '/assets/ambient/rain.mp3' },
];

const durations: DurationOption[] = [
  { value: 5, label: '5 min' },
  { value: 10, label: '10 min' },
  { value: 15, label: '15 min' },
  { value: 20, label: '20 min' },
];

const AmbientSelector: React.FC<AmbientSelectorProps> = ({ uploadedFiles = [] }) => {
  const [selectedSound, setSelectedSound] = useState<string>('silence');
  const [duration, setDuration] = useState<number>(5);
  const [customMinutes, setCustomMinutes] = useState<string>('');
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);

 
  const soundOptions: SoundOption[] = [
    ...baseSoundOptions,
    ...uploadedFiles.map(file => ({
      value: `uploaded_${file.id}`,
      label: `🎵 ${file.name}`,
      file: file.url
    }))
  ];

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

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  return (
    <div className="ambient-selector">
      <div className="ambient-selector__container">
        <h1 className="ambient-selector__title">
          🧘 Méditation Timer
        </h1>

        {selectedSound !== 'silence' && selectedSoundOption?.file && (
          <audio
            ref={audioRef}
            loop
            preload="auto"
            src={selectedSoundOption.file}
            className="ambient-selector__audio"
            onError={(e) => {
              console.error('Erreur de chargement audio:', e);
            }}
          />
        )}
        
        {!isPlaying && !isFinished && (
          <div className="ambient-selector__section">
            <h2 className="ambient-selector__section-title">
              Son ambiant
            </h2>
            <select
              value={selectedSound}
              onChange={(e) => setSelectedSound(e.currentTarget.value)}
              className="ambient-selector__select"
            >
              
              
              {soundOptions.map((s) => (
                <option key={s.value} value={s.value}>
                  {s.label}
                </option>
              ))}
            </select>

            {selectedSound !== 'silence' && (
              <div className="ambient-selector__volume">
                <label className="ambient-selector__volume-label">
                  Volume: {Math.round(volume * 100)}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.01"
                  value={volume}
                  onChange={(e) => setVolume(parseFloat(e.currentTarget.value))}
                  className="ambient-selector__volume-slider"
                />
              </div>
            )}
          </div>
        )}

        {!isPlaying && !isFinished && (
          <div className="ambient-selector__section">
            <h2 className="ambient-selector__section-title">
              Durée de méditation
            </h2>
            <select
              value={duration}
              onChange={(e) => handleDurationChange(parseInt(e.currentTarget.value))}
              className="ambient-selector__select"
            >
              {durations.map((d) => (
                <option key={d.value} value={d.value}>
                  {d.label}
                </option>
              ))}
            </select>

            {!showCustomInput ? (
              <div className="ambient-selector__custom-button-wrapper">
                <button
                  onClick={() => setShowCustomInput(true)}
                  className="ambient-selector__custom-button"
                >
                  ➕ Durée personnalisée
                </button>
              </div>
            ) : (
              <div className="ambient-selector__custom-input-wrapper">
                <div className="ambient-selector__custom-input-group">
                  <input
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.currentTarget.value)}
                    placeholder="1-180"
                    min="1"
                    max="180"
                    className="ambient-selector__custom-input"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') handleAddCustomDuration();
                    }}
                  />
                  <button
                    onClick={handleAddCustomDuration}
                    className="ambient-selector__custom-confirm"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomMinutes('');
                    }}
                    className="ambient-selector__custom-cancel"
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        <div className="ambient-selector__controls">
          {(!isPlaying || isFinished) && (
            <button
              onClick={handlePlay}
              className={`ambient-selector__button ambient-selector__button--${
                isFinished ? 'restart' : 'start'
              }`}
            >
              {isFinished ? '🔄 Recommencer' : '▶️ Démarrer'}
            </button>
          )}

          {isPlaying && !isFinished && (
            <div className="ambient-selector__controls-group">
              <button
                onClick={handlePause}
                className="ambient-selector__button ambient-selector__button--pause"
              >
                ⏸️ Pause
              </button>

              <button
                onClick={handleStop}
                className="ambient-selector__button ambient-selector__button--stop"
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

// CSS styles are now in Tab1.css to ensure consistency across components.
// Block : .ambient-selector
// Element : .ambient-selector__container, .ambient-selector__button
// Modifier : .ambient-selector__button--start, .ambient-selector__button--pause

// Classes disponibles
// Conteneurs

// .ambient-selector - Wrapper principal
// .ambient-selector__container - Card conteneur
// .ambient-selector__section - Section (son/durée)

// Texte

// .ambient-selector__title - Titre principal
// .ambient-selector__section-title - Titre de section

// Formulaires

// .ambient-selector__select - Dropdown select
// .ambient-selector__volume - Container volume
// .ambient-selector__volume-label - Label volume
// .ambient-selector__volume-slider - Slider volume

// Boutons

// .ambient-selector__button - Bouton de base
// .ambient-selector__button--start - Bouton démarrer (violet)
// .ambient-selector__button--restart - Bouton recommencer (vert)
// .ambient-selector__button--pause - Bouton pause (orange)
// .ambient-selector__button--stop - Bouton stop (rouge)

// Durée personnalisée

// .ambient-selector__custom-button - Bouton "Durée personnalisée"
// .ambient-selector__custom-input - Input nombre
// .ambient-selector__custom-confirm - Bouton ✓
// .ambient-selector__custom-cancel - Bouton ✕