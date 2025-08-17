import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

interface RiskData {
  current: {
    level: string;
    category: string;
    confidence: number;
    detections: number;
  };
  predictions: {
    next10min: { level: string; category: string; confidence: number };
    next30min: { level: string; category: string; confidence: number };
  };
}

interface SafetyActions {
  actions: string[];
  officers: { id: string; position: [number, number]; status: string }[];
  barricades: { id: string; position: [number, number]; status: string }[];
  medical: { id: string; position: [number, number]; status: string }[];
}

interface WebSocketContextType {
  riskData: RiskData | null;
  safetyActions: SafetyActions | null;
  isConnected: boolean;
  startAnalysis: (videoFile: File) => void;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(undefined);

export const useWebSocket = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
};

interface WebSocketProviderProps {
  children: ReactNode;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({ children }) => {
  const [riskData, setRiskData] = useState<RiskData | null>(null);
  const [safetyActions, setSafetyActions] = useState<SafetyActions | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  // Simulate WebSocket connection with mock data
  const startAnalysis = (videoFile: File) => {
    setIsConnected(true);
    
    // Simulate real-time updates
    const interval = setInterval(() => {
      const riskLevels = [
        { level: 'good', category: 'Good to go / Well managed / Low crowd', confidence: 0.95 },
        { level: 'moderate', category: 'Moderate crowd but no danger', confidence: 0.88 },
        { level: 'overcrowd', category: 'Overcrowd / Very much crowded / Attention needed', confidence: 0.82 },
        { level: 'stampede', category: 'Stampede / Red alert / Very much attention needed', confidence: 0.91 }
      ];
      
      const currentRisk = riskLevels[Math.floor(Math.random() * riskLevels.length)];
      const detections = Math.floor(Math.random() * 200) + 50;
      
      setRiskData({
        current: {
          ...currentRisk,
          detections
        },
        predictions: {
          next10min: riskLevels[Math.min(riskLevels.length - 1, riskLevels.findIndex(r => r.level === currentRisk.level) + Math.floor(Math.random() * 2))],
          next30min: riskLevels[Math.floor(Math.random() * riskLevels.length)]
        }
      });

      // Update safety actions based on risk level
      const officers = Array.from({ length: 5 }, (_, i) => ({
        id: `officer-${i}`,
        position: [28.6139 + (Math.random() - 0.5) * 0.01, 77.2090 + (Math.random() - 0.5) * 0.01] as [number, number],
        status: currentRisk.level === 'good' ? 'patrol' : currentRisk.level === 'moderate' ? 'monitoring' : 'deployed'
      }));

      const barricades = Array.from({ length: 3 }, (_, i) => ({
        id: `barricade-${i}`,
        position: [28.6145 + (Math.random() - 0.5) * 0.008, 77.2095 + (Math.random() - 0.5) * 0.008] as [number, number],
        status: ['overcrowd', 'stampede'].includes(currentRisk.level) ? 'closed' : 'open'
      }));

      const medical = Array.from({ length: 2 }, (_, i) => ({
        id: `medical-${i}`,
        position: [28.6142 + (Math.random() - 0.5) * 0.006, 77.2088 + (Math.random() - 0.5) * 0.006] as [number, number],
        status: currentRisk.level === 'stampede' ? 'active' : 'standby'
      }));

      let actions: string[] = [];
      switch (currentRisk.level) {
        case 'good':
          actions = ['Monitoring active', 'Regular patrol schedule'];
          break;
        case 'moderate':
          actions = ['Increased monitoring', 'Officer presence enhanced'];
          break;
        case 'overcrowd':
          actions = ['Deploy more officers', 'Control entry flow', 'Activate crowd control measures'];
          break;
        case 'stampede':
          actions = ['EMERGENCY: Close nearby barricades', 'Call medical team', 'Re-route crowd', 'Establish emergency corridors'];
          break;
      }

      setSafetyActions({
        actions,
        officers,
        barricades,
        medical
      });
    }, 2000);

    // Clean up interval after 30 seconds for demo
    setTimeout(() => {
      clearInterval(interval);
      setIsConnected(false);
    }, 30000);
  };

  return (
    <WebSocketContext.Provider value={{ riskData, safetyActions, isConnected, startAnalysis }}>
      {children}
    </WebSocketContext.Provider>
  );
};