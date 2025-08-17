import React from 'react';
import { useNavigate } from 'react-router-dom';
import VideoUpload from '../components/VideoUpload';
import { Shield, Activity, MapPin, Users } from 'lucide-react';

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="bg-slate-800/50 backdrop-blur-sm border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-3">
              <Shield className="h-8 w-8 text-blue-400" />
              <h1 className="text-xl font-bold text-white">AI Crowd Risk Predictor</h1>
            </div>
            <div className="text-sm text-slate-400">Emergency Response System</div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            Real-Time Crowd Analysis & Risk Prediction
          </h2>
          <p className="text-xl text-slate-300 mb-12 max-w-3xl mx-auto">
            Advanced AI-powered system for proactive crowd management, safety predictions, and emergency response coordination
          </p>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <Activity className="h-12 w-12 text-green-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Real-Time Analysis</h3>
              <p className="text-slate-400">YOLO-powered crowd detection with instant risk assessment</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <Users className="h-12 w-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Predictive Analytics</h3>
              <p className="text-slate-400">10-minute and 30-minute crowd behavior forecasting</p>
            </div>
            <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700">
              <MapPin className="h-12 w-12 text-orange-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-white mb-2">Proactive Response</h3>
              <p className="text-slate-400">Automated safety measures and resource deployment</p>
            </div>
          </div>

          {/* Video Upload Section */}
          <div className="bg-slate-800/30 backdrop-blur-sm rounded-xl p-8 border border-slate-700">
            <h3 className="text-2xl font-semibold text-white mb-6">Upload Crowd Video for Analysis</h3>
            <VideoUpload onVideoUploaded={() => navigate('/dashboard')} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;