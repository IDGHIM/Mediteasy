// Exemple d'utilisation dans votre App.jsx
import React, { useState } from 'react';
import SimpleAudioUploader from './components/SimpleAudioUploader';

const App = () => {
  const [currentAudio, setCurrentAudio] = useState(null);

  const handleAudioSelect = (audioFile) => {
    setCurrentAudio(audioFile);
    console.log('Fichier sélectionné:', audioFile);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">
          🧘 Mediteasy - Simple
        </h1>
        
        <SimpleAudioUploader onAudioSelect={handleAudioSelect} />
        
        {currentAudio && (
          <div className="mt-6 p-4 bg-blue-100 rounded-lg max-w-md mx-auto">
            <h3 className="font-medium text-blue-900">
              Fichier sélectionné: {currentAudio.name}
            </h3>
            <p className="text-sm text-blue-700 mt-1">
              Prêt pour la méditation !
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;