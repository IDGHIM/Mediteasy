export default function PlayPauseButton({ 
  isPlaying, 
  onToggle, 
  disabled = false,
  showLabel = true 
}) {
  return (
    <div>
      <button
        onClick={onToggle}
        disabled={disabled}
      >
        {isPlaying ? '⏸️ Pause' : '▶️ Play'}
      </button>
      
      {showLabel && isPlaying && (
        <span style={{ marginLeft: '10px' }}>🔊 En lecture...</span>
      )}
    </div>
  );
}