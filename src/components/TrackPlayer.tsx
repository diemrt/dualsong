import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Upload, SkipBack, SkipForward } from 'lucide-react';

interface TrackPlayerProps {
  trackNumber: number;
  trackColor: string;
}

const TrackPlayer: React.FC<TrackPlayerProps> = ({ trackNumber, trackColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('Unknown Artist');
  const [isLoading, setIsLoading] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  const [hasTrack, setHasTrack] = useState(false);
  
  const audioRef = useRef<HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => setCurrentTime(audio.currentTime);
    const updateDuration = () => setDuration(audio.duration);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener('timeupdate', updateTime);
    audio.addEventListener('loadedmetadata', updateDuration);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateTime);
      audio.removeEventListener('loadedmetadata', updateDuration);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      // iOS requires user interaction for audio playback
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Audio started successfully
            console.log('Audio playback started');
          })
          .catch((error) => {
            console.error('Audio playback failed:', error);
            // Handle autoplay policy restrictions
            if (error.name === 'NotAllowedError') {
              alert('Il browser ha bloccato la riproduzione automatica. Premi play per avviare l\'audio.');
            }
          });
      }
    }
    setIsPlaying(!isPlaying);
  };

  const handleSkipBack = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    setCurrentTime(0);
  };

  const handleSkipForward = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = Math.min(audioRef.current.currentTime + 10, duration);
  };

  /*const handleSeek = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };*/

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Check if file type is supported
      const supportedTypes = ['audio/mpeg', 'audio/wav', 'audio/mp3', 'audio/m4a', 'audio/aac', 'audio/ogg', 'audio/flac'];
      const isSupported = supportedTypes.some(type => file.type.includes(type.split('/')[1])) || 
                          file.name.match(/\.(mp3|wav|m4a|aac|ogg|flac)$/i);
      
      if (!isSupported) {
        alert('Formato file non supportato. Usa MP3, WAV, M4A, AAC, OGG o FLAC.');
        return;
      }

      const url = URL.createObjectURL(file);
      setTrackName(file.name.replace(/\.[^/.]+$/, ""));
      setArtistName('Local File');
      setIsLoading(true);
      setHasTrack(true);
      
      if (audioRef.current) {
        // Stop current audio if playing
        if (isPlaying) {
          audioRef.current.pause();
          setIsPlaying(false);
        }
        
        audioRef.current.src = url;
        audioRef.current.load();
        
        // Enhanced loading handlers for iOS
        audioRef.current.onloadeddata = () => {
          setIsLoading(false);
          console.log('Audio loaded successfully');
        };
        
        audioRef.current.onerror = (e) => {
          console.error('Audio loading error:', e);
          setIsLoading(false);
          alert('Errore nel caricamento del file audio');
        };
      }
      
      // Reset file input for iOS compatibility
      event.target.value = '';
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="w-full max-w-sm mx-auto">
      <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-xl rounded-3xl overflow-hidden">
        <CardContent className="p-0">
          {/* Input Section */}
          <div className="px-6 pt-6 pb-4">
            <input
              type="file"
              accept="audio/mpeg,audio/wav,audio/mp3,audio/m4a,audio/aac,audio/ogg,audio/flac,.mp3,.wav,.m4a,.aac,.ogg,.flac"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              capture={false}
            />
            <Button
              onClick={() => fileInputRef.current?.click()}
              variant="outline"
              className="w-full truncate rounded-full border-gray-200 bg-gray-50/50 hover:bg-gray-100/50 touch-manipulation"
              disabled={isLoading}
              style={{ 
                overflow: 'hidden', 
                background: 'white', 
                paddingLeft: 0, 
                paddingRight: 0,
                WebkitTapHighlightColor: 'transparent'
              }}
            >
              <span
              className="relative flex items-center justify-center mr-2"
              style={{ minWidth: '1.5rem', minHeight: '1.5rem' }}
              >
              <span
                className="absolute inset-0 rounded-full"
                style={{
                background: 'white',
                zIndex: 1,
                width: '1.5rem',
                height: '1.5rem',
                boxShadow: '0 0 0 2px #fff',
                }}
              />
              <Upload className="w-4 h-4 relative z-10 text-gray-900" />
              </span>
              <span
              className="inline-block"
              style={{
                display: 'inline-block',
                whiteSpace: 'nowrap',
                animation: trackName
                ? 'scroll-text 8s linear infinite'
                : undefined,
                minWidth: 0,
                maxWidth: '100%',
                background: 'white',
                paddingLeft: '0.5rem',
                paddingRight: '0.5rem',
              }}
              >
              {trackName || 'Choose Audio File'}
              </span>
              <style>
              {`
                @keyframes scroll-text {
                0% { transform: translateX(0%); }
                10% { transform: translateX(0%); }
                90% { transform: translateX(calc(-100% + 100px)); }
                100% { transform: translateX(calc(-100% + 100px)); }
                }
              `}
              </style>
            </Button>
          </div>

          {/* Album Art */}
          <div className="px-6 pb-6">
            <div className={`w-full aspect-square rounded-2xl ${trackColor} flex items-center justify-center relative overflow-hidden shadow-lg`}>
              {isLoading ? (
                <div className="text-white/80 text-sm font-medium animate-pulse">
                  Loading...
                </div>
              ) : (
                <div className="text-center text-white p-4">
                  <div className="text-lg font-bold mb-1">
                    {trackName || `Track ${trackNumber}`}
                  </div>
                  <div className="text-sm opacity-80">
                    {artistName}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Track Info */}
          <div className="px-6 pb-4 text-center">
            <h3 className="text-xl font-bold text-gray-900 mb-1 truncate">
              {trackName || `Track ${trackNumber}`}
            </h3>
            <p className="text-gray-500 text-sm">
              {artistName}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="px-6 pb-4">
            <div className="relative">
              {/* Custom Progress Bar */}
              <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gray-900 transition-all duration-300 ease-out"
                  style={{ width: `${progressPercentage}%` }}
                />
              </div>
              
              {/* Time Labels */}
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
          </div>

          {/* Controls */}
          <div className="px-6 pb-6">
            <div className="flex items-center justify-center gap-6">
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-12 w-12 p-0 hover:bg-gray-100 touch-manipulation no-highlight"
                onClick={handleSkipBack}
                disabled={!hasTrack || isLoading}
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                size="lg"
                className="rounded-full h-16 w-16 p-0 bg-gray-900 hover:bg-gray-800 shadow-lg touch-manipulation no-highlight"
                disabled={!hasTrack || isLoading}
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-12 w-12 p-0 hover:bg-gray-100 touch-manipulation no-highlight"
                onClick={handleSkipForward}
                disabled={!hasTrack || isLoading}
              >
                <SkipForward className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Volume Control */}
          <div className="px-6 pb-6">
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowVolumeControl(!showVolumeControl)}
                className="rounded-full h-8 w-8 p-0 touch-manipulation no-highlight"
              >
                <Volume2 className="w-4 h-4" />
              </Button>
              
              {showVolumeControl && (
                <div className="flex-1 flex items-center gap-2">
                  <Slider
                    value={[volume]}
                    max={100}
                    step={1}
                    onValueChange={(value) => setVolume(value[0])}
                    className="flex-1"
                  />
                  <span className="text-xs text-gray-500 w-8 text-right">{volume}</span>
                </div>
              )}
            </div>
          </div>

          <audio 
            ref={audioRef} 
            preload="metadata" 
            playsInline 
            crossOrigin="anonymous"
            style={{ display: 'none' }}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackPlayer;