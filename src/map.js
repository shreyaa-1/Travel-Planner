import React, { useState, useCallback, useRef } from 'react';
import { GoogleMap, Marker, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '400px'
};

const defaultCenter = {
  lat: -3.745,
  lng: -38.523
};

function MapComponent({ markers, setMarkers }) {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: 'AIzaSyA2pJy-jNuI9dasw8XvChTcfuDdORoaWho'
  });

  const [currentLocation, setCurrentLocation] = useState(null);
  const [map, setMap] = useState(null); // Reference to GoogleMap instance
  const autocompleteRef = useRef(null); // Reference to Autocomplete component

  const onClick = useCallback((event) => {
    setMarkers((current) => [...current, { lat: event.latLng.lat(), lng: event.latLng.lng() }]);
  }, [setMarkers]);

  const handlePlaceSelect = useCallback(() => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace();
      if (place.geometry) {
        const { location } = place.geometry;
        setCurrentLocation({ lat: location.lat(), lng: location.lng() });
        if (map) {
          map.panTo({ lat: location.lat(), lng: location.lng() });
        }
      }
    } else {
      console.error('Autocomplete not loaded or is undefined');
      alert('Autocomplete not loaded or is undefined. Please try again.');
    }
  }, [map]);

  const onLoadMap = useCallback((map) => {
    setMap(map);
  }, []);

  const onLoadAutocomplete = useCallback((autocomplete) => {
    autocompleteRef.current = autocomplete;
  }, []);

  const handleAutocompleteError = useCallback(() => {
    console.error('Error loading autocomplete');
    alert('Failed to load autocomplete. Please try again later.');
  }, []);

  return isLoaded ? (
    <div style={{ position: 'relative' }}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={currentLocation || defaultCenter}
        zoom={10}
        onClick={onClick}
        onLoad={onLoadMap}
      >
        {markers.map((marker, index) => (
          <Marker key={index} position={marker} />
        ))}
        {currentLocation && (
          <Marker position={currentLocation} icon={{
            url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
            scaledSize: new window.google.maps.Size(50, 50)
          }} />
        )}
      </GoogleMap>
      <div
        style={{
          position: 'absolute',
          top: '10px',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: '1000',
          backgroundColor: 'white',
          padding: '10px',
          borderRadius: '5px',
          boxShadow: '0 2px 6px rgba(0, 0, 0, 0.3)',
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <input
          type="text"
          placeholder="Search for a place"
          style={{
            flex: '1',
            boxSizing: 'border-box',
            border: '1px solid transparent',
            width: '300px',
            height: '32px',
            padding: '0 12px',
            borderRadius: '3px',
            outline: 'none'
          }}
          onChange={(e) => {
            // Handle input changes if needed
          }}
        />
        <button
          onClick={handlePlaceSelect}
          style={{
            marginLeft: '10px',
            padding: '8px 12px',
            borderRadius: '3px',
            border: '1px solid #ccc',
            backgroundColor: '#f0f0f0',
            cursor: 'pointer'
          }}
        >
          Search
        </button>
      </div>
    </div>
  ) : <></>;
}

export default React.memo(MapComponent);
