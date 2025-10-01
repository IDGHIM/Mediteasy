import GongSelector from './components/GongSelector.jsx';
import AudioUploader from './components/FileUpload.jsx';
const App = () => {
  return (
    <div>
      <h1>Notre site</h1>
      <AudioUploader/>
      <GongSelector />
    </div>
  );
};

export default App;
