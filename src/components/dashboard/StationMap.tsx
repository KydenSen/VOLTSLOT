/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState, useEffect, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMap, Popup, Polyline, Circle, useMapEvents } from "react-leaflet";
import L from "leaflet";
import { useBooking } from "@/contexts/BookingContext";
import { Station } from "@/types";
import { Button } from "@/components/ui/button";
import { MapPin, Navigation, MapPinOff } from "lucide-react";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

// Haversine formula for calculating distance in km
const haversineKm = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  const R = 6371; // Earth's radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = Math.sin(dLat/2) ** 2 +
            Math.cos(lat1 * Math.PI/180) *
            Math.cos(lat2 * Math.PI/180) *
            Math.sin(dLon/2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
};

// Extend Leaflet Map type to include custom tracking property
declare global {
  namespace L {
    interface Map {
      _userHasBeenShown?: boolean;
    }
  }
}

// Calculate distance between two coordinates using Haversine formula
const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
  return haversineKm(lat1, lon1, lat2, lon2);
};

const createStationIcon = (hasNormal: boolean, hasFast: boolean, isMaintenance?: boolean) => {
  const color = isMaintenance ? "#ef4444" : hasFast && hasNormal ? "#22c55e" : hasFast ? "#f59e0b" : "#3b82f6";
  const glow = isMaintenance ? "rgba(239,68,68,0.4)" : hasFast && hasNormal ? "rgba(34,197,94,0.4)" : hasFast ? "rgba(245,158,11,0.4)" : "rgba(59,130,246,0.4)";
  return L.divIcon({
    className: "custom-station-marker",
    html: `<div style="
      width: 38px; height: 38px;
      background: ${color};
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 8px ${glow}, 0 2px 4px rgba(0,0,0,0.2);
      display: flex; align-items: center; justify-content: center;
      cursor: pointer;
    ">
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        ${isMaintenance 
          ? '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>'
          : '<path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>'}
      </svg>
    </div>`,
    iconSize: [38, 38],
    iconAnchor: [19, 19],
  });
};

// User location marker with animated pulse (green live tracking)
const createUserLocationIcon = () => {
  return L.divIcon({
    className: '',
    html: `
      <div style="position:relative; width:20px; height:20px;">
        <!-- Outer pulse ring -->
        <div style="
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:40px; height:40px;
          border-radius:50%;
          background: rgba(0, 230, 118, 0.15);
          animation: locationPulse 2s ease-out infinite;
        "></div>

        <!-- Middle ring -->
        <div style="
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:24px; height:24px;
          border-radius:50%;
          background: rgba(0, 230, 118, 0.25);
          animation: locationPulse 2s ease-out infinite 0.4s;
        "></div>

        <!-- Center dot -->
        <div style="
          position:absolute; top:50%; left:50%;
          transform:translate(-50%,-50%);
          width:12px; height:12px;
          border-radius:50%;
          background: #00e676;
          border: 2px solid #0a0e13;
          box-shadow: 0 0 8px rgba(0,230,118,0.8);
          z-index:10;
        "></div>
      </div>
      <style>
        @keyframes locationPulse {
          0%   { transform: translate(-50%,-50%) scale(0.5); opacity:1; }
          100% { transform: translate(-50%,-50%) scale(2.5); opacity:0; }
        }
      </style>
    `,
    iconSize: [40, 40],
    iconAnchor: [20, 20],
  });
};

function FitBounds({ stations, userLocation }: { stations: Station[]; userLocation?: [number, number] }) {
  const map = useMap();
  const hasFitted = useRef(false);
  React.useEffect(() => {
    if (hasFitted.current) return;
    const allPoints = userLocation ? [[...userLocation], ...stations.map((s) => [s.latitude, s.longitude])] : stations.map((s) => [s.latitude, s.longitude]);
    if (allPoints.length === 0) return;
    const bounds = L.latLngBounds(allPoints as any);
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 14 });
    hasFitted.current = true;
  }, [stations, userLocation, map]);
  return null;
}

// Follow user location on map when it updates
function MapFollowUser({ userLocation, active }: { userLocation: [number, number] | null; active: boolean }) {
  const map = useMap();
  const isFirst = useRef(true);
  React.useEffect(() => {
    if (!userLocation || !active) return;
    if (isFirst.current) {
      map.flyTo(userLocation, 15, { duration: 1.5 });
      isFirst.current = false;
    } else {
      map.panTo(userLocation, { animate: true, duration: 0.5 });
    }
  }, [userLocation, active, map]);
  return null;
}

