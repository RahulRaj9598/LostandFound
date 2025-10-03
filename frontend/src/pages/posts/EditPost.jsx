import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function EditPost() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => (await api.get(`/v1/posts/${id}`)).data
  })
  const [form, setForm] = useState({ title: '', description: '', category: '', tags: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    if (data) setForm({ title: data.title || '', description: data.description || '', category: data.category || '', tags: (data.tags || []).join(',') })
  }, [data])

  async function onSave(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    try {
      setSaving(true)
      const body = { ...form, tags: form.tags }
      await api.patch(`/v1/posts/${id}`, body)
      setMsg('Saved')
      navigate(`/posts/${id}`)
    } catch (e) {
      setErr(e?.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  if (isLoading) return <div className="mx-auto max-w-3xl p-4">Loading…</div>
  if (error) return <div className="mx-auto max-w-3xl p-4 text-red-600">Failed to load</div>

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Edit Post</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSave} className="space-y-3">
            <div>
              <Label>Title</Label>
              <Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
            </div>
            <div>
              <Label>Description</Label>
              <Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
            </div>
            <div>
              <Label>Category</Label>
              <Input value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} />
            </div>
            <div>
              <Label>Tags (comma separated)</Label>
              <Input value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} />
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
            {msg && <span className="ml-3 text-green-600 text-sm">{msg}</span>}
            {err && <span className="ml-3 text-red-600 text-sm">{err}</span>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


