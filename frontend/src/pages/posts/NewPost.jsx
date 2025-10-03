import { useEffect, useState } from 'react'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { useAuth } from '../../stores/auth.js'
import { CATEGORIES, CATEGORY_TEMPLATES } from '../../lib/constants.js'
import GoogleLocationPicker from '@/components/ui/google-location-picker'

export default function NewPost() {
  const currentUser = useAuth(s => s.user)
  const ownerId = currentUser?._id
  const [form, setForm] = useState({ type: 'LOST', title: '', description: '', category: '', tags: '' })
  const [customDetails, setCustomDetails] = useState('')
  const [files, setFiles] = useState([])
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [lat, setLat] = useState('')
  const [lng, setLng] = useState('')
  const [locationName, setLocationName] = useState('')
  useEffect(() => {
    // no-op: Google Places picker handles naming
  }, [])

  function normalizeDescription(desc) {
    const lines = String(desc || '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => (l.startsWith('- ') ? l : `- ${l}`))
    return lines.join('\n')
  }

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    try {
      if (!ownerId) {
        setErr('You must be signed in to create a post')
        return
      }
      if (!form.type || !form.title || !form.description || !form.category || !form.tags) {
        setErr('All fields are required')
        return
      }
      if (files.length === 0) {
        setErr('Please add at least one image')
        return
      }
      setSubmitting(true)
      const fd = new FormData()
      const combinedDescription = [normalizeDescription(form.description), normalizeDescription(customDetails)].filter(Boolean).join('\n')
      const normalized = { ...form, description: combinedDescription }
      Object.entries(normalized).forEach(([k, v]) => fd.append(k, v))
      if (lat && lng) {
        fd.append('lat', lat)
        fd.append('lng', lng)
      }
      if (locationName) fd.append('locationName', locationName)
      if (ownerId) fd.append('ownerId', ownerId)
      for (const f of files) fd.append('images', f)
      await api.post('/v1/posts', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Post created')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to create post')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Create Post</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label>Type</Label>
            <select className="border rounded-md ml-2 px-2 py-1" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} required>
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
            </div>
            {!ownerId && (
              <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-2">Owner will be set after auth</div>
            )}
            <div>
              <Label>Title</Label>
            <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required />
            </div>
            <div>
            <Label>Description</Label>
            <textarea
              className="w-full border rounded-md px-3 py-2 text-sm min-h-[120px]"
              placeholder="List key details. Press Enter to add a new bullet."
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              onKeyDown={e => {
                if (e.key === 'Enter') {
                  e.preventDefault()
                  const target = e.target
                  const start = target.selectionStart
                  const end = target.selectionEnd
                  const value = form.description || ''
                  const before = value.slice(0, start)
                  const after = value.slice(end)
                  const insert = (before.endsWith('\n') || before.length === 0 ? '' : '\n') + '- '
                  const next = before + '\n- ' + after
                  setForm({ ...form, description: next })
                  setTimeout(() => {
                    target.selectionStart = target.selectionEnd = start + insert.length + 1
                  }, 0)
                }
              }}
              required
            />
            <p className="text-xs text-gray-500 mt-1">Use concise bullets (e.g., color, brand, location, unique marks).</p>
            </div>
            <div>
            <Label>Category</Label>
            <select
              className="border rounded-md ml-2 px-2 py-1"
              value={form.category}
              onChange={e => {
                const nextCat = e.target.value
                setForm(prev => {
                  const next = { ...prev, category: nextCat }
                  const template = CATEGORY_TEMPLATES[nextCat]
                  if (template && !prev.description) {
                    next.description = template.map(t => `- ${t}`).join('\n')
                  }
                  return next
                })
              }}
              required
            >
              <option value="">Select category</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} required />
            </div>
            <div>
              <Label>Additional details</Label>
              <textarea
                className="w-full border rounded-md px-3 py-2 text-sm min-h-[100px]"
                placeholder="Any extra details. Press Enter to add a bullet."
                value={customDetails}
                onChange={e => setCustomDetails(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    e.preventDefault()
                    const target = e.target
                    const start = target.selectionStart
                    const end = target.selectionEnd
                    const value = customDetails || ''
                    const before = value.slice(0, start)
                    const after = value.slice(end)
                    const next = before + '\n- ' + after
                    setCustomDetails(next)
                    setTimeout(() => {
                      target.selectionStart = target.selectionEnd = start + 3
                    }, 0)
                  }
                }}
              />
            </div>
            <FileUpload label="Images" multiple onChange={setFiles} />
            <div>
              <Label>Location {`(This is the displayed Location)`}</Label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                <Input placeholder="ex: Chotu Dhaba,H-10 etc.." value={locationName} onChange={e => setLocationName(e.target.value)} />
              </div>
              <div className="mt-2 flex items-center gap-2">
                <Button type="button" variant="outline" onClick={() => {
                  if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition((pos) => {
                      const la = String(pos.coords.latitude)
                      const lo = String(pos.coords.longitude)
                      setLat(la)
                      setLng(lo)
                      if (window.google) {
                        const geocoder = new window.google.maps.Geocoder()
                        geocoder.geocode({ location: { lat: Number(la), lng: Number(lo) } }, (results, status) => {
                          if (status === 'OK' && results && results[0]) {
                            setLocationName(results[0].formatted_address)
                          }
                        })
                      }
                    })
                  }
                }}>Use my location</Button>
                {lat && lng && (
                  <span className="text-xs text-gray-600">Selected: {Number(lat).toFixed(3)}, {Number(lng).toFixed(3)}</span>
                )}
              </div>
              <GoogleLocationPicker
                lat={lat ? Number(lat) : undefined}
                lng={lng ? Number(lng) : undefined}
                locationName={locationName}
                placeholder="Type your location and choose from the suggestions"
                onChange={({ lat: la, lng: lo, locationName: name }) => {
                  setLat(String(la))
                  setLng(String(lo))
                  if (name) setLocationName(name)
                }}
              />
            </div>
            <Button type="submit" disabled={submitting}>{submitting ? 'Creating…' : 'Create'}</Button>
            {msg && <span className="ml-3 text-green-600 text-sm">{msg}</span>}
            {err && <span className="ml-3 text-red-600 text-sm">{err}</span>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