// Component to capture map reference
function MapRefCapture({ mapRef }: { mapRef: React.MutableRefObject<L.Map | null> }) {
  const map = useMap();
  React.useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);
  return null;
}

// Allow clicking on the map to manually set location
function MapClickTracker({ onMapClick }: { onMapClick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

interface StationMapProps {
  onSelectStation: (station: Station) => void;
  filteredStations?: Station[];
  height?: string;
}

const StationMap: React.FC<StationMapProps> = ({ onSelectStation, filteredStations, height = "100%" }) => {
  const { stations, chargers } = useBooking();
  const displayStations = filteredStations ?? stations;
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [watchId, setWatchId] = useState<number | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingState, setTrackingState] = useState<'idle' | 'acquiring' | 'active'>('idle');
  const [accuracy, setAccuracy] = useState<number>(0);
  const [accuracyCircle, setAccuracyCircle] = useState<L.Circle | null>(null);
  const [userMarker, setUserMarker] = useState<L.Marker | null>(null);
  const [distanceLines, setDistanceLines] = useState<Array<L.Polyline | L.Marker>>([]);
  const [nearestStations, setNearestStations] = useState<Array<Station & { distance_km: number }>>([]);
  const [showNearestCard, setShowNearestCard] = useState(false);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const mapRef = useRef<L.Map | null>(null);
  const locateBtnRef = useRef<HTMLButtonElement | null>(null);

  // Initialize locate button state once ref is available
  useEffect(() => {
    if (locateBtnRef.current) setLocateBtnState('idle');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locateBtnRef.current]);

  // When userLocation is set manually (not live tracking), ensure the map recenters
  useEffect(() => {
    if (!userLocation || isTracking) return;
    if (mapRef.current) {
      try {
        mapRef.current.flyTo(userLocation, 13, { duration: 0.8 });
      } catch (e) {
        // ignore if map not ready
      }
    }
  }, [userLocation, isTracking]);

  // Common locations in Mysore
  const koorgalliLocations = [
    { name: "Koorgalli Center", coords: [12.2934, 76.6145] as [number, number] },
    { name: "Koorgalli Main Road", coords: [12.2950, 76.6120] as [number, number] },
    { name: "Near Kamakshi Hospital", coords: [12.2920, 76.6180] as [number, number] },
    { name: "Koorgalli Market", coords: [12.2965, 76.6100] as [number, number] },
  ];

  // Auto-start live GPS tracking on mount
  useEffect(() => {
    // Small delay to let the map render first
    const timer = setTimeout(() => {
      if (!isTracking && trackingState === 'idle') {
        startLocationTracking();
      }
    }, 800);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Cleanup watch position on component unmount
  useEffect(() => {
    return () => {
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  }, [watchId]);

  const requestLocation = () => {
    if (!("geolocation" in navigator)) {
      setLocationError("Geolocation not supported by your browser");
      return;
    }

    setIsLocating(true);
    setLocationError(null);

    // Clear any existing watch
    if (watchId !== null) {
      navigator.geolocation.clearWatch(watchId);
    }
    
    // Use watchPosition for continuous, more accurate tracking
    const newWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const newLocation: [number, number] = [position.coords.latitude, position.coords.longitude];
        setUserLocation(newLocation);
        setIsLocating(false);
      },
      (error) => {
        let errorMsg = "Unable to get location";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied - enable in browser settings";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errorMsg = "GPS not available - try manual location";
        } else if (error.code === error.TIMEOUT) {
          errorMsg = "Location request timed out";
        }
        setLocationError(errorMsg);
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true, // Use device GPS instead of WiFi/cell tower
        timeout: 30000, // Wait up to 30 seconds for GPS lock
        maximumAge: 0, // Always get fresh location, don't use cached
      }
    );

    setWatchId(newWatchId);
  };

  // Get nearest stations sorted by distance
  const getNearestStations = (userLat: number, userLng: number) => {
    const sorted = displayStations
      .map((s) => ({
        ...s,
        distance_km: haversineKm(userLat, userLng, s.latitude, s.longitude),
      }))
      .sort((a, b) => a.distance_km - b.distance_km);
    return sorted;
  };

  // (Imperative marker rendering removed in favor of declarative React-Leaflet components)

  // Update button state
  const setLocateBtnState = (state: 'idle' | 'acquiring' | 'active') => {
    if (!locateBtnRef.current) return;
    const states = {
      idle:      { text: '⊕ Nearest to me',   color: '#00e676', border: '#1e2d3d' },
      acquiring: { text: '◌ Locating...',      color: '#ffb300', border: '#ffb300' },
      active:    { text: '◉ Live · Tap to stop', color: '#00e676', border: '#00e676' },
    };
    const s = states[state];
    locateBtnRef.current.textContent = s.text;
    locateBtnRef.current.style.color = s.color;
    locateBtnRef.current.style.borderColor = s.border;
    setTrackingState(state);
  };

  // Check permission and start location tracking
  const startLocationTracking = async () => {
    if (!navigator.geolocation) {
      setLocationError("GPS not supported on this device");
      return;
    }

    // Check existing permission state
    if (navigator.permissions) {
      try {
        const perm = await navigator.permissions.query({ name: 'geolocation' });
        if (perm.state === 'denied') {
          setPermissionDenied(true);
          return;
        }
      } catch (e) {
        // Permissions API not available, continue
      }
    }

    if (isTracking) {
      // STOP tracking
      if (watchId !== null) {
        navigator.geolocation.clearWatch(watchId);
        setWatchId(null);
      }
      setIsTracking(false);
      setNearestStations([]);
      setShowNearestCard(false);
      setLocateBtnState('idle');
      setLocationError("Location tracking stopped");
      return;
    }

    // START tracking
    setLocateBtnState('acquiring');
    setLocationError("Acquiring precise GPS signal...");

    // STAGE 1 — Try to get a quick precise fix from the device GPS chipset
    // Request high-accuracy immediately to prefer device GPS over IP/WiFi heuristics.
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude, accuracy: acc } = position.coords;
        setUserLocation([latitude, longitude]);
        setAccuracy(acc);
        if (mapRef.current) {
          const sorted = getNearestStations(latitude, longitude);
          setNearestStations(sorted);
          setShowNearestCard(true);
          if (acc > 1000) setLocationError("Rough location acquired. Waiting for more accurate GPS fix...");
        }
      },
      () => {}, // Ignore errors for stage 1
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );

    // STAGE 2 — Precise GPS tracking (Device Hardware)
    const options = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    };

    const newWatchId = navigator.geolocation.watchPosition(
      (position) => {
        let { latitude, longitude, accuracy: acc } = position.coords;
        
        // Use the device-provided coordinates directly (prefer GPS chipset)
        setIsTracking(true);
        setLocateBtnState('active');
        setUserLocation([latitude, longitude]);
        setAccuracy(acc);

        if (mapRef.current) {
          const sorted = getNearestStations(latitude, longitude);
          setNearestStations(sorted);
          setShowNearestCard(true);
          setLocationError(null);

          // Fly map to show user + nearest station
          if (!mapRef.current._userHasBeenShown && acc < 200) {
            const nearest = sorted[0];
            const bounds = L.latLngBounds(
              [latitude, longitude],
              [nearest.latitude, nearest.longitude]
            ).pad(0.3);
            mapRef.current.flyToBounds(bounds, { duration: 1.5 });
            mapRef.current._userHasBeenShown = true;
            
            // Show accuracy status
            if (acc < 50) setLocationError(null); // Success Toast equivalent
            else if (acc < 500) setLocationError(`GPS signal fair · ±${Math.round(acc)}m`);
            else setLocationError(`Low accuracy · ±${Math.round(acc)}m · Go near a window`);
          }
        }
      },
      (error) => {
        setLocateBtnState('idle');
        setIsTracking(false);
        const messages = {
          1: "Location access denied. Please allow GPS in browser settings.",
          2: "GPS signal unavailable. Try moving outdoors.",
          3: "Location request timed out. Try again.",
        };
        setLocationError((messages as any)[error.code] || "Location error");
      },
      options
    );

    setWatchId(newWatchId);
  };

  const stationMeta = useMemo(() => {
    const map: Record<string, { hasNormal: boolean; hasFast: boolean; distance?: number; isMaintenance: boolean }> = {};
    for (const station of displayStations) {
      const isMaintenance = station.status === "maintenance";
      const sc = chargers.filter((c) => c.station_id === station.id && c.status !== "maintenance");
      const distance = userLocation ? calculateDistance(userLocation[0], userLocation[1], station.latitude, station.longitude) : undefined;
      map[station.id] = {
        hasNormal: sc.some((c) => c.charger_type === "normal"),
        hasFast: sc.some((c) => c.charger_type === "fast"),
        distance,
        isMaintenance,
      };
    }
    return map;
  }, [displayStations, chargers, userLocation]);

  if (stations.length === 0) {
    return (
      <div className="flex items-center justify-center bg-card rounded-2xl border border-border" style={{ height }}>
        <div className="text-center space-y-3">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-primary animate-pulse">
              <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"/>
            </svg>
          </div>
          <p className="text-muted-foreground font-medium">Locating stations...</p>
        </div>
      </div>
    );
  }

  const center: [number, number] = userLocation ?? [12.2934, 76.6145]; // Default to Koorgalli center

  return (
    <div style={{ height, width: "100%", position: "relative" }}>
      {/* Locate Button & Menu */}
      <div style={{ position: "absolute", top: "12px", right: "12px", zIndex: 400 }}>
        <div className="flex flex-col gap-2">
          <div className="flex gap-2">
            {/* Live tracking button */}
            <button
              ref={locateBtnRef}
              onClick={startLocationTracking}
              id="locateBtn"
              style={{
                background: '#111820cc',
                border: '1px solid #1e2d3d',
                color: '#00e676',
                borderRadius: '9999px',
                padding: '8px 12px',
                fontSize: '12px',
                fontWeight: '600',
                cursor: 'pointer',
                fontFamily: 'Space Grotesk, sans-serif',
                transition: 'all 0.3s ease',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                whiteSpace: 'nowrap',
                animation: trackingState === 'acquiring' ? 'spinBorder 2s linear infinite' : 'none',
              }}
              title={trackingState === 'active' ? 'Live tracking active - tap to stop' : 'Get nearest station'}
            >
              ⊕ Nearest to me
            </button>

            {/* Manual location button */}
            <Button
              onClick={() => setShowLocationMenu(!showLocationMenu)}
              size="icon"
              className="rounded-full shadow-lg bg-indigo-500 hover:bg-indigo-600"
              title="Set location manually"
            >
              <MapPinOff className="h-4 w-4" />
            </Button>
          </div>

          {/* Manual Location Selection Menu */}
          {showLocationMenu && (
            <div className="bg-card border border-border rounded-lg shadow-lg p-3 max-w-[280px] space-y-2">
              <div className="text-xs font-semibold text-muted-foreground px-1">📍 Common Locations:</div>
              {koorgalliLocations.map((loc) => (
                <button
                  key={loc.name}
                  onClick={() => {
                    setUserLocation(loc.coords);
                    const sorted = getNearestStations(loc.coords[0], loc.coords[1]);
                    setNearestStations(sorted);
                    setShowNearestCard(true);
                    setShowLocationMenu(false);
                    setLocationError(null);
                    if (isTracking && watchId !== null) {
                      navigator.geolocation.clearWatch(watchId);
                      setWatchId(null);
                      setIsTracking(false);
                      setLocateBtnState('idle');
                    }
                  }}
                  className="w-full text-left px-3 py-2 rounded-lg hover:bg-muted transition-colors text-sm font-medium border border-border/50 hover:border-primary/50"
                >
                  {loc.name}
                </button>
              ))}
            </div>
          )}

          {/* Permission denied card */}
          {permissionDenied && (
            <div style={{
              background: '#3a1a1a',
              border: '1px solid #f44336',
              borderRadius: '10px',
              padding: '14px 18px',
              marginTop: '12px',
            }}>
              <div style={{ color: '#f44336', fontWeight: '700', marginBottom: '6px' }}>
                Location Access Blocked
              </div>
              <div style={{ color: '#5a7a94', fontSize: '13px', lineHeight: '1.6' }}>
                To use Nearest Station, enable location in your browser:<br />
                <strong style={{ color: '#e8edf2' }}>
                  Click the lock icon in your address bar → Site Settings → Location → Allow
                </strong>
              </div>
            </div>
          )}

          {locationError && !permissionDenied && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-3 text-xs text-destructive max-w-[280px] font-medium shadow-lg backdrop-blur-md">
              <div className="mb-2 font-bold">{locationError}</div>
              <div className="text-[11px] mb-2 opacity-90 text-destructive/90">GPS unavailable — set your location manually</div>
              <div className="flex flex-wrap gap-2">
                <button 
                  onClick={() => {
                    setUserLocation([12.3051, 76.6551]); // Mysuru
                    const sorted = getNearestStations(12.3051, 76.6551);
                    setNearestStations(sorted);
                    setShowNearestCard(true);
                    setLocationError(null);
                    if (mapRef.current) mapRef.current.flyTo([12.3051, 76.6551], 13);
                  }}
                  className="bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 text-destructive px-2 py-1.5 rounded transition-colors"
                >📍 Mysuru</button>
                <button 
                  onClick={() => {
                    setUserLocation([12.9716, 77.5946]); // Bengaluru
                    const sorted = getNearestStations(12.9716, 77.5946);
                    setNearestStations(sorted);
                    setShowNearestCard(true);
                    setLocationError(null);
                    if (mapRef.current) mapRef.current.flyTo([12.9716, 77.5946], 13);
                  }}
                  className="bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 text-destructive px-2 py-1.5 rounded transition-colors"
                >📍 Bengaluru</button>
                <button 
                  onClick={() => {
                    setUserLocation([13.0827, 80.2707]); // Chennai
                    const sorted = getNearestStations(13.0827, 80.2707);
                    setNearestStations(sorted);
                    setShowNearestCard(true);
                    setLocationError(null);
                    if (mapRef.current) mapRef.current.flyTo([13.0827, 80.2707], 13);
                  }}
                  className="bg-destructive/20 hover:bg-destructive/30 border border-destructive/40 text-destructive px-2 py-1.5 rounded transition-colors"
                >📍 Chennai</button>
              </div>
            </div>
          )}
          {trackingState === 'acquiring' && (
            <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg px-3 py-2 text-xs text-yellow-600 max-w-[240px] font-medium shadow-lg animate-pulse">
              ◌ Acquiring GPS signal... (up to 10s)
            </div>
          )}
        </div>
      </div>

        {showNearestCard && nearestStations.length > 0 && (
          <div style={{
            position: "absolute",
            bottom: "12px",
            left: "12px",
          right: "12px",
          background: '#111820',
          border: '1px solid #00e676',
          borderRadius: '10px',
          padding: '14px 18px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 400,
          boxShadow: '0 4px 12px rgba(0, 230, 118, 0.1)',
        }}>
          <div>
            <div style={{
              fontSize: '10px',
              color: '#5a7a94',
              textTransform: 'uppercase',
              letterSpacing: '2px',
              marginBottom: '4px',
            }}>
              Nearest Available Station
            </div>
            <div id="nearestName" style={{
              fontSize: '16px',
              fontWeight: '700',
              color: '#e8edf2',
            }}>
              {nearestStations[0]?.name || '—'}
            </div>
            <div id="nearestMeta" style={{
              fontSize: '12px',
              color: '#5a7a94',
              marginTop: '3px',
              fontFamily: 'JetBrains Mono, monospace',
            }}>
              {nearestStations[0]?.distance_km.toFixed(1)} km away
            </div>
          </div>

          <button
            id="nearestBookBtn"
            onClick={() => onSelectStation(nearestStations[0])}
            style={{
              background: '#00e676',
              color: '#0a0e13',
              border: 'none',
              borderRadius: '8px',
              padding: '10px 18px',
              fontWeight: '700',
              fontSize: '13px',
              cursor: 'pointer',
              fontFamily: 'Space Grotesk, sans-serif',
              whiteSpace: 'nowrap',
            }}
          >
            Book Now →
          </button>
        </div>
      )}

      <style>{`
        @keyframes spinBorder {
          to { transform: rotate(360deg); }
        }
        @keyframes livePulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
      `}</style>

      <MapContainer center={center} zoom={13} style={{ height: "100%", width: "100%" }} zoomControl={true}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickTracker onMapClick={(lat, lng) => {
          setUserLocation([lat, lng]);
          const sorted = getNearestStations(lat, lng);
          setNearestStations(sorted);
          setShowNearestCard(true);
          setLocationError(null);
          // Stop live tracking if manual is selected
          if (isTracking && watchId !== null) {
            navigator.geolocation.clearWatch(watchId);
            setWatchId(null);
            setIsTracking(false);
            setLocateBtnState('idle');
          }
        }} />
        <MapRefCapture mapRef={mapRef} />{/* Capture map ref */}
        <MapFollowUser userLocation={userLocation} active={isTracking} />

        {/* User's Location (Live or Manual) */}
        {userLocation && (
          <Marker position={userLocation} icon={createUserLocationIcon()} zIndexOffset={1000}>
            <Popup>
              <div style={{ background: '#111820', color: '#e8edf2', fontFamily: 'Space Grotesk, sans-serif', fontSize: '13px', padding: '10px 14px', borderRadius: '8px', minWidth: '160px' }}>
                <div style={{ fontWeight: 700, marginBottom: '4px' }}>
                  {isTracking ? '📍 Your Location (Live)' : '📍 Your Location'}
                </div>
                <div style={{ color: '#5a7a94', fontSize: '11px', fontFamily: 'JetBrains Mono, monospace' }}>
                  {userLocation[0].toFixed(5)}, {userLocation[1].toFixed(5)}
                </div>
                {accuracy > 0 && isTracking && (
                  <div style={{ color: '#00e676', fontSize: '11px', marginTop: '6px' }}>
                    Accuracy: ±{Math.round(accuracy)}m
                  </div>
                )}
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Accuracy Circle */}
        {userLocation && accuracy > 0 && isTracking && (
          <Circle 
            center={userLocation} 
            radius={accuracy} 
            pathOptions={{ color: '#00e676', fillColor: '#00e676', fillOpacity: 0.06, weight: 1, dashArray: '4 4' }} 
          />
        )}

        {/* Distance Lines */}
        {userLocation && nearestStations.length > 0 && nearestStations.map((station, index) => {
          const color = index === 0 ? '#00e676' : index === 1 ? '#ffb300' : 'rgba(90,122,148,0.4)';
          const weight = index === 0 ? 2 : 1;
          const dashArray = index === 0 ? '6 4' : '3 6';
          const midLat = (userLocation[0] + station.latitude) / 2;
          const midLng = (userLocation[1] + station.longitude) / 2;
          
          return (
            <React.Fragment key={`line-${station.id}`}>
              <Polyline 
                positions={[userLocation, [station.latitude, station.longitude]]}
                pathOptions={{ color, weight, dashArray, opacity: index < 3 ? 0.8 : 0.3 }}
              />
              {index < 3 && (
                <Marker 
                  position={[midLat, midLng]} 
                  icon={L.divIcon({
                    className: '',
                    html: `<div style="background:#111820cc; color:${color}; font-family:'JetBrains Mono',monospace; font-size:10px; padding:2px 6px; border-radius:4px; border:1px solid ${color}55; white-space:nowrap;">${station.distance_km.toFixed(1)} km</div>`,
                    iconAnchor: [20, 10],
                  })} 
                />
              )}
            </React.Fragment>
          );
        })}

        {/* GPS Accuracy Badge */}
        {userLocation && accuracy > 0 && (
          <div style={{
            position: 'absolute', bottom: showNearestCard ? '90px' : '12px', left: '12px', zIndex: 1000,
            background: '#111820cc', backdropFilter: 'blur(8px)',
            border: '1px solid #1e2d3d', borderRadius: '8px',
            padding: '6px 12px', fontFamily: "'JetBrains Mono', monospace",
            fontSize: '11px', display: 'flex', alignItems: 'center', transition: 'bottom 0.3s'
          }}>
            <span style={{
              display: 'inline-block', width: '6px', height: '6px',
              borderRadius: '50%', marginRight: '6px',
              background: accuracy < 50 ? '#00e676' : accuracy < 500 ? '#ffb300' : '#f44336'
            }}></span>
            <span style={{ color: accuracy < 50 ? '#00e676' : accuracy < 500 ? '#ffb300' : '#f44336', fontWeight: 600 }}>
              {accuracy < 50 ? `GPS · ±${Math.round(accuracy)}m` : accuracy < 500 ? `WiFi · ±${Math.round(accuracy)}m` : `IP only · ±${Math.round(accuracy/1000)}km`}
            </span>
          </div>
        )}

        <FitBounds stations={displayStations} userLocation={userLocation ?? undefined} />

        {/* Charging Stations */}
        {displayStations.map((station) => {
          const meta = stationMeta[station.id] ?? { hasNormal: true, hasFast: false, isMaintenance: false };
          const distanceText = meta.distance ? `${meta.distance.toFixed(1)} km away` : "";
          return (
            <Marker
              key={station.id}
              position={[station.latitude, station.longitude]}
              icon={createStationIcon(meta.hasNormal, meta.hasFast, meta.isMaintenance)}
              eventHandlers={{ click: () => onSelectStation(station) }}
            >
              <Popup>
                <div className="text-sm font-semibold mb-1">{station.name}</div>
                <div className="text-xs text-muted-foreground">{distanceText}</div>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
    </div>
  );
};

export default StationMap;
