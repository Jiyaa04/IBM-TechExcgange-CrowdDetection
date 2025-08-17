import React, { useRef, useState } from 'react';
import { Upload, Video, Check } from 'lucide-react';
import { useWebSocket } from '../contexts/WebSocketContext';

interface VideoUploadProps {
  onVideoUploaded: () => void;
}

const VideoUpload: React.FC<VideoUploadProps> = ({ onVideoUploaded }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const { startAnalysis } = useWebSocket();

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    } else {
      alert('Please select a valid video file.');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;

    setUploading(true);
    
    // Simulate upload process
    setTimeout(() => {
      startAnalysis(selectedFile);
      setUploading(false);
      onVideoUploaded();
    }, 2000);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {!selectedFile ? (
        <div
          className="border-2 border-dashed border-slate-600 rounded-lg p-12 text-center hover:border-blue-400 transition-colors cursor-pointer"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onClick={() => fileInputRef.current?.click()}
        >
          <Upload className="h-16 w-16 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-white mb-2">Upload Crowd Video</h3>
          <p className="text-slate-400 mb-4">
            Drag and drop your video file here, or click to browse
          </p>
          <p className="text-sm text-slate-500">
            Supports MP4, MOV, AVI formats • Max file size: 500MB
          </p>
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileSelect}
            className="hidden"
          />
        </div>
      ) : (
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <div className="flex items-center space-x-4 mb-4">
            <Video className="h-8 w-8 text-blue-400" />
            <div>
              <h3 className="text-lg font-semibold text-white">{selectedFile.name}</h3>
              <p className="text-slate-400">{(selectedFile.size / (1024 * 1024)).toFixed(1)} MB</p>
            </div>
            <Check className="h-6 w-6 text-green-400 ml-auto" />
          </div>
          <div className="flex space-x-4">
            <button
              onClick={() => setSelectedFile(null)}
              className="px-4 py-2 bg-slate-700 text-white rounded-lg hover:bg-slate-600 transition-colors"
            >
              Change File
            </button>
            <button
              onClick={handleUpload}
              disabled={uploading}
              className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {uploading ? 'Analyzing...' : 'Start Analysis'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VideoUpload;