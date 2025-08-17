import React from 'react';
import { useWebSocket } from '../contexts/WebSocketContext';
import { Settings, CheckCircle, AlertCircle, Zap } from 'lucide-react';

const ActionsPanel: React.FC = () => {
  const { safetyActions, riskData } = useWebSocket();

  const getActionIcon = (action: string) => {
    if (action.includes('EMERGENCY') || action.includes('medical')) {
      return <AlertCircle className="h-4 w-4 text-red-400" />;
    } else if (action.includes('Deploy') || action.includes('Control')) {
      return <Zap className="h-4 w-4 text-orange-400" />;
    } else {
      return <CheckCircle className="h-4 w-4 text-green-400" />;
    }
  };

  const getActionPriority = (action: string) => {
    if (action.includes('EMERGENCY')) return 'critical';
    if (action.includes('Deploy') || action.includes('Control')) return 'high';
    return 'normal';
  };

  const getPriorityStyle = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'high': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      default: return 'bg-green-500/20 border-green-500/30 text-green-400';
    }
  };

  if (!safetyActions) {
    return (
      <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-4">Safety Actions</h3>
        <div className="text-center py-8">
          <Settings className="h-12 w-12 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400">No actions required</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-white">Proactive Safety Measures</h3>
        <div className="text-sm text-slate-400">
          {safetyActions.actions.length} active measures
        </div>
      </div>

      {/* Action Items */}
      <div className="space-y-3 mb-6">
        {safetyActions.actions.map((action, index) => {
          const priority = getActionPriority(action);
          return (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getPriorityStyle(priority)} transition-all hover:scale-[1.02]`}
            >
              <div className="flex items-start space-x-3">
                {getActionIcon(action)}
                <div className="flex-1">
                  <div className="font-medium">{action}</div>
                  {priority === 'critical' && (
                    <div className="text-xs mt-1 opacity-80">Immediate response required</div>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Resource Status */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Officers</div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              safetyActions.officers.some(o => o.status === 'deployed') ? 'bg-orange-400' : 'bg-green-400'
            }`}></div>
            <span className="text-sm font-semibold text-white">
              {safetyActions.officers.length} Active
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Barricades</div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              safetyActions.barricades.some(b => b.status === 'closed') ? 'bg-red-400' : 'bg-green-400'
            }`}></div>
            <span className="text-sm font-semibold text-white">
              {safetyActions.barricades.filter(b => b.status === 'closed').length} Closed
            </span>
          </div>
        </div>
        
        <div className="bg-slate-700/50 rounded-lg p-3">
          <div className="text-xs text-slate-400 mb-1">Medical</div>
          <div className="flex items-center space-x-2">
            <div className={`w-2 h-2 rounded-full ${
              safetyActions.medical.some(m => m.status === 'active') ? 'bg-red-400' : 'bg-blue-400'
            }`}></div>
            <span className="text-sm font-semibold text-white">
              {safetyActions.medical.length} Units
            </span>
          </div>
        </div>
      </div>

      {/* Emergency Protocol */}
      {riskData && riskData.current.level === 'stampede' && (
        <div className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <div className="flex items-center space-x-2 mb-2">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <span className="font-semibold text-red-400">Emergency Protocol Active</span>
          </div>
          <p className="text-sm text-red-300">
            All emergency services have been notified. Evacuation procedures may be initiated.
          </p>
        </div>
      )}
    </div>
  );
};

export default ActionsPanel;