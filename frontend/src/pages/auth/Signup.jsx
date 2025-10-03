import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/apiClient.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import SignupImage from '../../assets/Signup.jpg'

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    try {
      if (!form.name || !form.email) {
        setErr('Name and email are required')
        return
      }
      setSubmitting(true)
      await api.post('/v1/auth/signup', form)
      // Gate access: store pending email and navigate to verify
      sessionStorage.setItem('pendingSignupEmail', form.email)
      setMsg('OTP sent to your email. Redirecting to verify...')
      navigate('/auth/verify')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Signup failed')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div
      className="min-h-screen"
      style={{
        backgroundImage: `url(${SignupImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      <div className="min-h-screen bg-white/60 backdrop-blur-sm flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <h1 className="text-xl font-semibold">Create your account</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input id="name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Signing up…' : 'Sign up'}</Button>
          </form>
          {msg && <p className="mt-3 text-green-600 text-sm">{msg}</p>}
          {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}


