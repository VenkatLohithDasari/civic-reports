// components/maps/LocationPickerMap.tsx
'use client'

import { useState, useMemo, useCallback, useEffect } from 'react'
import { MapContainer, TileLayer, Marker, useMap, useMapEvents } from 'react-leaflet'
import { LatLngExpression, LatLng } from 'leaflet'
import debounce from 'lodash/debounce'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet';

// Icon fix
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
});

interface LocationPickerProps {
    onLocationChange: (lat: number, lon: number, address: string) => void;
}

function MapEvents({ onPositionChange }: { onPositionChange: (position: LatLng) => void }) {
    const map = useMap()

    useEffect(() => {
        map.locate().on('locationfound', function (e) {
            onPositionChange(e.latlng)
            map.flyTo(e.latlng, 15) // Zoom in on user's location
        })
    }, [map, onPositionChange])

    useMapEvents({
        click(e) {
            onPositionChange(e.latlng)
        },
    })

    return null
}

export default function LocationPickerMap({ onLocationChange }: LocationPickerProps) {
    const [position, setPosition] = useState<LatLng | null>(null)

    // Debounced reverse geocoding function
    const debouncedGeocode = useMemo(
        () =>
            debounce((lat, lng) => {
                fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`)
                    .then(res => res.json())
                    .then(data => {
                        onLocationChange(lat, lng, data.display_name || `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`)
                    })
                    .catch(() => {
                        onLocationChange(lat, lng, `Lat: ${lat.toFixed(5)}, Lon: ${lng.toFixed(5)}`)
                    })
            }, 800), // 800ms delay after user stops interacting
        [onLocationChange]
    )

    const handlePositionChange = useCallback((newPosition: LatLng) => {
        setPosition(newPosition)
        // We always update the internal position instantly for a responsive pin
        // But we only call the geocoding API after a delay
        debouncedGeocode(newPosition.lat, newPosition.lng)
    }, [debouncedGeocode])

    const markerEventHandlers = useMemo(
        () => ({
            dragend(e: any) {
                handlePositionChange(e.target.getLatLng())
            },
        }),
        [handlePositionChange],
    )

    const center: LatLngExpression = [21.7679, 78.8718] // Default center of India

    return (
        <MapContainer center={center} zoom={5} scrollWheelZoom={true} style={{ height: '400px', width: '100%', borderRadius: '12px' }}>
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <MapEvents onPositionChange={handlePositionChange} />
            {position && (
                <Marker
                    draggable={true}
                    eventHandlers={markerEventHandlers}
                    position={position}
                />
            )}
        </MapContainer>
    )
}
