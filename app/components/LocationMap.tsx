import { useEffect, useRef } from 'react';

interface LocationMapProps {
  location: string;
  className?: string;
  onLocationChange?: (location: string) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export function LocationMap({ location, className = '', onLocationChange }: LocationMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);

  useEffect(() => {
    if (!location || !mapRef.current || !window.google) return;

    const geocoder = new window.google.maps.Geocoder();
    
    geocoder.geocode({ address: location }, (results: any[], status: string) => {
      if (status === 'OK' && results[0]) {
        const position = results[0].geometry.location;

        // Initialize map if it doesn't exist
        if (!mapInstanceRef.current) {
          mapInstanceRef.current = new window.google.maps.Map(mapRef.current, {
            center: position,
            zoom: 15,
            mapTypeControl: false,
            streetViewControl: false,
            fullscreenControl: false,
          });

          // Add click listener to the map
          mapInstanceRef.current.addListener('click', (event: any) => {
            const clickedPosition = event.latLng;
            geocoder.geocode({ location: clickedPosition }, (results: any[], status: string) => {
              if (status === 'OK' && results[0] && onLocationChange) {
                onLocationChange(results[0].formatted_address);
              }
            });
          });
        } else {
          mapInstanceRef.current.setCenter(position);
        }

        // Update or create marker
        if (markerRef.current) {
          markerRef.current.setPosition(position);
        } else {
          markerRef.current = new window.google.maps.Marker({
            position,
            map: mapInstanceRef.current,
            title: location,
            draggable: true,
          });

          // Add drag listener to the marker
          markerRef.current.addListener('dragend', () => {
            const newPosition = markerRef.current.getPosition();
            geocoder.geocode({ location: newPosition }, (results: any[], status: string) => {
              if (status === 'OK' && results[0] && onLocationChange) {
                onLocationChange(results[0].formatted_address);
              }
            });
          });
        }
      }
    });
  }, [location, onLocationChange]);

  if (!location) return null;

  return (
    <div 
      ref={mapRef} 
      className={`w-full h-[300px] rounded-xl overflow-hidden ${className}`}
    />
  );
} 