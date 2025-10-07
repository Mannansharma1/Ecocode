// src/components/ZoneInsightsPage.tsx

import { useState } from 'react'; // <-- STEP 1: Import useState from React
import { MapContainer, TileLayer, Circle, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

export const ZoneInsightsPage = () => {
  // --- NEW CODE STARTS HERE ---

  // STEP 2: Create the "light switch" using useState.
  // It's a variable called 'showAlert'. It starts as 'false' (off).
  // 'setShowAlert' is the function we use to flip the switch.
  const [showAlert, setShowAlert] = useState(false);

  // --- NEW CODE ENDS HERE ---


  const delhiPosition: [number, number] = [28.6139, 77.2090];
  const riskZone = {
    center: [28.63, 77.22] as [number, number],
    radius: 2000,
  };

  return (
    // We add 'relative' here to position our buttons correctly on the map
    <div className="w-screen h-screen relative">

      {/* --- NEW CODE STARTS HERE --- */}

      {/* STEP 3: Add the control buttons. */}
      {/* These buttons are positioned on top of the map. */}
      <div className="absolute top-4 right-4 z-[1000] p-2 bg-white rounded-lg shadow-lg flex flex-col gap-2">
        <h3 className="font-bold text-center text-gray-700">Demo Controls</h3>
        <button
          onClick={() => setShowAlert(true)} // When clicked, this flips the switch to 'true' (on)
          className="bg-red-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-red-600 transition"
        >
          Simulate Heatwave Alert
        </button>
        <button
          onClick={() => setShowAlert(false)} // When clicked, this flips the switch to 'false' (off)
          className="bg-gray-500 text-white font-semibold py-2 px-4 rounded-md hover:bg-gray-600 transition"
        >
          Clear Alerts
        </button>
      </div>

      {/* --- NEW CODE ENDS HERE --- */}


      <MapContainer center={delhiPosition} zoom={12} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {/* --- MODIFIED CODE STARTS HERE --- */}

        {/* STEP 4: Conditionally render the Circle. */}
        {/* This JSX code means: "IF showAlert is true, THEN render the Circle component." */}
        {showAlert && (
          <Circle
            center={riskZone.center}
            radius={riskZone.radius}
            pathOptions={{ color: 'red', fillColor: 'red', fillOpacity: 0.3 }}
          >
            <Popup>
              <b>High-Risk Zone Activated!</b><br />
              Time: 4:45 PM, Tuesday, Oct 7, 2025<br/>
              Cause: Predicted Heatwave<br />
              Impact: Critical Power Substation at Risk
            </Popup>
          </Circle>
        )}

        {/* --- MODIFIED CODE ENDS HERE --- */}

      </MapContainer>
    </div>
  );
};