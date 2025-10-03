import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { useAuth } from '../stores/auth.js'

export default function Profile() {
  const [msg, setMsg] = useState('')
  const [err, setErr] = useState('')
  const queryClient = useQueryClient()
  const setUser = useAuth(s => s.setUser)
  const { data } = useQuery({
    queryKey: ['me'],
    queryFn: async () => {
      const res = await api.get('/v1/users/me')
      return res.data
    }
  })
  const mutation = useMutation({
    mutationFn: async (body) => {
      const res = await api.patch('/v1/users/me', body)
      return res.data
    },
    onMutate: async (next) => {
      setMsg('')
      setErr('')
      await queryClient.cancelQueries({ queryKey: ['me'] })
      const previous = queryClient.getQueryData(['me'])
      queryClient.setQueryData(['me'], (old) => ({ ...old, profile: { ...(old?.profile || {}), ...next } }))
      return { previous }
    },
    onError: (e, _vars, ctx) => {
      queryClient.setQueryData(['me'], ctx?.previous)
      setErr(e?.response?.data?.error || 'Save failed')
    },
    onSuccess: (fresh) => {
      queryClient.setQueryData(['me'], fresh)
      setUser(fresh)
      setMsg('Saved')
    }
  })

  if (!data) return <div className="mx-auto max-w-3xl p-4">Loading...</div>
  const p = data.profile || {}

  return (
    <div className="mx-auto max-w-3xl p-4 space-y-6">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Your Profile</h1>
        </CardHeader>
        <CardContent>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              mutation.mutate({
                name: p.name,
                phone: p.phone,
                contactPrefs: p.contactPrefs
              })
            }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4">
              {p.avatarUrl ? (
                <img src={p.avatarUrl} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
              ) : (
                <div className="h-16 w-16 rounded-full bg-gray-200" />
              )}
              <div className="flex-1">
                <Label>Avatar</Label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setMsg('')
                    setErr('')
                    try {
                      const fd = new FormData()
                      fd.append('avatar', file)
                    const res = await api.post('/v1/users/me/avatar', fd, { headers: { 'Content-Type': 'multipart/form-data' } })
                    queryClient.setQueryData(['me'], res.data)
                    setUser(res.data)
                      setMsg('Avatar updated')
                    } catch (e) {
                      setErr(e?.response?.data?.error || 'Failed to upload avatar')
                    }
                  }}
                  className="block w-full text-sm text-gray-600 file:mr-3 file:py-2 file:px-3 file:rounded-md file:border file:text-sm file:font-medium file:bg-white file:hover:bg-gray-50"
                />
              </div>
            </div>
            <div>
              <Label>Name</Label>
              <Input value={p.name || ''} onChange={e => queryClient.setQueryData(['me'], { ...data, profile: { ...p, name: e.target.value } })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={p.phone || ''} onChange={e => queryClient.setQueryData(['me'], { ...data, profile: { ...p, phone: e.target.value } })} />
            </div>
            <div>
              <Label>Share email on accepted claim</Label>
              <input type="checkbox" className="ml-2" checked={p.contactPrefs?.shareEmailOnAcceptedClaim || false}
                onChange={e => queryClient.setQueryData(['me'], { ...data, profile: { ...p, contactPrefs: { ...p.contactPrefs, shareEmailOnAcceptedClaim: e.target.checked } } })} />
            </div>
            <div>
              <Label>Share phone on accepted claim</Label>
              <input type="checkbox" className="ml-2" checked={p.contactPrefs?.sharePhoneOnAcceptedClaim || false}
                onChange={e => queryClient.setQueryData(['me'], { ...data, profile: { ...p, contactPrefs: { ...p.contactPrefs, sharePhoneOnAcceptedClaim: e.target.checked } } })} />
            </div>
            <Button type="submit" disabled={mutation.isPending}>{mutation.isPending ? 'Saving…' : 'Save'}</Button>
            {msg && <span className="ml-3 text-green-600 text-sm">{msg}</span>}
            {err && <span className="ml-3 text-red-600 text-sm">{err}</span>}
          </form>
        </CardContent>
      </Card>
    </div>
  )
}


