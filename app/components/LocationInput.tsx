import { useEffect, useRef } from 'react';
import { LocationMap } from './LocationMap';

interface LocationInputProps {
  value: string;
  onChange: (value: string) => void;
  locationType: 'real-life' | 'online' | null;
  onLocationTypeChange: (type: 'real-life' | 'online' | null) => void;
}

declare global {
  interface Window {
    google: any;
  }
}

export function LocationInput({ value, onChange, locationType, onLocationTypeChange }: LocationInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<any>(null);

  useEffect(() => {
    if (locationType === 'real-life' && inputRef.current && window.google) {
      // Initialize Places Autocomplete
      autocompleteRef.current = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['establishment', 'geocode'],
      });

      // Add listener for place selection
      autocompleteRef.current.addListener('place_changed', () => {
        const place = autocompleteRef.current.getPlace();
        if (place.formatted_address) {
          onChange(place.formatted_address);
        }
      });
    }

    // Cleanup
    return () => {
      if (autocompleteRef.current) {
        window.google.maps.event.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [locationType, onChange]);

  const handleMapLocationChange = (newLocation: string) => {
    onChange(newLocation);
  };

  if (!locationType) {
    return (
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => onLocationTypeChange('real-life')}
          className="flex-1 px-4 py-3 rounded-xl border transition-all bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105 active:scale-95"
        >
          Real Life
        </button>
        <button
          type="button"
          onClick={() => onLocationTypeChange('online')}
          className="flex-1 px-4 py-3 rounded-xl border transition-all bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transform hover:scale-105 active:scale-95"
        >
          Online
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required
          className="flex-1 px-4 py-3 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          placeholder={locationType === 'online' ? "e.g., Zoom, Google Meet, Discord" : "Enter a location"}
        />
        <button
          type="button"
          onClick={() => onLocationTypeChange(null)}
          className="px-4 py-3 rounded-xl border transition-all bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 whitespace-nowrap transform hover:scale-105 active:scale-95"
        >
          Change
        </button>
      </div>
      {locationType === 'real-life' && value && (
        <LocationMap 
          location={value} 
          onLocationChange={handleMapLocationChange}
        />
      )}
    </div>
  );
} 