import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle } from 'react-leaflet';
import { useWebSocket } from '../contexts/WebSocketContext';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom icons
const officerIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#3B82F6">
      <path d="M12 2a5 5 0 1 0 5 5 5 5 0 0 0-5-5zM12 14.5c-3.86 0-7 1.79-7 4v1.5h14V18.5c0-2.21-3.14-4-7-4z"/>
    </svg>
  `),
  iconSize: [30, 30],
  iconAnchor: [15, 30],
});

const barricadeIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64,' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F97316">
      <path d="M2 12h20v2H2zm0 4h20v2H2zm0-8h20v2H2z"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const medicalIcon = new L.Icon({
  iconUrl: 'data:image/svg+xml;base64=' + btoa(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981">
      <path d="M12 2L2 7v10c0 5.55 3.84 9.74 9 11 5.16-1.26 9-5.45 9-11V7l-10-5z"/>
      <path d="M11 8h2v3h3v2h-3v3h-2v-3H8v-2h3V8z" fill="white"/>
    </svg>
  `),
  iconSize: [25, 25],
  iconAnchor: [12, 25],
});

const MapPanel: React.FC = () => {
  const { safetyActions, riskData } = useWebSocket();
  const [mapInstance, setMapInstance] = useState<L.Map | null>(null);

  // Center on a sample location (Delhi, India - could be any crowd management location)
  const center: [number, number] = [28.6139, 77.2090];

  const getRiskZoneColor = (level: string) => {
    switch (level) {
      case 'good': return '#10B981';
      case 'moderate': return '#F59E0B';
      case 'overcrowd': return '#F97316';
      case 'stampede': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRiskZoneRadius = (level: string) => {
    switch (level) {
      case 'good': return 200;
      case 'moderate': return 300;
      case 'overcrowd': return 400;
      case 'stampede': return 500;
      default: return 200;
    }
  };

  return (
    <div className="bg-slate-800 rounded-lg border border-slate-700 h-full flex flex-col">
      <div className="p-4 border-b border-slate-700">
        <h3 className="text-lg font-semibold text-white mb-2">Live Safety Map</h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-blue-400 rounded"></div>
            <span className="text-slate-400">Officers</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-orange-400 rounded"></div>
            <span className="text-slate-400">Barricades</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-400 rounded"></div>
            <span className="text-slate-400">Medical</span>
          </div>
        </div>
      </div>
      
      <div className="flex-1 relative">
        <MapContainer
          center={center}
          zoom={16}
          style={{ height: '100%', width: '100%' }}
          whenCreated={setMapInstance}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          
          {/* Risk Zone Circle */}
          {riskData && (
            <Circle
              center={center}
              radius={getRiskZoneRadius(riskData.current.level)}
              color={getRiskZoneColor(riskData.current.level)}
              fillColor={getRiskZoneColor(riskData.current.level)}
              fillOpacity={0.2}
              weight={3}
            >
              <Popup>
                <div className="text-center">
                  <strong>Risk Zone</strong><br />
                  Status: {riskData.current.category}<br />
                  Confidence: {(riskData.current.confidence * 100).toFixed(1)}%
                </div>
              </Popup>
            </Circle>
          )}

          {/* Officers */}
          {safetyActions?.officers.map((officer) => (
            <Marker
              key={officer.id}
              position={officer.position}
              icon={officerIcon}
            >
              <Popup>
                <div>
                  <strong>Officer {officer.id.split('-')[1]}</strong><br />
                  Status: {officer.status}<br />
                  Position: {officer.position[0].toFixed(4)}, {officer.position[1].toFixed(4)}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Barricades */}
          {safetyActions?.barricades.map((barricade) => (
            <Marker
              key={barricade.id}
              position={barricade.position}
              icon={barricadeIcon}
            >
              <Popup>
                <div>
                  <strong>Barricade {barricade.id.split('-')[1]}</strong><br />
                  Status: {barricade.status}<br />
                  {barricade.status === 'closed' && <span style={{ color: 'red' }}>⚠️ Access Restricted</span>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Medical Units */}
          {safetyActions?.medical.map((medical) => (
            <Marker
              key={medical.id}
              position={medical.position}
              icon={medicalIcon}
            >
              <Popup>
                <div>
                  <strong>Medical Unit {medical.id.split('-')[1]}</strong><br />
                  Status: {medical.status}<br />
                  {medical.status === 'active' && <span style={{ color: 'red' }}>🚨 Emergency Response</span>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Map Legend */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-xs text-slate-400">
          <div className="grid grid-cols-2 gap-2">
            <div>Live Updates: {safetyActions ? 'Active' : 'Standby'}</div>
            <div>Assets: {safetyActions ? 
              (safetyActions.officers.length + safetyActions.barricades.length + safetyActions.medical.length) : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapPanel;