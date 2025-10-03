import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonButtons,
  IonIcon
} from '@ionic/react';

import AudioUploader from '../components/SimpleAudioUploader';
import AmbientSelector from '../components/AmbientSelector';
import GongSelector from '../components/GongSelector';
import './Tab1.css';

interface AudioFile {
  id: string;
  name: string;
  url: string;
}

const Tab1: React.FC = () => {
  const [selectedAudio, setSelectedAudio] = useState<AudioFile | null>(null);
  const [uploadedFiles, setUploadedFiles] = useState<AudioFile[]>([]);

  const handleAudioSelect = (file: AudioFile) => {
    setSelectedAudio(file);
    console.log('Audio sélectionné:', file);
  };

  const handleFileUpload = (file: AudioFile) => {
    setUploadedFiles(prev => [...prev, file]);
    console.log('Nouveau fichier uploadé:', file);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar style={{ '--background': 'transparent', '--border': 'transparent' } as React.CSSProperties}>
          <IonButtons slot="start">
          <img 
          src="/assets/logo/logo_app.png" 
          alt="Mediteasy Logo" 
          style={{ height: '50px', marginLeft: '10px' }}
          />
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{ padding: '16px' }}>
        {/* Ambient Selector */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🧘 Méditation</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
              <AmbientSelector uploadedFiles={uploadedFiles} />
              <AudioUploader 
              onAudioSelect={handleAudioSelect} 
              uploadedFiles={uploadedFiles}
              onFileUpload={handleFileUpload}
            />
          </IonCardContent>
        </IonCard>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🔔 Sélecteur de Gong</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <GongSelector />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>

  );
};

export default Tab1;
