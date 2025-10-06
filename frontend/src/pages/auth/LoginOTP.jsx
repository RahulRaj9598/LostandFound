import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../../lib/apiClient.js'
import { useAuth } from '../../stores/auth.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import SignupImage from '../../assets/Signup.jpg'

export default function LoginOTP() {
  const [form, setForm] = useState({ email: '', code: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const loginStore = useAuth(state => state.login)
  const navigate = useNavigate()

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingLoginEmail')
    if (!pending) {
      navigate('/auth/request-otp')
      return
    }
    setForm(f => ({ ...f, email: pending }))
  }, [navigate])

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    try {
      if (!form.code) {
        setErr('OTP code is required')
        return
      }
      setSubmitting(true)
      const { data } = await api.post('/v1/auth/login-otp', form)
      setAuthToken(data?.accessToken)
      const me = await api.get('/v1/users/me', { headers: { Authorization: `Bearer ${data?.accessToken}` } })
      loginStore({ token: data?.accessToken, refreshToken: data?.refreshToken, user: me?.data || { email: form.email } })
      setMsg('Logged in')
      navigate('/home')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Login failed')
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
          <h1 className="text-xl font-semibold">Verify OTP</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} readOnly />
            </div>
            <div>
              <Label htmlFor="code">OTP Code</Label>
              <Input id="code" value={form.code} onChange={e => setForm({ ...form, code: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Verifying…' : 'Login'}</Button>
          </form>
          {msg && <p className="mt-3 text-green-600 text-sm">{msg}</p>}
          {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}


