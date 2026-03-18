import { useEffect, useRef, useState, useCallback } from 'react';
import { BAKERY, calcDeliveryFee, MAX_COVERAGE_KM, type DeliveryFeeResult } from '../utils/deliveryFee';

interface DeliveryMapProps {
  onLocationSelected: (lat: number, lng: number, fee: number | null) => void;
  initialCoords?: { lat: number; lng: number } | null;
}

const MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_KEY || '';

// Promise global para no cargar el script más de una vez
let mapsReady: Promise<void> | null = null;

function loadGoogleMaps(): Promise<void> {
  if (mapsReady) return mapsReady;
  if (window.google?.maps?.Map) {
    mapsReady = Promise.resolve();
    return mapsReady;
  }
  mapsReady = new Promise((resolve, reject) => {
    const cb = `__gmapReady_${Date.now()}`;
    (window as any)[cb] = () => {
      delete (window as any)[cb];
      resolve();
    };
    const s = document.createElement('script');
    s.src = `https://maps.googleapis.com/maps/api/js?key=${MAPS_KEY}&libraries=places&callback=${cb}`;
    s.async = true;
    s.defer = true;
    s.onerror = () => { mapsReady = null; reject(new Error('Error cargando Google Maps')); };
    document.head.appendChild(s);
  });
  return mapsReady;
}

export function DeliveryMap({ onLocationSelected, initialCoords }: DeliveryMapProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);
  const mapRef = useRef<google.maps.Map | null>(null);
  const markerRef = useRef<google.maps.Marker | null>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const [result, setResult] = useState<DeliveryFeeResult | null>(null);
  const [loadError, setLoadError] = useState('');
  const [loaded, setLoaded] = useState(false);

  const placeMarker = useCallback((lat: number, lng: number) => {
    if (!mapRef.current) return;
    if (markerRef.current) markerRef.current.setMap(null);

    const marker = new google.maps.Marker({
      position: { lat, lng },
      map: mapRef.current,
      draggable: true,
      animation: google.maps.Animation.DROP,
      title: 'Tu ubicación',
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        fillColor: '#369db1',
        fillOpacity: 1,
        strokeColor: '#ffffff',
        strokeWeight: 3,
        scale: 10,
      },
    });
    markerRef.current = marker;

    const update = (lt: number, ln: number) => {
      const r = calcDeliveryFee(lt, ln);
      setResult(r);
      onLocationSelected(lt, ln, r.fee);
    };

    update(lat, lng);

    marker.addListener('dragend', () => {
      const pos = marker.getPosition()!;
      update(pos.lat(), pos.lng());
    });
  }, [onLocationSelected]);

  useEffect(() => {
    if (!MAPS_KEY) {
      setLoadError('Agrega VITE_GOOGLE_MAPS_KEY en frontend/.env para habilitar el mapa');
      return;
    }

    loadGoogleMaps()
      .then(() => {
        if (!containerRef.current || mapRef.current) return;

        const map = new google.maps.Map(containerRef.current, {
          center: { lat: BAKERY.lat, lng: BAKERY.lng },
          zoom: 14,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
          clickableIcons: false,
        });
        mapRef.current = map;

        // Marker de la panadería
        new google.maps.Marker({
          position: { lat: BAKERY.lat, lng: BAKERY.lng },
          map,
          title: BAKERY.name,
          zIndex: 10,
          icon: {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: '#cd733d',
            fillOpacity: 1,
            strokeColor: '#ffffff',
            strokeWeight: 3,
            scale: 11,
          },
        });

        // Círculo de cobertura
        new google.maps.Circle({
          center: { lat: BAKERY.lat, lng: BAKERY.lng },
          radius: (MAX_COVERAGE_KM / 1.3) * 1000,
          map,
          fillColor: '#cd733d',
          fillOpacity: 0.06,
          strokeColor: '#cd733d',
          strokeOpacity: 0.4,
          strokeWeight: 1.5,
        });

        // Autocomplete en el input de búsqueda
        if (searchRef.current) {
          const ac = new google.maps.places.Autocomplete(searchRef.current, {
            componentRestrictions: { country: 'cr' },
            fields: ['geometry', 'formatted_address'],
          });
          autocompleteRef.current = ac;
          ac.addListener('place_changed', () => {
            const place = ac.getPlace();
            if (!place.geometry?.location) return;
            const lat = place.geometry.location.lat();
            const lng = place.geometry.location.lng();
            map.panTo({ lat, lng });
            map.setZoom(16);
            placeMarker(lat, lng);
          });
        }

        // Click en el mapa para poner pin manualmente
        map.addListener('click', (e: google.maps.MapMouseEvent) => {
          if (!e.latLng) return;
          placeMarker(e.latLng.lat(), e.latLng.lng());
        });

        if (initialCoords) {
          placeMarker(initialCoords.lat, initialCoords.lng);
        }

        setLoaded(true);
      })
      .catch((err) => setLoadError(err.message));
  }, [placeMarker, initialCoords]);

  if (loadError) {
    return (
      <div className="bg-amber-50 border border-amber-200 text-amber-800 text-sm px-4 py-4 rounded-xl">
        <p className="font-semibold mb-1">⚠️ Mapa no disponible</p>
        <p className="text-xs">{loadError}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* Buscador de dirección */}
      <div className="relative">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input
          ref={searchRef}
          type="text"
          placeholder="Busca tu dirección en Costa Rica..."
          className="w-full pl-9 pr-4 py-2.5 border-2 border-gray-200 rounded-lg text-sm focus:outline-none focus:border-[#cd733d]"
        />
      </div>

      {/* Mapa */}
      <div className="relative rounded-xl border-2 border-gray-200" style={{ height: 300 }}>
        <div ref={containerRef} style={{ width: '100%', height: '100%', borderRadius: '10px' }} />
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-xl">
            <div className="text-center text-gray-400">
              <div className="w-8 h-8 border-4 border-[#cd733d] border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              <p className="text-sm">Cargando mapa...</p>
            </div>
          </div>
        )}
      </div>

      {/* Instrucción */}
      {loaded && !result && (
        <p className="text-sm text-gray-500 text-center py-2 bg-gray-50 rounded-xl">
          🔍 Busca tu dirección arriba <span className="text-gray-400">o</span> 👆 haz clic en el mapa para poner el pin
        </p>
      )}

      {/* Leyenda */}
      <div className="flex items-center gap-4 text-xs text-gray-500">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#cd733d]" /> La Gracia
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-3 h-3 rounded-full bg-[#369db1]" /> Tu ubicación
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-8 h-0.5 bg-[#cd733d] opacity-40 border border-dashed border-[#cd733d]" /> Zona de cobertura
        </span>
      </div>

      {/* Resultado del cálculo */}
      {result && (
        result.fee !== null ? (
          <div className="bg-[#FFF8F0] border border-[#cd733d]/30 rounded-xl px-4 py-3 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              <p className="font-semibold text-gray-900">📍 Distancia estimada</p>
              <p className="text-xs text-gray-500">~{result.estimatedRoadKm.toFixed(1)} km · Arrastra el pin para ajustar</p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Costo de envío</p>
              <p className="text-xl font-bold text-[#cd733d]">₡{result.fee.toLocaleString()}</p>
            </div>
          </div>
        ) : (
          <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
            <p className="font-semibold">⚠️ Fuera de zona de cobertura</p>
            <p className="text-xs mt-0.5">
              Tu ubicación está a ~{result.estimatedRoadKm.toFixed(1)} km. Solo hacemos entregas dentro de {MAX_COVERAGE_KM} km.
            </p>
          </div>
        )
      )}
    </div>
  );
}
