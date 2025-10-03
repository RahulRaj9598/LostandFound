import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { PostCard } from '@/components/ui/post-card'
import { useAuth } from '../../stores/auth.js'

export default function MyPosts() {
  const me = useAuth(s => s.user)
  const ownerId = me?._id
  const [type, setType] = useState('')
  const [category, setCategory] = useState('')
  const queryClient = useQueryClient()

  const queryKey = useMemo(() => ['my-posts', { ownerId, type, category }], [ownerId, type, category])
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (ownerId) params.set('ownerId', ownerId)
    if (type) params.set('type', type)
    if (category) params.set('category', category)
    return params.toString()
  }, [ownerId, type, category])

  const { data, isLoading } = useQuery({
    enabled: !!ownerId,
    queryKey,
    queryFn: async () => {
      const res = await api.get(`/v1/posts?${queryString}`)
      return res.data
    }
  })

  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await api.delete(`/v1/posts/${id}`)
      return id
    },
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey })
      const prev = queryClient.getQueryData(queryKey)
      queryClient.setQueryData(queryKey, (old) => (old || []).filter(p => p._id !== id))
      return { prev }
    },
    onError: (_e, _id, ctx) => {
      if (ctx?.prev) queryClient.setQueryData(queryKey, ctx.prev)
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey })
    }
  })

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:justify-between">
            <div>
              <h1 className="text-xl font-semibold">My Posts</h1>
              <p className="text-sm text-gray-600">Manage your Lost and Found posts</p>
            </div>
            <div className="flex items-center gap-3">
              <select className="border rounded-md px-2 py-1" value={type} onChange={e => setType(e.target.value)}>
                <option value="">All</option>
                <option value="LOST">Lost</option>
                <option value="FOUND">Found</option>
              </select>
              <Input placeholder="Filter by category" value={category} onChange={e => setCategory(e.target.value)} />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-gray-500">Loading…</div>}
          {!isLoading && (!data || data.length === 0) && <div className="text-sm text-gray-500">No posts yet.</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data || []).map((p) => (
              <div key={p._id} className="relative group">
                <PostCard post={p} onDelete={(id) => deleteMutation.mutate(id)} />
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="destructive" onClick={() => { if (window.confirm('Delete this post?')) deleteMutation.mutate(p._id) }}>Delete</Button>
                </div>
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">

                  <Link to={`/posts/${p._id}/claims`}><Button variant="default" >Claims</Button></Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


