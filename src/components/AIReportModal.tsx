import { Dialog } from '@headlessui/react';
import { Zap, Droplets, CloudSun, Thermometer, Battery, Wind } from 'lucide-react';
import { ZoneData } from '../types';
import { Button } from './Button';

interface AIReportModalProps {
  open: boolean;
  onClose: () => void;
  zone: ZoneData;
}

export const AIReportModal = ({ open, onClose, zone }: AIReportModalProps) => {
  // Placeholder AI report
  const aiReport = `AI Analysis for ${zone.name}:
- Energy Demand is high (${zone.energyDemand} MW)
- Water Flow is stable (${zone.waterFlow} L/s)
- Renewable contribution: ${zone.renewablePercent || 35}%
- Predicted alerts: ${zone.alert ? zone.alert : 'No critical alerts'}`;

  // Metrics array
  const metrics: { label: string; value: string; icon: any }[] = [
    { label: 'Energy Demand', value: `${zone.energyDemand} MW`, icon: Zap },
    { label: 'Water Flow', value: `${zone.waterFlow} L/s`, icon: Droplets },
    { label: 'Renewable %', value: `${zone.renewablePercent || 35}%`, icon: CloudSun },
    { label: 'Power Status', value: zone.power || 'Normal', icon: Battery },
    { label: 'Temperature', value: `${zone.temperature || 30} °C`, icon: Thermometer },
    { label: 'Air Quality', value: zone.airQuality || 'Good', icon: Wind },
  ];

  return (
    <Dialog open={open} onClose={onClose} className="fixed z-50 inset-0 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-30" aria-hidden="true" />

        <div className="relative bg-white rounded-lg max-w-2xl w-full p-6 shadow-lg overflow-y-auto max-h-[90vh]">
          <Dialog.Title className="text-2xl font-semibold text-[#326B5D] mb-4">
            AI Report: {zone.name}
          </Dialog.Title>

          <Dialog.Description className="text-gray-600 mb-6 whitespace-pre-line">
            {aiReport}
          </Dialog.Description>

          {/* Metrics Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            {metrics.map((metric) => {
              const Icon = metric.icon; // fix: assign icon to capitalized variable
              return (
                <div
                  key={metric.label}
                  className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg shadow-sm hover:shadow-md transition"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-[#C7E8CA] to-[#7FC8A9] rounded-lg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-5 h-5 text-[#326B5D]" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">{metric.label}</p>
                    <p className="text-lg font-semibold text-[#326B5D]">{metric.value}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alerts Section */}
          {zone.alert && (
            <div className="mb-6 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h4 className="font-semibold text-orange-600 mb-2">Active Alerts</h4>
              <p className="text-sm text-orange-800">{zone.alert}</p>
            </div>
          )}

          {/* Close Button */}
          <div className="flex justify-end">
            <Button variant="primary" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};
