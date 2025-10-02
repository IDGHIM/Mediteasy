import React, { useState } from 'react';
import {
  IonButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle
} from '@ionic/react';
import { cloudUpload, play, musicalNotes } from 'ionicons/icons';

interface AudioFile {
  id: string;
  name: string;
  url: string;
}

interface AudioUploaderProps {
  onAudioSelect?: (file: AudioFile) => void;
}

const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioSelect }) => {
  const [selectedFile, setSelectedFile] = useState<AudioFile | null>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('audio/')) {
      alert('Veuillez sélectionner un fichier audio');
      return;
    }

    // Créer une URL temporaire pour le fichier
    const fileUrl = URL.createObjectURL(file);
    
    const audioFile: AudioFile = {
      id: Date.now().toString(),
      name: file.name,
      url: fileUrl
    };

    setSelectedFile(audioFile);
    
    if (onAudioSelect) {
      onAudioSelect(audioFile);
    }
  };

  const playAudio = () => {
    if (selectedFile) {
      const audio = new Audio(selectedFile.url);
      audio.play().catch(error => {
        console.error('Erreur lecture:', error);
        alert('Erreur lors de la lecture');
      });
    }
  };

  return (
    <IonCard>
      <IonCardHeader>
        <IonCardTitle>
          <IonIcon icon={musicalNotes} /> Audio Uploader
        </IonCardTitle>
      </IonCardHeader>
      
      <IonCardContent>
        {/* Bouton d'upload */}
        <IonButton expand="block" color="primary" style={{ position: 'relative' }}>
          <IonIcon icon={cloudUpload} slot="start" />
          Sélectionner un fichier audio
          <input
            type="file"
            accept="audio/*"
            onChange={handleFileSelect}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              opacity: 0,
              cursor: 'pointer'
            }}
          />
        </IonButton>

        {/* Fichier sélectionné */}
        {selectedFile && (
          <IonList>
            <IonItem>
              <IonIcon icon={musicalNotes} slot="start" color="primary" />
              <IonLabel>
                <h2>{selectedFile.name}</h2>
                <p>Fichier prêt à être utilisé</p>
              </IonLabel>
              <IonButton 
                fill="clear" 
                onClick={playAudio}
                slot="end"
              >
                <IonIcon icon={play} />
              </IonButton>
            </IonItem>
          </IonList>
        )}
      </IonCardContent>
    </IonCard>
  );
};

export default AudioUploader;