import { useEffect, useRef } from 'react'

export default function LocationPicker({ lat, lng, onChange }) {
  const mapRef = useRef(null)
  const leafletRef = useRef(null)

  useEffect(() => {
    if (!window.L || !mapRef.current) return
    if (leafletRef.current) return
    const L = window.L
    const map = L.map(mapRef.current).setView([lat || 20.5937, lng || 78.9629], lat && lng ? 13 : 5)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap'
    }).addTo(map)
    let marker
    function setMarker(latlng) {
      if (marker) marker.setLatLng(latlng)
      else marker = L.marker(latlng, { draggable: true }).addTo(map)
      if (onChange) onChange({ lat: latlng.lat, lng: latlng.lng })
      marker.on('dragend', (e) => {
        const m = e.target
        const p = m.getLatLng()
        if (onChange) onChange({ lat: p.lat, lng: p.lng })
      })
    }
    map.on('click', (e) => setMarker(e.latlng))
    if (lat && lng) setMarker({ lat, lng })
    leafletRef.current = { map }
  }, [lat, lng, onChange])

  return (
    <div className="mt-2">
      <div ref={mapRef} className="w-full h-64 rounded-md border" />
      <p className="text-xs text-gray-500 mt-1">Click the map to set location, or drag the marker to adjust.</p>
    </div>
  )
}


