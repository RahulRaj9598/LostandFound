import { useParams, Link } from 'react-router-dom'
import { useAuth } from '../../stores/auth.js'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'
import { Button } from '@/components/ui/button'

export default function PostDetail() {
  const { id } = useParams()
  const me = useAuth(s => s.user)
  const { data, isLoading, error } = useQuery({
    queryKey: ['post', id],
    queryFn: async () => (await api.get(`/v1/posts/${id}`)).data
  })

  if (isLoading) return <div className="mx-auto max-w-4xl p-4">Loading…</div>
  if (error) return <div className="mx-auto max-w-4xl p-4 text-red-600">Failed to load</div>

  const p = data
  const isOwner = me && p && String(me._id) === String(p.ownerId)
  return (
    <div className="mx-auto max-w-4xl p-4 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          {(p.images || []).map((img) => (
            <img key={img.url} src={img.url} alt={img.alt || p.title} className="w-full rounded-lg border" />
          ))}
        </div>
        <div className="space-y-3">
          <div className="text-sm text-gray-500">{p.type} • {p.category || 'General'}</div>
          <h1 className="text-2xl font-semibold">{p.title}</h1>
          <pre className="whitespace-pre-wrap text-sm text-gray-700">{p.description}</pre>
          <div className="flex gap-3">
            {!isOwner && <Link to={`/claims/${id}/new`}><Button>Submit Claim</Button></Link>}
            <Link to={`/posts/${id}/claims`}><Button variant="outline">View Claims</Button></Link>
          </div>
        </div>
      </div>
    </div>
  )
}


