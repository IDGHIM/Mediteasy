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


import { musicalNotes } from 'ionicons/icons';
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

  const handleAudioSelect = (file: AudioFile) => {
    setSelectedAudio(file);
    console.log('Audio sélectionné:', file);
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
      
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Mediteasy</IonTitle>
          </IonToolbar>
        </IonHeader>

        {/* Audio sélectionné */}
        {selectedAudio && (
          <IonCard color="light">
            <IonCardHeader>
              <IonCardTitle>
                <IonIcon icon={musicalNotes} color="success" />
                {' '}Audio Sélectionné
              </IonCardTitle>
            </IonCardHeader>
            <IonCardContent>
              <IonText>
                <h3>{selectedAudio.name}</h3>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}
        {/* Gong Selector */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🔔 Sélecteur de Gong</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <GongSelector />
          </IonCardContent>
        </IonCard>

        {/* AudioUploader */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🎵 Audio Uploader</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <AudioUploader onAudioSelect={handleAudioSelect} />
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>

  );
};

export default Tab1;
