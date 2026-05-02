import { useState, useEffect, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF, InfoWindowF } from '@react-google-maps/api';
import axios from 'axios';

const API = import.meta.env.VITE_API_URL || '/api';
const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY || '';

const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#8892b0' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#2d2d44' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0e1a3a' }] },
  { featureType: 'poi', elementType: 'geometry', stylers: [{ color: '#1f1f35' }] },
];

const CITY_CENTERS = {
  Jaipur: { lat: 26.9124, lng: 75.7873 },
  'New Delhi': { lat: 28.6139, lng: 77.2090 },
  Mumbai: { lat: 19.0760, lng: 72.8777 },
  Bengaluru: { lat: 12.9716, lng: 77.5946 },
  Chennai: { lat: 13.0827, lng: 80.2707 },
  Kolkata: { lat: 22.5726, lng: 88.3639 },
  Hyderabad: { lat: 17.3850, lng: 78.4867 },
  Lucknow: { lat: 26.8467, lng: 80.9462 },
};

const containerStyle = { width: '100%', height: '100%' };

function MapFallback({ booths, selectedCity, selectedBooth, setSelectedBooth }) {
  return (
    <div className="w-full h-full bg-slate-900/50 rounded-xl border border-white/10 flex flex-col">
      <div className="p-4 border-b border-white/10 bg-amber-500/10">
        <p className="text-amber-300 text-sm flex items-center gap-2">
          <span>⚠️</span>
          Google Maps API key not configured. Showing booth list view.
        </p>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {booths.map((booth) => (
          <button
            key={booth.id}
            onClick={() => setSelectedBooth(booth)}
            className={`w-full text-left p-4 rounded-xl transition-all duration-200 ${
              selectedBooth?.id === booth.id
                ? 'bg-indigo-600/20 border border-indigo-500/30'
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
            }`}
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl mt-0.5">📍</span>
              <div>
                <h4 className="font-semibold text-white text-sm">{booth.name}</h4>
                <p className="text-slate-400 text-xs mt-1">{booth.address}</p>
                <p className="text-indigo-400 text-xs mt-1">
                  {booth.lat.toFixed(4)}°N, {booth.lng.toFixed(4)}°E
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function MapWithGoogle({ booths, center, selectedBooth, setSelectedBooth }) {
  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={12}
      options={{
        styles: MAP_STYLES,
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      }}
    >
      {booths.map((booth) => (
        <MarkerF
          key={booth.id}
          position={{ lat: booth.lat, lng: booth.lng }}
          onClick={() => setSelectedBooth(booth)}
          icon={{
            url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(
              '<svg xmlns="http://www.w3.org/2000/svg" width="32" height="40" viewBox="0 0 32 40"><path d="M16 0C7.2 0 0 7.2 0 16c0 12 16 24 16 24s16-12 16-24C32 7.2 24.8 0 16 0z" fill="%236366f1"/><circle cx="16" cy="16" r="6" fill="white"/></svg>'
            ),
            scaledSize: { width: 32, height: 40 },
          }}
        />
      ))}
      {selectedBooth && (
        <InfoWindowF
          position={{ lat: selectedBooth.lat, lng: selectedBooth.lng }}
          onCloseClick={() => setSelectedBooth(null)}
        >
          <div style={{ color: '#1a1a2e', padding: '4px', maxWidth: '220px' }}>
            <h4 style={{ fontWeight: 700, fontSize: '14px', marginBottom: '4px' }}>{selectedBooth.name}</h4>
            <p style={{ fontSize: '12px', color: '#555', marginBottom: '4px' }}>{selectedBooth.address}</p>
            <p style={{ fontSize: '11px', color: '#6366f1' }}>
              {selectedBooth.city}, {selectedBooth.state}
            </p>
          </div>
        </InfoWindowF>
      )}
    </GoogleMap>
  );
}

export default function BoothFinder() {
  const [booths, setBooths] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('Jaipur');
  const [selectedBooth, setSelectedBooth] = useState(null);
  const [loading, setLoading] = useState(true);

  const { isLoaded: mapsLoaded } = useJsApiLoader({
    googleMapsApiKey: MAPS_KEY,
  });

  useEffect(() => {
    const fetchBooths = async () => {
      try {
        const res = await axios.get(`${API}/map`, { params: { city: selectedCity } });
        setBooths(res.data.data);
        setCities(res.data.cities);
      } catch {
        setBooths([]);
      } finally {
        setLoading(false);
      }
    };
    fetchBooths();
  }, [selectedCity]);

  const center = CITY_CENTERS[selectedCity] || { lat: 26.9124, lng: 75.7873 };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="section-title text-white">📍 Polling Booth Finder</h1>
        <p className="section-subtitle !mb-6">
          Find polling booth locations across major Indian cities.
        </p>
      </div>

      {/* City Selector */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-8">
        {(cities.length > 0 ? cities : Object.keys(CITY_CENTERS)).map((city) => (
          <button
            key={city}
            onClick={() => {
              setSelectedCity(city);
              setSelectedBooth(null);
            }}
            id={`city-btn-${city.replace(/\s/g, '-').toLowerCase()}`}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
              selectedCity === city
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25'
                : 'bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Map + List Layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Map */}
        <div className="lg:col-span-2 glass-card overflow-hidden" style={{ height: '500px' }}>
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin" />
            </div>
          ) : mapsLoaded && MAPS_KEY ? (
            <MapWithGoogle
              booths={booths}
              center={center}
              selectedBooth={selectedBooth}
              setSelectedBooth={setSelectedBooth}
            />
          ) : (
            <MapFallback
              booths={booths}
              selectedCity={selectedCity}
              selectedBooth={selectedBooth}
              setSelectedBooth={setSelectedBooth}
            />
          )}
        </div>

        {/* Booth List Sidebar */}
        <div className="glass-card p-4 overflow-y-auto" style={{ maxHeight: '500px' }}>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
            <span>🏢</span>
            {selectedCity} Booths
            <span className="ml-auto text-xs px-2 py-0.5 rounded-full bg-indigo-500/15 text-indigo-300">
              {booths.length}
            </span>
          </h3>
          <div className="space-y-2">
            {booths.map((booth) => (
              <button
                key={booth.id}
                onClick={() => setSelectedBooth(booth)}
                className={`w-full text-left p-3 rounded-xl text-sm transition-all duration-200 ${
                  selectedBooth?.id === booth.id
                    ? 'bg-indigo-600/20 border border-indigo-500/30'
                    : 'bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10'
                }`}
              >
                <p className="font-medium text-white leading-snug">{booth.name}</p>
                <p className="text-slate-500 text-xs mt-1">{booth.address}</p>
              </button>
            ))}
            {booths.length === 0 && (
              <p className="text-slate-500 text-sm text-center py-8">No booths found for this city.</p>
            )}
          </div>
        </div>
      </div>

      {/* Info Note */}
      <div className="mt-6 glass-card p-4 flex items-start gap-3">
        <span className="text-xl">ℹ️</span>
        <p className="text-slate-400 text-sm leading-relaxed">
          These are sample polling booth locations for demonstration.
          For official booth information, visit the{' '}
          <a
            href="https://eci.gov.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2"
          >
            Election Commission of India
          </a>{' '}
          website.
        </p>
      </div>
    </div>
  );
}
