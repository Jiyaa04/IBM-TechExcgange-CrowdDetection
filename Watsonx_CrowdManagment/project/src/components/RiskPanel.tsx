import React from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { AlertTriangle, Shield, Users, TrendingUp } from 'lucide-react';

const RiskPanel: React.FC = () => {
  const { riskData } = useWebSocket();

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'good': return 'text-green-400 bg-green-400/20 border-green-400/30';
      case 'moderate': return 'text-yellow-400 bg-yellow-400/20 border-yellow-400/30';
      case 'overcrowd': return 'text-orange-400 bg-orange-400/20 border-orange-400/30';
      case 'stampede': return 'text-red-400 bg-red-400/20 border-red-400/30';
      default: return 'text-slate-400 bg-slate-400/20 border-slate-400/30';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'good': return <Shield className="h-6 w-6" />;
      case 'moderate': return <Users className="h-6 w-6" />;
      case 'overcrowd':
      case 'stampede': return <AlertTriangle className="h-6 w-6" />;
      default: return <Shield className="h-6 w-6" />;
    }
  };

  if (!riskData) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Risk Analysis</h3>
        <div className="text-center py-8">
          <div className="animate-pulse">
            <div className="h-4 bg-slate-700 rounded w-3/4 mx-auto mb-2"></div>
            <div className="h-4 bg-slate-700 rounded w-1/2 mx-auto"></div>
          </div>
          <p className="text-slate-400 mt-4">Waiting for analysis...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <h3 className="text-lg font-semibold text-white mb-6">Risk Analysis</h3>
      
      {/* Current Risk */}
      <div className="mb-6">
        <div className="flex items-center space-x-3 mb-3">
          <div className={`p-2 rounded-lg border ${getRiskColor(riskData.current.level)}`}>
            {getRiskIcon(riskData.current.level)}
          </div>
          <div>
            <h4 className="font-semibold text-white">Current Status</h4>
            <p className="text-sm text-slate-400">Real-time assessment</p>
          </div>
        </div>
        <div className={`p-4 rounded-lg border ${getRiskColor(riskData.current.level)}`}>
          <div className="font-semibold text-lg mb-2">{riskData.current.category}</div>
          <div className="text-sm opacity-80">
            Confidence: {(riskData.current.confidence * 100).toFixed(1)}% • 
            Detections: {riskData.current.detections}
          </div>
        </div>
      </div>

      {/* Predictions */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2 mb-3">
          <TrendingUp className="h-5 w-5 text-blue-400" />
          <h4 className="font-semibold text-white">Predictions</h4>
        </div>
        
        {/* 10-minute prediction */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Next 10 minutes</span>
            <span className={`text-sm px-2 py-1 rounded ${getRiskColor(riskData.predictions.next10min.level).replace('bg-', 'bg-').replace('/20', '/30')}`}>
              {(riskData.predictions.next10min.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className={`text-sm ${getRiskColor(riskData.predictions.next10min.level).split(' ')[0]}`}>
            {riskData.predictions.next10min.category}
          </div>
        </div>

        {/* 30-minute prediction */}
        <div className="bg-slate-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-slate-300">Next 30 minutes</span>
            <span className={`text-sm px-2 py-1 rounded ${getRiskColor(riskData.predictions.next30min.level).replace('bg-', 'bg-').replace('/20', '/30')}`}>
              {(riskData.predictions.next30min.confidence * 100).toFixed(0)}%
            </span>
          </div>
          <div className={`text-sm ${getRiskColor(riskData.predictions.next30min.level).split(' ')[0]}`}>
            {riskData.predictions.next30min.category}
          </div>
        </div>
      </div>

      {/* Risk Trend Chart */}
      <div className="mt-6 p-4 bg-slate-700/30 rounded-lg">
        <div className="text-sm text-slate-400 mb-2">Risk Trend</div>
        <div className="h-16 bg-slate-900/50 rounded flex items-end justify-center space-x-2 p-2">
          {Array.from({ length: 12 }, (_, i) => (
            <div
              key={i}
              className={`w-2 rounded-t ${
                i < 4 ? 'bg-green-400' : i < 8 ? 'bg-yellow-400' : 'bg-orange-400'
              }`}
              style={{ height: `${Math.random() * 100 + 20}%` }}
            ></div>
          ))}
        </div>
      </div>

      {/* Watsonx Attribution */}
      <div className="mt-6 text-xs text-center text-slate-500 italic">
        Fetched by <span className="text-blue-400">watsonx</span> using IBM Cloud by <span className="font-semibold text-white">watsonx AI</span>
      </div>
    </div>
  );
};

export default RiskPanel;
