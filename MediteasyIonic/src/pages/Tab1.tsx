import React, { useState } from 'react';
import { 
  IonContent, 
  IonHeader, 
  IonPage, 
  IonTitle, 
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonText,
  IonIcon
} from '@ionic/react';
import { musicalNotes } from 'ionicons/icons';
import AudioUploader from '../components/SimpleAudioUploader';
import AmbientSelector from '../components/AmbientSelector';
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
        <IonToolbar color="primary">
          <IonTitle>🧘 Mediteasy</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent fullscreen style={{ padding: '16px' }}>
        {/* Ambient Selector */}
        <IonCard>
          <IonCardHeader>
            <IonCardTitle>🧘 Méditation</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
              <AmbientSelector />
          </IonCardContent>
        </IonCard>

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
                <p>Prêt pour la méditation !</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

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
