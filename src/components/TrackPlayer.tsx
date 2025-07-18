import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Play, Pause, Volume2, Upload, Link, SkipBack, SkipForward, MoreHorizontal } from 'lucide-react';

interface TrackPlayerProps {
  trackNumber: number;
  trackColor: string;
}

const TrackPlayer: React.FC<TrackPlayerProps> = ({ trackNumber, trackColor }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(70);
  const [trackUrl, setTrackUrl] = useState('');
  const [trackName, setTrackName] = useState('');
  const [artistName, setArtistName] = useState('Unknown Artist');
  const [inputType, setInputType] = useState<'url' | 'file'>('url');
  const [isLoading, setIsLoading] = useState(false);
  const [showVolumeControl, setShowVolumeControl] = useState(false);
  
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
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
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
      const url = URL.createObjectURL(file);
      setTrackUrl(url);
      setTrackName(file.name.replace(/\.[^/.]+$/, ""));
      setArtistName('Local File');
      setIsLoading(true);
      
      if (audioRef.current) {
        audioRef.current.src = url;
        audioRef.current.load();
        audioRef.current.onloadeddata = () => setIsLoading(false);
      }
    }
  };

  const handleUrlSubmit = () => {
    if (!trackUrl.trim()) return;
    
    setIsLoading(true);
    
    // Extract YouTube video ID and create a proxy URL
    const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(.{11})/;
    const match = trackUrl.match(youtubeRegex);
    
    if (match) {
      // For demo purposes, we'll use a placeholder audio URL
      // In production, you'd need a YouTube to audio conversion service
      setTrackName(`YouTube Track ${match[1]}`);
      setArtistName('YouTube');
      alert('YouTube integration requires a backend service. For demo, please use a direct audio URL (.mp3, .wav, etc.)');
      setIsLoading(false);
      return;
    }
    
    // Handle direct audio URLs
    if (audioRef.current) {
      audioRef.current.src = trackUrl;
      audioRef.current.load();
      audioRef.current.onloadeddata = () => {
        setIsLoading(false);
        const fileName = trackUrl.split('/').pop() || `Track ${trackNumber}`;
        setTrackName(fileName.replace(/\.[^/.]+$/, ""));
        setArtistName('Web Audio');
      };
      audioRef.current.onerror = () => {
        setIsLoading(false);
        alert('Failed to load audio. Please check the URL.');
      };
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
          {/* Header */}
          <div className="flex items-center justify-between p-6 pb-4">
            <div className="flex gap-3">
              <Button
                variant={inputType === 'url' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInputType('url')}
                className="rounded-full h-8 w-8 p-0"
              >
                <Link className="w-4 h-4" />
              </Button>
              <Button
                variant={inputType === 'file' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setInputType('file')}
                className="rounded-full h-8 w-8 p-0"
              >
                <Upload className="w-4 h-4" />
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="rounded-full h-8 w-8 p-0">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </div>

          {/* Input Section */}
          <div className="px-6 pb-4">
            {inputType === 'url' ? (
              <div className="flex gap-2">
                <Input
                  placeholder="Enter YouTube URL or audio link"
                  value={trackUrl}
                  onChange={(e) => setTrackUrl(e.target.value)}
                  className="flex-1 rounded-full border-gray-200 bg-gray-50/50"
                />
                <Button 
                  onClick={handleUrlSubmit} 
                  disabled={isLoading}
                  className="rounded-full px-6"
                >
                  Load
                </Button>
              </div>
            ) : (
              <div>
                <input
                  type="file"
                  accept="audio/*"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  className="hidden"
                />
                <Button
                  onClick={() => fileInputRef.current?.click()}
                  variant="outline"
                  className="w-full rounded-full border-gray-200 bg-gray-50/50 hover:bg-gray-100/50"
                  disabled={isLoading}
                >
                  <Upload className="w-4 h-4 mr-2" />
                  {trackName || 'Choose Audio File'}
                </Button>
              </div>
            )}
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
                className="rounded-full h-12 w-12 p-0 hover:bg-gray-100"
              >
                <SkipBack className="w-5 h-5" />
              </Button>
              
              <Button
                onClick={togglePlayPause}
                size="lg"
                className="rounded-full h-16 w-16 p-0 bg-gray-900 hover:bg-gray-800 shadow-lg"
                disabled={!trackUrl || isLoading}
              >
                {isPlaying ? <Pause className="w-7 h-7" /> : <Play className="w-7 h-7 ml-1" />}
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="rounded-full h-12 w-12 p-0 hover:bg-gray-100"
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
                className="rounded-full h-8 w-8 p-0"
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

          <audio ref={audioRef} preload="metadata" />
        </CardContent>
      </Card>
    </div>
  );
};

export default TrackPlayer;