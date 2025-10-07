import { useState } from 'react';
import { motion } from 'framer-motion';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Zap, Droplets, AlertTriangle } from 'lucide-react';
import zonesDataRaw from '../data/mockZones.json';
import type { ZoneData } from '../types';
import 'leaflet/dist/leaflet.css';

const zonesData = zonesDataRaw as ZoneData[];

const createCustomIcon = (status: string) => {
  const colors = {
    critical: '#EF4444',
    warning: '#F59E0B',
    normal: '#10B981',
  };

  const color = colors[status as keyof typeof colors] || colors.normal;

  return L.divIcon({
    html: `
      <div style="
        width: 32px;
        height: 32px;
        background: ${color};
        border: 3px solid white;
        border-radius: 50%;
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <div style="
          width: 12px;
          height: 12px;
          background: white;
          border-radius: 50%;
        "></div>
      </div>
    `,
    className: '',
    iconSize: [32, 32],
    iconAnchor: [16, 16],
  });
};

export const ZoneInsightsPage = () => {
  const [selectedZone, setSelectedZone] = useState<ZoneData | null>(null);

  const handleZoneSelect = (zone: ZoneData) => {
    setSelectedZone(zone);
  };

  const getStatusBadge = (status: string) => {
    const variants = {
      critical: 'error' as const,
      warning: 'warning' as const,
      normal: 'success' as const,
    };
    return variants[status as keyof typeof variants] || 'info' as const;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F8F9FA] to-[#C7E8CA] pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#326B5D] mb-2">Zone Insights</h1>
          <p className="text-gray-600">Interactive city map with real-time status monitoring</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="lg:col-span-2"
          >
            <Card className="overflow-hidden">
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-[#326B5D] mb-2">Delhi Zone Map</h3>
                <div className="flex gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span>Critical</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                    <span>Warning</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Normal</span>
                  </div>
                </div>
              </div>
              <div className="h-[500px] rounded-lg overflow-hidden">
                <MapContainer
                  center={[28.6519, 77.2315]}
                  zoom={11}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                  />
                  {zonesData.map((zone) => (
                    <Marker
                      key={zone.id}
                      position={[zone.lat, zone.lng]}
                      icon={createCustomIcon(zone.status)}
                      eventHandlers={{
                        click: () => handleZoneSelect(zone),
                      }}
                    >
                      <Popup>
                        <div className="p-2">
                          <h4 className="font-semibold text-[#326B5D] mb-1">{zone.name}</h4>
                          <p className="text-sm text-gray-600">Status: {zone.status}</p>
                          {zone.alert && (
                            <p className="text-sm text-orange-600 mt-1">{zone.alert}</p>
                          )}
                        </div>
                      </Popup>
                    </Marker>
                  ))}
                </MapContainer>
              </div>
            </Card>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            {selectedZone ? (
              <Card>
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-[#326B5D]">{selectedZone.name}</h3>
                    <Badge variant={getStatusBadge(selectedZone.status)} className="mt-2">
                      {selectedZone.status.toUpperCase()}
                    </Badge>
                  </div>
                </div>

                {selectedZone.alert && (
                  <div className="flex items-start gap-2 p-3 bg-orange-50 rounded-lg mb-4">
                    <AlertTriangle className="w-5 h-5 text-orange-600 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-orange-800">{selectedZone.alert}</p>
                  </div>
                )}

                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Zap className="w-5 h-5 text-[#326B5D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Energy Demand</p>
                      <p className="text-xl font-semibold text-[#326B5D]">
                        {selectedZone.energyDemand.toLocaleString()} MW
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-5 h-5 text-[#326B5D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Water Pressure</p>
                      <p className="text-xl font-semibold text-[#326B5D]">
                        {selectedZone.waterPressure} PSI
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-lg flex items-center justify-center flex-shrink-0">
                      <Droplets className="w-5 h-5 text-[#326B5D]" />
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Water Flow</p>
                      <p className="text-xl font-semibold text-[#326B5D]">
                        {selectedZone.waterFlow} L/s
                      </p>
                    </div>
                  </div>
                </div>

                <Button className="w-full mt-6" variant="outline">
                  View AI Report
                </Button>
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

            <Card>
              <h4 className="font-semibold text-[#326B5D] mb-3">All Zones Summary</h4>
              <div className="space-y-2">
                {zonesData.map((zone) => (
                  <button
                    key={zone.id}
                    onClick={() => handleZoneSelect(zone)}
                    className="w-full text-left p-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-[#326B5D]">{zone.name}</span>
                      <Badge variant={getStatusBadge(zone.status)} className="text-xs">
                        {zone.status}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};
