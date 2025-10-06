import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { api } from '../../lib/apiClient.js'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import SignupImage from '../../assets/Signup.jpg'

export default function VerifyEmail() {
  const [form, setForm] = useState({ email: '', code: '' })
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    const pending = sessionStorage.getItem('pendingSignupEmail')
    if (!pending) {
      // Block direct access
      navigate('/auth/signup')
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
        setErr('Code is required')
        return
      }
      setSubmitting(true)
      const { data } = await api.post('/v1/auth/verify-email', form)
      setMsg(data?.message || 'Email verified')
      navigate('/auth/login')
    } catch (e) {
      setErr(e?.response?.data?.error || 'Verification failed')
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
          <h1 className="text-xl font-semibold">Verify your email</h1>
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
            <Button type="submit" className="w-full" disabled={submitting}>{submitting ? 'Verifying…' : 'Verify'}</Button>
          </form>
          {msg && <p className="mt-3 text-green-600 text-sm">{msg}</p>}
          {err && <p className="mt-3 text-red-600 text-sm">{err}</p>}
        </CardContent>
      </Card>
      </div>
    </div>
  )
}


