import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api, setAuthToken } from '../../lib/apiClient.js'
import { useAuth } from '../../stores/auth.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Link } from 'react-router-dom'
import SignupImage from '../../assets/Signup.jpg'

export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const loginStore = useAuth(state => state.login)
  const navigate = useNavigate()

  async function onSubmit(e) {
    e.preventDefault()
    setMsg('')
    setErr('')
    try {
      if (!form.email || !form.password) {
        setErr('Email and password are required')
        return
      }
      setSubmitting(true)
      const { data } = await api.post('/v1/auth/login', form)
      setAuthToken(data?.accessToken)
      // Fetch current user for profile data
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
          <h1 className="text-xl font-semibold">Sign in</h1>
        </CardHeader>
        <CardContent>
          <form onSubmit={onSubmit} className="space-y-3">
            <div>
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} required />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })} required />
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Signing in…' : 'Sign in'}</Button>
          </form>
          <div className="mt-4 text-sm text-gray-600">
            <button type="button" className="underline" onClick={() => navigate('/auth/request-otp')}>Sign in with OTP instead</button>
          </div>
          <Link to='/auth/signup'><p className='text-blue-500 text-sm underline'>Don't have an Account with us?</p></Link>
          {msg && <p className="mt-3 text-green-600 text-sm">{msg}</p>}
          {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}


