import { useEffect, useRef } from 'react'

export default function GoogleLocationPicker({ lat, lng, locationName, onChange }) {
  const mapEl = useRef(null)
  const inputEl = useRef(null)
  const mapRef = useRef(null)
  const markerRef = useRef(null)

  useEffect(() => {
    if (!window.google || !mapEl.current) return
    if (!mapRef.current) {
      const center = { lat: lat || 20.5937, lng: lng || 78.9629 }
      const map = new window.google.maps.Map(mapEl.current, { center, zoom: lat && lng ? 13 : 5 })
      const input = inputEl.current
      const autocomplete = new window.google.maps.places.Autocomplete(input, { fields: ['geometry', 'formatted_address', 'name'] })
      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()
        if (!place?.geometry?.location) return
        const p = place.geometry.location
        map.panTo(p)
        map.setZoom(15)
        setMarker(map, p)
        if (onChange) onChange({ lat: p.lat(), lng: p.lng(), locationName: place.formatted_address || place.name || '' })
      })
      map.addListener('click', (e) => {
        setMarker(map, e.latLng)
        if (onChange) onChange({ lat: e.latLng.lat(), lng: e.latLng.lng(), locationName: input.value || '' })
      })
      mapRef.current = map
    }
    // initialize marker if provided
    if (lat && lng && mapRef.current && !markerRef.current) {
      const pos = new window.google.maps.LatLng(lat, lng)
      setMarker(mapRef.current, pos)
    }
  }, [lat, lng, onChange])

  function setMarker(map, position) {
    if (markerRef.current) {
      markerRef.current.setPosition(position)
      return
    }
    const mk = new window.google.maps.Marker({ position, map, draggable: true })
    mk.addListener('dragend', (e) => {
      const p = e.latLng
      if (onChange) onChange({ lat: p.lat(), lng: p.lng(), locationName: inputEl.current?.value || '' })
    })
    markerRef.current = mk
  }

  return (
    <div className="mt-2">
      <input ref={inputEl} defaultValue={locationName} placeholder="Search place" className="w-full border rounded-md px-3 py-2 text-sm mb-2" />
      <div ref={mapEl} className="w-full h-64 rounded-md border" />
      <p className="text-xs text-gray-500 mt-1">Search or click map to set an approximate location.</p>
    </div>
  )
}


