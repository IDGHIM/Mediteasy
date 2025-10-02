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
                <p>Prêt pour la méditation !</p>
              </IonText>
            </IonCardContent>
          </IonCard>
        )}

        {/* Composant d'upload */}
        <AudioUploader onAudioSelect={handleAudioSelect} />
        
      </IonContent>
    </IonPage>
  );
};

export default Tab1;
