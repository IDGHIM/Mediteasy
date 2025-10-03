import React, { useState, useEffect, useRef } from 'react';

// Composant Wheel Picker pour la sélection de durée
function DurationWheelPicker({ value, onChange, disabled, durations = [5, 10, 15, 20, 30, 45, 60] }) {
  const wheelRef = useRef(null);
  const itemHeight = 60;
  const visibleItems = 5;
  const centerIndex = Math.floor(visibleItems / 2);

  useEffect(() => {
    if (wheelRef.current) {
      const index = durations.indexOf(value);
      if (index !== -1) {
        wheelRef.current.scrollTop = index * itemHeight;
      }
    }
  }, [durations, value]);

  const handleScroll = (e) => {
    if (disabled) return;
    const scrollTop = e.target.scrollTop;
    const index = Math.round(scrollTop / itemHeight);
    const clampedIndex = Math.max(0, Math.min(index, durations.length - 1));
    
    if (durations[clampedIndex] !== value) {
      onChange(durations[clampedIndex]);
    }
  };

  const handleClick = (duration, index) => {
    if (!disabled) {
      onChange(duration);
      if (wheelRef.current) {
        wheelRef.current.scrollTop = index * itemHeight;
      }
    }
  };

  return (
    <div style={{ position: 'relative', width: '200px', margin: '0 auto' }}>
      {/* Zone de sélection centrale */}
      <div style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 10
      }}>
        <div style={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center'
        }}>
          <div style={{
            height: '60px',
            borderTop: '2px solid #8b5cf6',
            borderBottom: '2px solid #8b5cf6',
            backgroundColor: 'rgba(139, 92, 246, 0.1)',
            borderRadius: '4px'
          }}></div>
        </div>
      </div>
      
      {/* Wheel scrollable */}
      <div
        ref={wheelRef}
        onScroll={handleScroll}
        style={{
          height: '300px',
          overflowY: 'scroll',
          scrollSnapType: 'y mandatory',
          cursor: disabled ? 'not-allowed' : 'grab',
          opacity: disabled ? 0.5 : 1,
          scrollbarWidth: 'none',
          msOverflowStyle: 'none',
          WebkitOverflowScrolling: 'touch'
        }}
      >
        <style>{`
          div::-webkit-scrollbar {
            display: none;
          }
        `}</style>
        
        {/* Espacement supérieur */}
        <div style={{ height: `${centerIndex * itemHeight}px` }}></div>
        
        {/* Items de durée */}
        {durations.map((duration, index) => {
          const isSelected = duration === value;
          return (
            <div
              key={duration}
              onClick={() => handleClick(duration, index)}
              style={{
                height: '60px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                scrollSnapAlign: 'center',
                color: isSelected ? '#8b5cf6' : '#9ca3af',
                transform: isSelected ? 'scale(1.1)' : 'scale(0.9)',
                transition: 'all 0.3s',
                cursor: disabled ? 'not-allowed' : 'pointer'
              }}
              onMouseEnter={(e) => {
                if (!disabled && !isSelected) {
                  e.target.style.color = '#a78bfa';
                }
              }}
              onMouseLeave={(e) => {
                if (!disabled && !isSelected) {
                  e.target.style.color = '#9ca3af';
                }
              }}
            >
              {duration} min
            </div>
          );
        })}
        
        {/* Espacement inférieur */}
        <div style={{ height: `${centerIndex * itemHeight}px` }}></div>
      </div>
    </div>
  );
}

