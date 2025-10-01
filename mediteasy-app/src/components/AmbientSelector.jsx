import { useState, useRef, useEffect } from 'react';
import PlayPauseButton from './PlayPauseButton';

export default function AmbientSoundSelector() {
  const [selectedSound, setSelectedSound] = useState('rain');
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadingState, setLoadingState] = useState('idle');
  const [volume, setVolume] = useState(0.5);
  const audioRef = useRef(null);

  const soundOptions = [
    { id: 'rain', name: 'Pluie douce', file: '/assets/ambient/rain.mp3', type: 'audio/mpeg' },
    { id: 'ocean', name: 'Vagues océan', file: '/assets/ambient/ocean.mp3', type: 'audio/mpeg' },
    { id: 'forest', name: 'Forêt', file: '/assets/ambient/forest.mp3', type: 'audio/mpeg' },
    { id: 'wind', name: 'Vent léger', file: '/assets/ambient/wind.mp3', type: 'audio/mpeg' },
    { id: 'fireplace', name: 'Feu de cheminée', file: '/assets/ambient/fireplace.mp3', type: 'audio/mpeg' },
    { id: 'tibetan', name: 'Bols tibétains', file: '/assets/ambient/tibetan.mp3', type: 'audio/mpeg' },
    { id: 'silence', name: 'Silence', file: null, type: null },
  ];

  const selectedOption = soundOptions.find(opt => opt.id === selectedSound);

  useEffect(() => {
    if (!audioRef.current || !selectedOption || !selectedOption.file) return;

    const audio = audioRef.current;
    const shouldAutoPlay = isPlaying;
    
    setLoadingState('loading');

    const handleCanPlay = () => {
      setLoadingState('loaded');
      if (shouldAutoPlay) {
        audio.play().catch(err => {
          console.error('Erreur de lecture auto:', err);
          setIsPlaying(false);
        });
      }
    };

    const handleError = () => {
      setLoadingState('error');
      setIsPlaying(false);
    };

    const handleAbort = () => {
      // Ignoré silencieusement - normal lors du changement de source
    };

    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('abort', handleAbort);
    audio.load();

    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('abort', handleAbort);
    };
  }, [selectedSound, isPlaying, selectedOption]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const handleSelectSound = (e) => {
    const newSound = e.target.value;
    const wasPlaying = isPlaying;
    
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
    }
    
    setIsPlaying(false);
    setLoadingState('idle');
    setSelectedSound(newSound);
    
    if (wasPlaying && newSound !== 'silence') {
      setTimeout(() => {
        setIsPlaying(true);
      }, 200);
    }
  };

  const togglePlayPause = async () => {
    if (!audioRef.current || !selectedOption || selectedSound === 'silence') return;

    try {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        if (loadingState !== 'loaded') {
          console.log('Audio pas encore chargé');
          return;
        }
        audioRef.current.currentTime = 0;
        await audioRef.current.play();
        setIsPlaying(true);
      }
    } catch (err) {
      console.error('Erreur de lecture:', err);
      setIsPlaying(false);
    }
  };

  const handleVolumeChange = (e) => {
    setVolume(parseFloat(e.target.value));
  };

  return (
    <div className="selector-card" style={{ padding: '20px', maxWidth: '600px' }}>
      <h1>Sons Ambiants pour Méditation</h1>
      
      <div className="selectors-container" style={{ marginBottom: '15px' }}>
        <label htmlFor="sound-select">Choisir un son ambiant : </label>
        <select
          id="sound-select"
          value={selectedSound}
          onChange={handleSelectSound}
          style={{ marginLeft: '10px', padding: '5px' }}
        >
          {soundOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      {selectedSound !== 'silence' && (
        <>
          <div style={{ marginBottom: '15px' }}>
            {loadingState === 'loading' && '⏳ Chargement...'}
            {loadingState === 'loaded' && <span style={{ color: 'green' }}>✓ Fichier chargé</span>}
            {loadingState === 'error' && selectedOption && <span style={{ color: 'red' }}>❌ Erreur: {selectedOption.file} introuvable</span>}
          </div>

          <div style={{ marginBottom: '15px' }}>
            <PlayPauseButton
              isPlaying={isPlaying}
              onToggle={togglePlayPause}
              disabled={loadingState !== 'loaded'}
              showLabel={true}
            />
          </div>

          <div style={{ marginBottom: '15px' }}>
            <label htmlFor="volume-control">Volume : {Math.round(volume * 100)}%</label>
            <br />
            <input
              id="volume-control"
              type="range"
              min="0"
              max="1"
              step="0.01"
              value={volume}
              onChange={handleVolumeChange}
              style={{ width: '200px', marginTop: '5px' }}
            />
          </div>

          <audio ref={audioRef} preload="auto" loop>
            {selectedOption && selectedOption.file && (
              <source src={selectedOption.file} type={selectedOption.type} />
            )}
          </audio>
        </>
      )}

      {selectedSound === 'silence' && (
        <div style={{ marginTop: '15px', padding: '10px', backgroundColor: '#f0f0f0', borderRadius: '5px' }}>
          <p>🔇 Mode silence activé - Aucun son ambiant</p>
        </div>
      )}
     
    </div>
  );
}