import React, { useState } from 'react';
import MapComponent from './map';
import ResultComponent from './result';
import { christofidesAlgorithm } from './christofides'; // Import your algorithm function

function App() {
  const [markers, setMarkers] = useState([]);
  const [route, setRoute] = useState([]);

  const handleSolveTSP = () => {
    if (markers.length < 2) {
      alert('Please add at least two markers on the map.');
      return;
    }

    // Convert markers to a distance matrix
    const distanceMatrix = createDistanceMatrix(markers);
    const { path, distance } = christofidesAlgorithm(distanceMatrix);
    setRoute(path);
  };

  const createDistanceMatrix = (markers) => {
    const n = markers.length;
    const matrix = Array.from({ length: n }, () => Array(n).fill(0));

    for (let i = 0; i < n; i++) {
      for (let j = 0; j < n; j++) {
        if (i !== j) {
          matrix[i][j] = getDistance(markers[i], markers[j]);
        }
      }
    }

    return matrix;
  };

  const getDistance = (marker1, marker2) => {
    const R = 6371; // Radius of the Earth in km
    const dLat = ((marker2.lat - marker1.lat) * Math.PI) / 180;
    const dLng = ((marker2.lng - marker1.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((marker1.lat * Math.PI) / 180) *
        Math.cos((marker2.lat * Math.PI) / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c; // Distance in km
    return distance;
  };

  return (
    <div>
      <MapComponent markers={markers} setMarkers={setMarkers} />
      <button onClick={handleSolveTSP}>Solve TSP</button>
      {route.length > 0 && (
        <div>
          <h3>TSP Route:</h3>
          <ul>
            {route.map((point, index) => (
              <li key={index}>{`City ${point}`}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default App;

