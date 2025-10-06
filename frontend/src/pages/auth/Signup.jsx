import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/apiClient.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Eye, EyeOff } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import SignupImage from '../../assets/Signup.jpg'

export default function Signup() {
  const [form, setForm] = useState({ email: '', password: '', name: '' })
  const [showPassword, setShowPassword] = useState(false)
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
      <div className="min-h-screen bg-white/60 backdrop-blur-sm flex items-center justify-center p-4 flex-col">
      <h1 className=' text-md font-bold text-blue-700'>Please Check your SPAM for OTP once</h1>
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
              <div className="flex items-center">
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="flex-1"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(s => !s)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  title={showPassword ? 'Hide password' : 'Show password'}
                  className="ml-2 text-gray-700 hover:text-gray-900 p-2 rounded focus:outline-none focus:ring-2 focus:ring-offset-1"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Signing up…' : 'Sign up'}</Button>
          </form>
          <br />
          <Link to='/auth/login'><p className='text-blue-500 underline text-sm'>Already have an Account with us?</p></Link>

          {msg && <p className="mt-3 text-green-600 text-sm">{msg}</p>}
          {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}


