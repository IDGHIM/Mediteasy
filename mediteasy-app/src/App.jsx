import GongSelector from './components/GongSelector.jsx';
import AudioUploader from './components/FileUpload.jsx';import AmbientSoundSelector from './components/AmbientSelector.jsx';

const App = () => {
  return (
    <div>
      <h1>Notre site</h1>
      <AmbientSoundSelector />
      <AudioUploader/>
      <GongSelector />
    </div>
  );
};

export default App;
