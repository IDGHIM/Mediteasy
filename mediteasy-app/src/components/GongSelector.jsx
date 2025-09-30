import { useState, useRef, useEffect } from 'react';

export default function GongSelector() {
  const [selectedGong, setSelectedGong] = useState('tibetan-bowl');
  const [loadingState, setLoadingState] = useState('idle');
  const audioRef = useRef(null);
  
  const gongOptions = [
    { id: 'tibetan-bowl', name: 'Gong 1', file: '/assets/gongs/gong_hit.wav', type: 'audio/wav' },
    { id: 'gong-chinese', name: 'Gong 2', file: '/assets/gongs/roger_gong.mp3', type: 'audio/mpeg' },
    { id: 'gong-japanese', name: 'Gong 3', file: '/assets/gongs/studio_gong.wav', type: 'audio/wav' },
    { id: 'gong-thai', name: 'Gong 4', file: '/assets/gongs/zen_gong.wav', type: 'audio/wav' },
  ];
  
  const selectedOption = gongOptions.find(opt => opt.id === selectedGong);
  
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
  
  const handleSelectGong = (e) => {
    setSelectedGong(e.target.value);
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
    <div style={{ padding: '20px' }}>
      <h1>Sélecteur de Sons de Gong</h1>
      
      <div style={{ marginBottom: '15px' }}>
        <label htmlFor="gong-select">Choisir un son de gong : </label>
        <select
          id="gong-select"
          value={selectedGong}
          onChange={handleSelectGong}
        >
          {gongOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>
      
      {/* État de chargement */}
      <div style={{ marginBottom: '15px' }}>
        {loadingState === 'loading' && '⏳ Chargement...'}
        {loadingState === 'loaded' && <span style={{ color: 'green' }}>✓ Fichier chargé</span>}
        {loadingState === 'error' && <span style={{ color: 'red' }}>❌ Erreur: {selectedOption.file} introuvable</span>}
      </div>
      
      {/* Bouton de prévisualisation */}
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
      
      {/* Audio element */}
      <audio ref={audioRef} preload="auto">
        <source src={selectedOption.file} type={selectedOption.type} />
      </audio>
    </div>
  );
}