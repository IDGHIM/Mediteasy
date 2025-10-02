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
  
  const handleSelectGong = (e) => {
    setSelectedGong(e.target.value);
  };
  
  const handleVolumeChange = (e) => {
    setGongVolume(parseFloat(e.target.value));
  };
  
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
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="gong-select">Choisir un son de gong : </label>
        <select
          id="gong-select"
          value={selectedGong}
          onChange={handleSelectGong}
          style={{ marginLeft: '10px', padding: '5px' }}
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
      
      <div style={{ marginBottom: '15px' }}>
        <label 
          htmlFor="gong-volume" 
          style={{ display: 'block', marginBottom: '5px' }}
        >
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
            onChange={handleVolumeChange}
            style={{ verticalAlign: 'middle', width: '200px' }}
          />
          <span style={{ marginLeft: '10px', fontWeight: 'bold' }}>
            {Math.round(gongVolume * 100)}%
          </span>
        </div>
      </div>
      
      <div style={{ marginBottom: '15px' }}>
        {loadingState === 'loading' && '⏳ Chargement...'}
        {loadingState === 'loaded' && <span style={{ color: 'green' }}>✓ Fichier chargé</span>}
        {loadingState === 'error' && <span style={{ color: 'red' }}>❌ Erreur: {selectedOption.file} introuvable</span>}
      </div>
      
      <button 
        onClick={playPreview}
        disabled={loadingState !== 'loaded'}
        style={{ 
          padding: '10px 20px',
          opacity: loadingState === 'loaded' ? 1 : 0.5 
        }}
      >
        🔊 Écouter un aperçu
      </button>
      
      <audio ref={audioRef} preload="auto">
        <source src={selectedOption.file} type={selectedOption.type} />
      </audio>
    </div>
  );
}