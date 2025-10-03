import { useState } from 'react';
import Navbar from './components/Navbar.jsx';
import GongSelector from './components/GongSelector.jsx';
import AmbientSoundSelector from './components/AmbientSelector.jsx';
import Sakura from './components/Sakura.jsx';

const App = () => {
  const [selectedGong, setSelectedGong] = useState(null);
  const [gongVolume, setGongVolume] = useState(0.7);
  const [gongFrequency, setGongFrequency] = useState('none');

  const handleFrequencyChange = (newFrequency) => {
    console.log('Fréquence changée:', newFrequency);
    setGongFrequency(newFrequency);
  };

  return (
    <div>
      <Navbar />
      <AmbientSoundSelector 
        selectedGong={selectedGong}
        gongVolume={gongVolume}
        gongFrequency={gongFrequency}
      />
      <GongSelector 
        onGongSelect={setSelectedGong}
        onVolumeChange={setGongVolume}
        onFrequencyChange={handleFrequencyChange}
        initialVolume={gongVolume}
        frequency={gongFrequency}
      />
      <Sakura />
    </div>
  );
};

export default App;