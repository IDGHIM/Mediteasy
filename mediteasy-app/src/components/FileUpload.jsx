import React, { useState } from 'react';
import { Music } from 'lucide-react';

const AudioUploader = ({ onAudioUpload }) => {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('audio/')) {
      setSelectedFile(file);
      
      // Créer une URL pour le fichier audio
      const audioUrl = URL.createObjectURL(file);
      
      // Envoyer les données au parent
      if (onAudioUpload) {
        onAudioUpload({
          file: file,
          url: audioUrl,
          name: file.name,
          size: file.size
        });
      }
    }
  };

  return (
    <div>
      <label className="cursor-pointer inline-flex items-center justify-center w-12 h-12 bg-indigo-600 hover:bg-indigo-700 rounded-full transition-colors duration-200 shadow-lg">
        <Music className="text-white" size={24} />
        <input
          type="file"
          accept="audio/*"
          onChange={handleFileSelect}
          className="hidden"
        />
      </label>
      
      {selectedFile && (
        <p className="text-xs text-gray-600 mt-2">
          {selectedFile.name}
        </p>
      )}
    </div>
  );
};

// Exemple d'utilisation dans un autre composant
export default AudioUploader;