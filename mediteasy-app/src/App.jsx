import Navbar from './components/Navbar.jsx';
import GongSelector from './components/GongSelector.jsx';
import AmbientSoundSelector from './components/AmbientSelector.jsx';

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
