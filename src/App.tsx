import TrackPlayer from './components/TrackPlayer';
import { Music, ArrowLeft, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center justify-between p-4 max-w-md mx-auto">
          <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0">
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-lg font-semibold text-gray-900">Dual Player</h1>
          <Button variant="ghost" size="sm" className="rounded-full h-10 w-10 p-0">
            <Search className="w-5 h-5" />
          </Button>
        </div>
      </div>

      <div className="max-w-md mx-auto px-4 py-6">
        {/* Main Content */}
        <div className="space-y-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Music className="w-6 h-6 text-gray-700" />
              <h2 className="text-2xl font-bold text-gray-900">Now Playing</h2>
            </div>
            <p className="text-gray-600 text-sm">Play two tracks simultaneously</p>
          </div>

          <div className="space-y-6">
            <TrackPlayer trackNumber={1} trackColor="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500" />
            <TrackPlayer trackNumber={2} trackColor="bg-gradient-to-br from-orange-500 via-red-500 to-pink-500" />
          </div>

          {/* Instructions */}
          <div className="bg-white/60 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/50">
            <h3 className="text-lg font-semibold mb-3 text-gray-900">How to Use</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Choose URL or file upload for each track</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Enter YouTube URLs or direct audio links</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Upload local audio files (MP3, WAV, etc.)</span>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mt-2 flex-shrink-0"></div>
                <span>Control volume and playback independently</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;