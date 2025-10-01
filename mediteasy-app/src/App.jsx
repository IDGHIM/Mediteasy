import Navbar from './components/Navbar.jsx';
import GongSelector from './components/GongSelector.jsx';
import AudioUploader from './components/FileUpload.jsx';import AmbientSoundSelector from './components/AmbientSelector.jsx';
import MeditationTimerController from './components/MeditationTimerController.jsx';
import Sakura from './components/Sakura.jsx';

const App = () => {
  return (
    <div>
      <Navbar />
      <MeditationTimerController />
      <AmbientSoundSelector />
      <AudioUploader/>
      <GongSelector />
      <Sakura />
    </div>
  );
};

export default App;
