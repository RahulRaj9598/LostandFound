import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../lib/apiClient.js'

export default function PublicProfile() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['public-profile', id],
    queryFn: async () => {
      const res = await api.get(`/v1/users/${id}`)
      return res.data
    }
  })

  if (isLoading) return <div className="mx-auto max-w-3xl p-4">Loading…</div>
  if (error) return <div className="mx-auto max-w-3xl p-4 text-red-600">Failed to load profile</div>

  const p = data?.profile || {}
  return (
    <div className="mx-auto max-w-3xl p-4">
      <div className="flex items-center gap-4">
        {p.avatarUrl ? (
          <img src={p.avatarUrl} alt="avatar" className="h-16 w-16 rounded-full object-cover" />
        ) : (
          <div className="h-16 w-16 rounded-full bg-gray-200" />
        )}
        <div>
          <h1 className="text-xl font-semibold">{p.name || 'User'}</h1>
        </div>
      </div>
    </div>
  )
}


