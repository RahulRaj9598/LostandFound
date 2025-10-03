import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { FileUpload } from '@/components/ui/file-upload'
import { useAuth } from '../../stores/auth.js'

export default function NewClaim() {
  const { id } = useParams()
  const currentUser = useAuth(s => s.user)
  const requesterId = currentUser?._id
  const [form, setForm] = useState({ message: '' })
  const [files, setFiles] = useState([])
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    try {
      if (!form.message) {
        setErr('Please add a brief message for your claim')
        return
      }
      setSubmitting(true)
      const fd = new FormData()
      if (requesterId) fd.append('requesterId', requesterId)
      fd.append('message', form.message)
      for (const f of files) fd.append('evidence', f)
      await api.post(`/v1/claims/${id}`, fd, { headers: { 'Content-Type': 'multipart/form-data' } })
      setMsg('Claim submitted')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Failed to submit claim')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Submit Claim</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            {!requesterId && (
              <div className="text-sm text-yellow-700 bg-yellow-50 border border-yellow-200 rounded-md p-2">Requester will be set after auth</div>
            )}
            <div>
              <Label>Message</Label>
              <Input value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} />
            </div>
            <FileUpload label="Evidence" multiple onChange={setFiles} />
            <Button type="submit" disabled={submitting}>{submitting ? 'Submitting…' : 'Submit'}</Button>
            {msg && <span className="ml-3 text-green-600 text-sm">{msg}</span>}
            {err && <span className="ml-3 text-red-600 text-sm">{err}</span>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


