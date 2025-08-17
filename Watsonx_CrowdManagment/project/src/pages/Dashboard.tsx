import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import VideoPlayer from '../components/VideoPlayer';
import RiskPanel from '../components/RiskPanel';
import ActionsPanel from '../components/ActionsPanel';
import MapPanel from '../components/MapPanel';
import AlertsPanel from '../components/AlertsPanel';
import { useWebSocket } from '../contexts/WebSocketContext';
import { ArrowLeft, Shield, Activity } from 'lucide-react';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { riskData, safetyActions, isConnected } = useWebSocket();
  const [alerts, setAlerts] = useState<
    Array<{ id: string; type: string; message: string; timestamp: Date }>
  >([]);

  useEffect(() => {
    if (riskData && ['overcrowd', 'stampede'].includes(riskData.current.level)) {
      const newAlert = {
        id: Date.now().toString(),
        type: riskData.current.level === 'stampede' ? 'emergency' : 'warning',
        message:
          riskData.current.level === 'stampede'
            ? 'EMERGENCY: Stampede risk detected! Immediate action required.'
            : 'WARNING: Overcrowding detected. Increased monitoring recommended.',
        timestamp: new Date(),
      };
      setAlerts((prev) => [newAlert, ...prev.slice(0, 4)]);
    }
  }, [riskData]);

  return (
    <div className="min-h-screen flex flex-col bg-[#0b1622] text-white">
      {/* Header */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 text-slate-300 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
                <span>Back</span>
              </button>
              <div className="flex items-center space-x-3">
                <Shield className="h-6 w-6 text-blue-400" />
                <h1 className="text-lg font-bold text-white">
                  Crowd Risk Dashboard
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Activity
                  className={`h-4 w-4 ${
                    isConnected ? 'text-green-400' : 'text-red-400'
                  }`}
                />
                <span
                  className={`text-sm ${
                    isConnected ? 'text-green-400' : 'text-red-400'
                  }`}
                >
                  {isConnected ? 'Live Analysis' : 'Disconnected'}
                </span>
              </div>
              <div className="text-sm text-slate-400">
                {new Date().toLocaleTimeString()}
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Dashboard */}
      <div className="flex-1 max-w-full px-4 sm:px-6 lg:px-8 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 h-full">
          {/* Left Column - Video and Alerts */}
          <div className="xl:col-span-1 space-y-6">
            <VideoPlayer />
            <AlertsPanel alerts={alerts} />
          </div>

          {/* Middle Column - Risk Analysis */}
          <div className="xl:col-span-1 space-y-6">
            <RiskPanel />
            <ActionsPanel />
          </div>

          {/* Right Column - Map */}
          <div className="xl:col-span-1">
            <MapPanel />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
