import React, { useState } from 'react';
import { Music, Upload, Play } from 'lucide-react';

const SimpleAudioUploader = ({ onAudioSelect }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Veuillez sélectionner un fichier audio');
      return;
    }

    const fileData = {
      id: Date.now().toString(),
      name: file.name,
      url: URL.createObjectURL(file),
      file: file
    };

    setSelectedFile(fileData);
    
    if (onAudioSelect) {
      onAudioSelect(fileData);
    }
  };

  const playAudio = () => {
    if (selectedFile) {
      const audio = new Audio(selectedFile.url);
      audio.play().catch(error => {
        console.error('Erreur:', error);
        alert('Erreur lors de la lecture');
      });
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md max-w-md mx-auto">
      <h3 className="text-xl font-bold mb-4 flex items-center">
        <Music className="mr-2 text-blue-600" />
        Audio Uploader
      </h3>

      {/* Bouton d'upload */}
      <label className="block">
        <div className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors">
          <Upload className="mr-2" size={20} />
          Sélectionner un fichier audio
        </div>
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>

      {/* Fichier sélectionné */}
      {selectedFile && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                {selectedFile.name}
              </h4>
              <p className="text-sm text-gray-500">
                Fichier prêt à être utilisé
              </p>
            </div>
            <button
              onClick={playAudio}
              className="ml-3 p-2 bg-green-500 text-white rounded-full hover:bg-green-600 transition-colors"
              title="Lire le fichier"
            >
              <Play size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SimpleAudioUploader;