import { useState, useRef, useEffect } from 'react';
import GongFrequencySelector from './GongFrequencySelector';

export default function GongSelector({ 
  onGongSelect,
  onVolumeChange,
  onFrequencyChange,
  initialVolume = 0.7,
  frequency = 'none'
}) {
  const [selectedGong, setSelectedGong] = useState('tibetan-bowl');
  const [loadingState, setLoadingState] = useState('idle');
  const [gongVolume, setGongVolume] = useState(initialVolume);
  const audioRef = useRef(null);
  
  const gongOptions = [
    { id: 'tibetan-bowl', name: 'Gong 1', file: '/assets/gongs/gong_hit.wav', type: 'audio/wav' },
    { id: 'gong-chinese', name: 'Gong 2', file: '/assets/gongs/roger_gong.mp3', type: 'audio/mpeg' },
    { id: 'gong-japanese', name: 'Gong 3', file: '/assets/gongs/studio_gong.wav', type: 'audio/wav' },
    { id: 'gong-thai', name: 'Gong 4', file: '/assets/gongs/zen_gong.wav', type: 'audio/wav' },
  ];
  
  const selectedOption = gongOptions.find(opt => opt.id === selectedGong);
  
  useEffect(() => {
    if (onGongSelect && selectedOption) {
      onGongSelect(selectedOption);
    }
  }, [selectedGong, onGongSelect, selectedOption]);
  
  useEffect(() => {
    if (onVolumeChange) {
      onVolumeChange(gongVolume);
    }
  }, [gongVolume, onVolumeChange]);
  
  useEffect(() => {
    if (!audioRef.current) return;
    
    const audio = audioRef.current;
    setLoadingState('loading');
    
    const handleCanPlay = () => {
      setLoadingState('loaded');
    };
    
    const handleError = () => {
      setLoadingState('error');
    };
    
    audio.addEventListener('canplaythrough', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.load();
    
    return () => {
      audio.removeEventListener('canplaythrough', handleCanPlay);
      audio.removeEventListener('error', handleError);
    };
  }, [selectedGong]);
  
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = gongVolume;
    }
  }, [gongVolume]);
  
  const playPreview = async () => {
    if (!audioRef.current || loadingState !== 'loaded') return;
    
    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (err) {
      console.error('Erreur de lecture:', err);
    }
  };
  
  return (
    <div className="selector-card">
      <h1>Sélecteur de Sons de Gong</h1>
      
      <div className="gong-selector-wrapper">
        <label htmlFor="gong-select">Choisir un son de gong :</label>
        <select
          id="gong-select"
          value={selectedGong}
          onChange={(e) => setSelectedGong(e.target.value)}
        >
          {gongOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      <GongFrequencySelector 
        frequency={frequency}
        onFrequencyChange={onFrequencyChange}
      />
      
      <div className="volume-control">
        <label htmlFor="gong-volume">
          Volume des gongs :
        </label>
        <div>
          <input
            id="gong-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={gongVolume}
            onChange={(e) => setGongVolume(parseFloat(e.target.value))}
          />
          <span className="volume-percentage">
            {Math.round(gongVolume * 100)}%
          </span>
        </div>
      </div>
      
      <div className="status-indicator">
        {loadingState === 'loading' && '⏳ Chargement...'}
        {loadingState === 'loaded' && <span className="status-loaded">✓ Fichier chargé</span>}
        {loadingState === 'error' && <span className="status-error">❌ Erreur: {selectedOption.file} introuvable</span>}
      </div>
      
      <button 
        onClick={playPreview}
        disabled={loadingState !== 'loaded'}
      >
        🔊 Écouter un aperçu
      </button>
      
      <audio ref={audioRef} preload="auto">
        <source src={selectedOption.file} type={selectedOption.type} />
      </audio>
    </div>
  );
}