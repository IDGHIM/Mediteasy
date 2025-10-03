import { useState, useRef, useEffect, ChangeEvent } from "react";

type LoadingState = "idle" | "loading" | "loaded" | "error";

interface GongOption {
  id: string;
  name: string;
  file: string;
  type: string;
}

export default function GongSelector() {
  const [selectedGong, setSelectedGong] = useState<string>("tibetan-bowl");
  const [loadingState, setLoadingState] = useState<LoadingState>("idle");
  const [gongVolume, setGongVolume] = useState<number>(0.5);
  const audioRef = useRef<HTMLAudioElement>(null);

  const gongOptions: GongOption[] = [
    {
      id: "tibetan-bowl",
      name: "Gong 1",
      file: "/assets/gongs/gong_hit.wav",
      type: "audio/wav",
    },
    {
      id: "gong-chinese",
      name: "Gong 2",
      file: "/assets/gongs/roger_gong.mp3",
      type: "audio/mpeg",
    },
    {
      id: "gong-japanese",
      name: "Gong 3",
      file: "/assets/gongs/studio_gong.wav",
      type: "audio/wav",
    },
    {
      id: "gong-thai",
      name: "Gong 4",
      file: "/assets/gongs/zen_gong.wav",
      type: "audio/wav",
    },
  ];

  const selectedOption = gongOptions.find((opt) => opt.id === selectedGong);

  useEffect(() => {
    if (!audioRef.current) return;

    const audio = audioRef.current;
    setLoadingState("loading");

    const handleCanPlay = () => {
      setLoadingState("loaded");
    };

    const handleError = () => {
      setLoadingState("error");
    };

    audio.addEventListener("canplaythrough", handleCanPlay);
    audio.addEventListener("error", handleError);
    audio.load();

    return () => {
      audio.removeEventListener("canplaythrough", handleCanPlay);
      audio.removeEventListener("error", handleError);
    };
  }, [selectedGong]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = gongVolume;
    }
  }, [gongVolume]);

  const handleSelectGong = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedGong(e.target.value);
  };

  const handleVolumeChange = (e: ChangeEvent<HTMLInputElement>) => {
    setGongVolume(parseFloat(e.target.value));
  };

  const playPreview = async () => {
    if (!audioRef.current || loadingState !== "loaded") return;

    try {
      audioRef.current.currentTime = 0;
      await audioRef.current.play();
    } catch (err) {
      console.error("Erreur de lecture:", err);
    }
  };

  return (
    <div className="gong-selector-card">
      <h1 className="gong-selector-title">Sélecteur de Sons de Gong</h1>
      
      <div className="gong-select-container">
        <label htmlFor="gong-select" className="gong-select-label">
          Choisir un son de gong :
        </label>
        <select
          id="gong-select"
          className="gong-select"
          value={selectedGong}
          onChange={handleSelectGong}
        >
          {gongOptions.map((option) => (
            <option key={option.id} value={option.id}>
              {option.name}
            </option>
          ))}
        </select>
      </div>

      <div className="gong-volume-container">
        <label htmlFor="gong-volume" className="gong-volume-label">
          Volume :
        </label>
        <div className="gong-volume-controls">
          <input
            id="gong-volume"
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={gongVolume}
            onChange={handleVolumeChange}
            className="gong-volume-slider"
          />
          <span className="gong-volume-value">
            {Math.round(gongVolume * 100)}%
          </span>
        </div>
      </div>

      <button
        onClick={playPreview}
        disabled={loadingState !== "loaded"}
        className={`gong-preview-button ${loadingState !== "loaded" ? "gong-preview-button--disabled" : ""}`}
      >
        🔊 Écouter un aperçu
      </button>

      <audio ref={audioRef} preload="auto">
        <source src={selectedOption?.file} type={selectedOption?.type} />
      </audio>
    </div>
  );
}

// CSS styles can be added in a separate GongSelector.css file or within a style tag
// .gong-selector-card - Conteneur principal
// .gong-selector-title - Titre h1
// .gong-select-container - Conteneur du select
// .gong-select-label - Label du select
// .gong-select - Select lui-même
// .gong-volume-container - Conteneur du volume
// .gong-volume-label - Label du volume
// .gong-volume-controls - Conteneur des contrôles de volume
// .gong-volume-slider - Input range
// .gong-volume-value - Affichage du pourcentage
// .gong-loading-status - Conteneur du statut de chargement
// .gong-status-loading - Statut en chargement
// .gong-status-loaded - Statut chargé (succès)
// .gong-status-error - Statut erreur
// .gong-preview-button - Bouton de prévisualisation
// .gong-preview-button--disabled - Modificateur pour l'état désactivé