// Composant Timer avec gestion du compte à rebours
export default function MeditationTimerController() {
  const defaultDurations = [5, 10, 15, 20, 30, 45, 60];
  const [durations, setDurations] = useState(defaultDurations);
  const [duration, setDuration] = useState(10);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customMinutes, setCustomMinutes] = useState('');
  const timerRef = useRef(null);

  // Gestion du timer
  useEffect(() => {
    if (isPlaying && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsPlaying(false);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isPlaying, timeLeft]);

  // Changement de durée
  const handleDurationChange = (newDuration) => {
    if (!isPlaying) {
      setDuration(newDuration);
      setTimeLeft(newDuration * 60);
      setIsFinished(false);
    }
  };

  // Démarrer le timer
  const handlePlay = () => {
    if (isFinished) {
      setTimeLeft(duration * 60);
      setIsFinished(false);
    }
    setIsPlaying(true);
  };

  // Mettre en pause
  const handlePause = () => {
    setIsPlaying(false);
  };

  // Arrêter et réinitialiser
  const handleStop = () => {
    setIsPlaying(false);
    setTimeLeft(duration * 60);
    setIsFinished(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  // Ajouter une durée personnalisée
  const handleAddCustomDuration = () => {
    const minutes = parseInt(customMinutes);
    if (minutes && minutes > 0 && minutes <= 180 && !durations.includes(minutes)) {
      const newDurations = [...durations, minutes].sort((a, b) => a - b);
      setDurations(newDurations);
      setDuration(minutes);
      setTimeLeft(minutes * 60);
      setCustomMinutes('');
      setShowCustomInput(false);
    }
  };

  // Supprimer une durée personnalisée
  const handleRemoveCustomDuration = (durationToRemove) => {
    if (!defaultDurations.includes(durationToRemove)) {
      const newDurations = durations.filter(d => d !== durationToRemove);
      setDurations(newDurations);
      if (duration === durationToRemove) {
        setDuration(newDurations[0] || 10);
        setTimeLeft((newDurations[0] || 10) * 60);
      }
    }
  };

  // Formatage du temps
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Calcul du pourcentage
  const progressPercent = ((duration * 60 - timeLeft) / (duration * 60)) * 100;

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(to bottom right, #faf5ff, #eff6ff)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '24px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '24px',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        padding: '32px',
        maxWidth: '448px',
        width: '100%'
      }}>
        <h1 style={{
          fontSize: '1.875rem',
          fontWeight: 'bold',
          textAlign: 'center',
          color: '#1f2937',
          marginBottom: '32px'
        }}>
          🧘 Méditation Timer
        </h1>

        {/* Wheel Picker */}
        {!isPlaying && !isFinished && (
          <div style={{ marginBottom: '32px' }}>
            <h2 style={{
              textAlign: 'center',
              color: '#4b5563',
              marginBottom: '16px',
              fontWeight: '500'
            }}>
              Sélectionnez la durée
            </h2>
            <DurationWheelPicker
              value={duration}
              onChange={handleDurationChange}
              disabled={isPlaying}
              durations={durations}
            />
            
            {/* Bouton pour ajouter une durée personnalisée */}
            {!showCustomInput ? (
              <div style={{ textAlign: 'center', marginTop: '16px' }}>
                <button
                  onClick={() => setShowCustomInput(true)}
                  style={{
                    padding: '8px 16px',
                    borderRadius: '8px',
                    fontSize: '0.875rem',
                    fontWeight: '500',
                    backgroundColor: '#e0e7ff',
                    color: '#4c51bf',
                    border: 'none',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#c7d2fe';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e0e7ff';
                  }}
                >
                  ➕ Ajouter une durée personnalisée
                </button>
              </div>
            ) : (
              <div style={{
                marginTop: '16px',
                padding: '16px',
                backgroundColor: '#f9fafb',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{
                  display: 'flex',
                  gap: '8px',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <input
                    type="number"
                    value={customMinutes}
                    onChange={(e) => setCustomMinutes(e.target.value)}
                    placeholder="Minutes (1-180)"
                    min="1"
                    max="180"
                    style={{
                      width: '120px',
                      padding: '8px 12px',
                      borderRadius: '6px',
                      border: '1px solid #d1d5db',
                      fontSize: '0.875rem'
                    }}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleAddCustomDuration();
                      }
                    }}
                  />
                  <button
                    onClick={handleAddCustomDuration}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: '#8b5cf6',
                      color: 'white',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => {
                      setShowCustomInput(false);
                      setCustomMinutes('');
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '6px',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      backgroundColor: '#e5e7eb',
                      color: '#374151',
                      border: 'none',
                      cursor: 'pointer'
                    }}
                  >
                    ✕
                  </button>
                </div>
              </div>
            )}
            
            {/* Liste des durées personnalisées avec option de suppression */}
            {durations.some(d => !defaultDurations.includes(d)) && (
              <div style={{ marginTop: '12px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.75rem', color: '#6b7280', marginBottom: '8px' }}>
                  Durées personnalisées :
                </p>
                <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', flexWrap: 'wrap' }}>
                  {durations.filter(d => !defaultDurations.includes(d)).map(d => (
                    <span
                      key={d}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '4px 8px',
                        backgroundColor: '#fef3c7',
                        color: '#92400e',
                        borderRadius: '6px',
                        fontSize: '0.75rem',
                        fontWeight: '500'
                      }}
                    >
                      {d} min
                      <button
                        onClick={() => handleRemoveCustomDuration(d)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#92400e',
                          cursor: 'pointer',
                          padding: '0',
                          fontSize: '0.875rem',
                          fontWeight: 'bold'
                        }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Affichage du temps */}
        {(isPlaying || isFinished) && (
          <div style={{ marginBottom: '32px' }}>
            <div style={{
              position: 'relative',
              width: '256px',
              height: '256px',
              margin: '0 auto'
            }}>
              {/* Cercle de progression */}
              <svg style={{
                transform: 'rotate(-90deg)',
                width: '100%',
                height: '100%'
              }}>
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                  fill="none"
                />
                <circle
                  cx="128"
                  cy="128"
                  r="120"
                  stroke={isFinished ? "#10b981" : "#8b5cf6"}
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 120}`}
                  strokeDashoffset={`${2 * Math.PI * 120 * (1 - progressPercent / 100)}`}
                  strokeLinecap="round"
                  style={{ transition: 'all 0.3s' }}
                />
              </svg>
              
              {/* Temps affiché au centre */}
              <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  fontSize: '3.75rem',
                  fontWeight: 'bold',
                  color: '#1f2937'
                }}>
                  {formatTime(timeLeft)}
                </div>
                <div style={{
                  fontSize: '0.875rem',
                  color: '#6b7280',
                  marginTop: '8px'
                }}>
                  {isFinished ? '✨ Terminé !' : `sur ${duration} min`}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Message de fin */}
        {isFinished && (
          <div style={{
            marginBottom: '24px',
            textAlign: 'center',
            backgroundColor: '#d1fae5',
            border: '2px solid #10b981',
            borderRadius: '12px',
            padding: '16px'
          }}>
            <p style={{
              color: '#047857',
              fontWeight: '600',
              fontSize: '1.125rem'
            }}>
              🎉 Session terminée ! Bien joué !
            </p>
          </div>
        )}

        {/* Boutons de contrôle */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {/* Bouton Play ou Recommencer */}
          {(!isPlaying || isFinished) && (
            <button
              onClick={handlePlay}
              style={{
                width: '100%',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: isFinished ? '#10b981' : '#8b5cf6',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.backgroundColor = isFinished ? '#059669' : '#7c3aed';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = isFinished ? '#10b981' : '#8b5cf6';
              }}
            >
              {isFinished ? '🔄 Recommencer' : '▶️ Démarrer'}
            </button>
          )}

          {/* Boutons Pause et Arrêter (visibles seulement quand en lecture) */}
          {isPlaying && !isFinished && (
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handlePause}
                style={{
                  flex: 1,
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#f97316',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.backgroundColor = '#ea580c';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = '#f97316';
                }}
              >
                ⏸️ Pause
              </button>
              
              <button
                onClick={handleStop}
                style={{
                  flex: 1,
                  padding: '16px 32px',
                  borderRadius: '12px',
                  fontSize: '1.25rem',
                  fontWeight: '600',
                  transition: 'all 0.2s',
                  border: 'none',
                  cursor: 'pointer',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  backgroundColor: '#ef4444',
                  color: 'white'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.backgroundColor = '#dc2626';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.backgroundColor = '#ef4444';
                }}
              >
                ⏹️ Arrêter
              </button>
            </div>
          )}

          {/* Indicateur d'état */}
          {isPlaying && (
            <div style={{
              textAlign: 'center',
              color: '#8b5cf6',
              fontWeight: '500',
              animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
            }}>
              🔊 Session en cours...
            </div>
          )}

          {/* Bouton Reprendre quand en pause */}
          {!isPlaying && timeLeft !== duration * 60 && timeLeft > 0 && !isFinished && (
            <button
              onClick={handlePlay}
              style={{
                width: '100%',
                padding: '16px 32px',
                borderRadius: '12px',
                fontSize: '1.25rem',
                fontWeight: '600',
                transition: 'all 0.2s',
                border: 'none',
                cursor: 'pointer',
                boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                backgroundColor: '#10b981',
                color: 'white'
              }}
              onMouseEnter={(e) => {
                e.target.style.transform = 'scale(1.05)';
                e.target.style.backgroundColor = '#059669';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'scale(1)';
                e.target.style.backgroundColor = '#10b981';
              }}
            >
              ▶️ Reprendre
            </button>
          )}

          {/* Bouton Arrêter visible aussi en pause */}
          {!isPlaying && timeLeft !== duration * 60 && timeLeft > 0 && !isFinished && (
            <button
              onClick={handleStop}
              style={{
                width: '100%',
                padding: '12px 24px',
                borderRadius: '12px',
                fontWeight: '500',
                backgroundColor: '#e5e7eb',
                color: '#374151',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.2s'
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#d1d5db';
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#e5e7eb';
              }}
            >
              ⏹️ Réinitialiser
            </button>
          )}
        </div>

        {/* Durée sélectionnée */}
        {!isPlaying && !isFinished && (
          <div style={{
            marginTop: '24px',
            textAlign: 'center',
            padding: '12px',
            backgroundColor: '#f3f4f6',
            borderRadius: '8px'
          }}>
            <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '4px' }}>Durée sélectionnée</p>
            <p style={{ fontSize: '1.25rem', fontWeight: '600', color: '#1f2937' }}>
              {duration} minutes
            </p>
          </div>
        )}
      </div>
    </div>
  );
}