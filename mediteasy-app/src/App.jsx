import Navbar from './components/Navbar.jsx';
import GongSelector from './components/GongSelector.jsx';
import AmbientSoundSelector from './components/AmbientSelector.jsx';
import Sakura from './components/Sakura.jsx';

const App = () => {
  return (
    <div>
      <Navbar />
      <AmbientSoundSelector />
      <GongSelector />
      <Sakura />
    </div>
  );
};

export default App;
