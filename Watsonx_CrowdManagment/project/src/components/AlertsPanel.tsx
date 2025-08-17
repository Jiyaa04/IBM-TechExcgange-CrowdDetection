import React from 'react';
import { AlertTriangle, Info, X } from 'lucide-react';

interface Alert {
  id: string;
  type: 'emergency' | 'warning' | 'info';
  message: string;
  timestamp: Date;
}

interface AlertsPanelProps {
  alerts: Alert[];
}

const AlertsPanel: React.FC<AlertsPanelProps> = ({ alerts }) => {
  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'emergency': return <AlertTriangle className="h-4 w-4" />;
      case 'warning': return <AlertTriangle className="h-4 w-4" />;
      default: return <Info className="h-4 w-4" />;
    }
  };

  const getAlertStyle = (type: string) => {
    switch (type) {
      case 'emergency': return 'bg-red-500/20 border-red-500/30 text-red-400';
      case 'warning': return 'bg-orange-500/20 border-orange-500/30 text-orange-400';
      default: return 'bg-blue-500/20 border-blue-500/30 text-blue-400';
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg p-4 border border-slate-700">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">Live Alerts</h3>
        <div className="text-xs text-slate-400">{alerts.length} active</div>
      </div>

      {alerts.length === 0 ? (
        <div className="text-center py-6">
          <Info className="h-8 w-8 text-slate-600 mx-auto mb-2" />
          <p className="text-slate-400 text-sm">No active alerts</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {alerts.map((alert) => (
            <div
              key={alert.id}
              className={`p-3 rounded-lg border ${getAlertStyle(alert.type)} animate-pulse`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-2">
                  {getAlertIcon(alert.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{alert.message}</p>
                    <p className="text-xs opacity-75 mt-1">
                      {alert.timestamp.toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AlertsPanel;