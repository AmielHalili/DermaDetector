import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const containerStyle = {
  width: '100%',
  height: '300px',
};

const radiusInMeters = 32186; // 20 miles

function MapComponent() {
  const [location, setLocation] = useState(null);
  const [places, setPlaces] = useState([]);
  const [selectedPlace, setSelectedPlace] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: 'AIzaSyC3zjjX1D9XWWV6FZSVaMR7P9QK7nzzvpg', // 🔑 Replace this
    libraries: ['places'],
  });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude } = pos.coords;
          setLocation({ lat: latitude, lng: longitude });
        },
        (err) => console.error('Geolocation error:', err)
      );
    }
  }, []);

  const onLoadMap = useCallback((map) => {
    if (!location) return;

    const service = new window.google.maps.places.PlacesService(map);
    const request = {
      location,
      radius: radiusInMeters,
      keyword: 'dermatologist',
    };

    service.nearbySearch(request, (results, status) => {
      if (status === window.google.maps.places.PlacesServiceStatus.OK && results) {
        setPlaces(results);
      }
    });
  }, [location]);

  if (!isLoaded || !location) return <div>Loading map...</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={location}
      zoom={11}
      onLoad={onLoadMap}
    >
      <Marker position={location} label="You" />

      {places.map((place, index) => (
        <Marker
          key={index}
          position={{
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          }}
          onClick={() => setSelectedPlace(place)}
        />
      ))}

      {selectedPlace && (
        <InfoWindow
          position={{
            lat: selectedPlace.geometry.location.lat(),
            lng: selectedPlace.geometry.location.lng(),
          }}
          onCloseClick={() => setSelectedPlace(null)}
        >
          <div>
            <h3>{selectedPlace.name}</h3>
            <p>{selectedPlace.vicinity}</p>
          </div>
        </InfoWindow>
      )}
    </GoogleMap>
  );
}

export default MapComponent;