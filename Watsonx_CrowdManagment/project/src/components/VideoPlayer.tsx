import React, { useEffect, useState } from 'react';
import { Play, Pause, Volume2, Maximize } from 'lucide-react';

const VideoPlayer: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentTime, setCurrentTime] = useState(0);
  const [detections, setDetections] = useState<Array<{ id: string; x: number; y: number; width: number; height: number }>>([]);

  // Simulate video playback and detections
  useEffect(() => {
    const interval = setInterval(() => {
      if (isPlaying) {
        setCurrentTime(prev => (prev + 0.1) % 100);
        
        // Generate random bounding boxes for crowd detection simulation
        const newDetections = Array.from({ length: Math.floor(Math.random() * 15) + 5 }, (_, i) => ({
          id: `detection-${i}`,
          x: Math.random() * 80 + 10, // 10-90% of width
          y: Math.random() * 60 + 20, // 20-80% of height
          width: Math.random() * 8 + 4, // 4-12% of width
          height: Math.random() * 12 + 8, // 8-20% of height
        }));
        setDetections(newDetections);
      }
    }, 100);

    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Crowd Analysis</h3>
        <div className="text-sm text-slate-400">YOLO Detection Active</div>
      </div>
      
      {/* Video Container with Overlay */}
      <div className="relative bg-slate-900 rounded-lg overflow-hidden aspect-video">
        {/* Simulated Video Background */}
        <div className="w-full h-full bg-gradient-to-br from-blue-900 via-slate-800 to-green-900 opacity-60"></div>
        
        {/* Detection Overlays */}
        {detections.map((detection) => (
          <div
            key={detection.id}
            className="absolute border-2 border-red-400 bg-red-400/10"
            style={{
              left: `${detection.x}%`,
              top: `${detection.y}%`,
              width: `${detection.width}%`,
              height: `${detection.height}%`,
            }}
          >
            <div className="absolute -top-6 left-0 text-xs bg-red-500 text-white px-1 rounded">
              Person
            </div>
          </div>
        ))}
        
        {/* Video Controls */}
        <div className="absolute bottom-4 left-4 right-4">
          <div className="bg-slate-900/80 backdrop-blur-sm rounded-lg p-3">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="text-white hover:text-blue-400 transition-colors"
              >
                {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
              </button>
              <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 transition-all duration-100"
                  style={{ width: `${currentTime}%` }}
                ></div>
              </div>
              <div className="flex items-center space-x-2">
                <Volume2 className="h-4 w-4 text-slate-400" />
                <Maximize className="h-4 w-4 text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        
        {/* Detection Counter */}
        <div className="absolute top-4 right-4 bg-slate-900/80 backdrop-blur-sm rounded-lg px-3 py-2">
          <div className="text-sm text-white">
            Detected: <span className="font-bold text-green-400">{detections.length}</span> persons
          </div>
        </div>
      </div>
      
      {/* Analysis Info */}
      <div className="mt-4 grid grid-cols-2 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-sm text-slate-400">Detection Model</div>
          <div className="text-white font-semibold">YOLOv8</div>
        </div>
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-sm text-slate-400">Confidence</div>
          <div className="text-white font-semibold">94.2%</div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;