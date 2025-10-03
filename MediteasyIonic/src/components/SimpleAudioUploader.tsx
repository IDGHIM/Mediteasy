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
interface AudioUploaderProps{
    onAudioSelect?: (file: AudioFile) => void;
    uploadedFiles?: AudioFile[];
    onFileUpload?: (file: AudioFile) => void;
}
const AudioUploader: React.FC<AudioUploaderProps> = ({ onAudioSelect, uploadedFiles = [], onFileUpload }) => {
    const [selectedFile, setSelectedFile] = useState <AudioFile | null>(null);
    

    const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
    
    if(!file.type.startsWith('audio/')) {
        alert("Selectionnez un fichier audio valide");
        return;
    }
    const fileUrl = URL.createObjectURL(file);

    const audioFile: AudioFile = {
        id: Date.now().toString(),
        name:file.name,
        url:fileUrl
    };

    setSelectedFile(audioFile);
    
    if(onFileUpload){
        onFileUpload(audioFile);
    }

    if(onAudioSelect){
        onAudioSelect(audioFile);
    }
}

  return (
    <IonCardContent>
      <IonButton expand="block">
        <IonIcon icon={cloudUpload} slot="start" />
        Importer un fichier audio
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
    </IonCardContent>
  );
};

export default AudioUploader;