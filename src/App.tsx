import TrackPlayer from './components/TrackPlayer';
import { Music } from 'lucide-react';
import './ios-fixes.css';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-gray-50 to-white">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-sm border-b border-gray-200/50">
        <div className="flex items-center justify-center p-4 max-w-md mx-auto">
          <h1 className="text-lg text-center font-bold text-gray-900">Dual Player</h1>
          <span className="ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-sm uppercase tracking-wide">
            Beta
          </span>
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

        </div>
      </div>
    </div>
  );
}

export default App;