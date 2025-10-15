import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { AlertTriangle, Zap, Droplets, CloudSun } from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import 'leaflet/dist/leaflet.css';
import { AIReportModal } from '../components/AIreportModal';
import type { ZoneData } from '../types';

// Mock data for zones with alerts
const zonesData: ZoneData[] = [
  { id: 1, name: 'Connaught Place', lat: 28.6328, lng: 77.2197, status: 'critical', alert: 'High power load and low water pressure', energyDemand: 450, waterPressure: 25, waterFlow: 120, renewablePercent: 40, lastUpdated: '2025-10-15T11:00:00' },
  { id: 2, name: 'Karol Bagh', lat: 28.6515, lng: 77.1945, status: 'warning', alert: 'Moderate power load', energyDemand: 300, waterPressure: 35, waterFlow: 180, renewablePercent: 30, lastUpdated: '2025-10-15T11:05:00' },
  { id: 3, name: 'Hauz Khas', lat: 28.5495, lng: 77.1980, status: 'normal', alert: '', energyDemand: 150, waterPressure: 40, waterFlow: 200, renewablePercent: 50, lastUpdated: '2025-10-15T10:55:00' },
  { id: 4, name: 'Lajpat Nagar', lat: 28.5672, lng: 77.2431, status: 'warning', alert: 'Water flow slightly below average', energyDemand: 280, waterPressure: 32, waterFlow: 160, renewablePercent: 35, lastUpdated: '2025-10-15T10:50:00' },
  { id: 5, name: 'Dwarka', lat: 28.5911, lng: 77.0531, status: 'critical', alert: 'Power outage in sector 10', energyDemand: 500, waterPressure: 28, waterFlow: 140, renewablePercent: 25, lastUpdated: '2025-10-15T11:10:00' }
];

// Custom icon with pulse for critical zones
const createCustomIcon = (status: string) => {
  const colors: Record<string, string> = {
    critical: '#EF4444',
    warning: '#F59E0B',
    normal: '#10B981',
  };
  const color = colors[status] || colors.normal;
  const pulse = status === 'critical' ? 'animate-ping' : '';
  return L.divIcon({
    html: `
      <div class="${pulse}" style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="width: 12px; height: 12px; background: white; border-radius: 50%;"></div>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

// Metric component
const Metric = ({ label, value, icon: Icon }: { label: string; value: string; icon: any }) => (
  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition">
    <div className="w-10 h-10 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-lg flex items-center justify-center flex-shrink-0">
      <Icon className="w-5 h-5 text-[#326B5D]" />
    </div>
    <div>
      <p className="text-sm text-gray-500">{label}</p>
      <p className="text-lg font-semibold text-[#326B5D]">{value}</p>
    </div>
  </div>
);

export const ZoneInsightsPage = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);
  const [aiReportOpen, setAIReportOpen] = useState(false);

  const handleZoneSelect = (zone: ZoneData) => setSelectedZone(zone);
  const openAIReport = () => { if (selectedZone) setAIReportOpen(true); };
  const getStatusBadge = (status: string) => ({
    critical: 'error' as const,
    warning: 'warning' as const,
    normal: 'success' as const
  }[status as keyof any] || 'info');

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#afecb4] pt-24 pb-12 space-y-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">Zone Insights</h1>
          <p className="text-gray-600">Interactive city map with AI-powered insights </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="mb-4 flex gap-4 text-sm">
                {['critical','warning','normal'].map((status) => (
                  <div key={status} className="flex items-center gap-2">
                    <div className={`w-3 h-3 rounded-full ${status==='critical'?'bg-red-500':status==='warning'?'bg-orange-500':'bg-green-500'}`}></div>
                    <span className="capitalize">{status}</span>
                  </div>
                ))}
              </div>
              <div className="h-[500px] rounded-lg overflow-hidden border border-gray-200">
                <MapContainer center={[28.6519,77.2315]} zoom={11} style={{ height:'100%', width:'100%' }}>
                  <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap' />
                  {zonesData.map(zone => (
                    <Marker key={zone.id} position={[zone.lat, zone.lng]} icon={createCustomIcon(zone.status)}
                      eventHandlers={{ click: () => handleZoneSelect(zone) }}>
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-semibold text-[#326B5D] mb-1">{zone.name}</h4>
                          <p className="text-sm text-gray-600">Status: {zone.status}</p>
                          {zone.alert && <p className="text-sm text-orange-600 mt-1">{zone.alert}</p>}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>
          </motion.div>

          {/* Zone Details */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="space-y-6">
            {selectedZone ? (
              <Card className="space-y-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-xl font-semibold text-[#326B5D]">{selectedZone.name}</h3>
                    <Badge variant={getStatusBadge(selectedZone.status)} className="mt-2">{selectedZone.status.toUpperCase()}</Badge>
                  </div>
                  <Button variant="outline" size="sm" onClick={openAIReport}>View AI Report</Button>
                </div>

                {selectedZone.alert && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-800">{selectedZone.alert}</p>
                  </div>
                )}

                <p className="text-xs text-gray-400">Last Updated: {new Date(selectedZone.lastUpdated).toLocaleString()}</p>

                {/* Metrics Graph */}
                <ResponsiveContainer width="100%" height={150}>
                  <LineChart data={[
                    { name:'Energy Demand', value:selectedZone.energyDemand },
                    { name:'Water Pressure', value:selectedZone.waterPressure },
                    { name:'Water Flow', value:selectedZone.waterFlow },
                    { name:'Renewable %', value:selectedZone.renewablePercent }
                  ]}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="value" stroke="#326B5D" strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>

                {/* Individual Metrics */}
                <div className="grid grid-cols-1 gap-3">
                  <Metric label="Energy Demand" value={`${selectedZone.energyDemand.toLocaleString()} MW`} icon={Zap} />
                  <Metric label="Water Pressure" value={`${selectedZone.waterPressure} PSI`} icon={Droplets} />
                  <Metric label="Water Flow" value={`${selectedZone.waterFlow} L/s`} icon={Droplets} />
                  <Metric label="Renewable %" value={`${selectedZone.renewablePercent || 35}%`} icon={CloudSun} />
                </div>
              </Card>
            ) : (
              <Card>
                <div className="text-center py-8">
                  <div className="w-16 h-16 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-full flex items-center justify-center mx-auto mb-4">
                    <AlertTriangle className="w-8 h-8 text-[#326B5D]" />
                  </div>
                  <p className="text-gray-600">Click on a zone marker to view details</p>
                </div>
              </Card>
            )}
          </motion.div>
        </div>
      </div>

      {selectedZone && <AIReportModal open={aiReportOpen} onClose={()=>setAIReportOpen(false)} zone={selectedZone} />}

      <footer className="mt-10 text-center text-gray-600 text-sm">
        <p>© 2025 CityShield | Built by Team Maverick</p>
      </footer>
    </div>
  );
};
