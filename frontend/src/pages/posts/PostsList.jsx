import { useEffect, useMemo, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'react-router-dom'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { CATEGORIES } from '../../lib/constants.js'
import { PostCard } from '@/components/ui/post-card'

export default function PostsList() {
  const [searchParams, setSearchParams] = useSearchParams()
  const type = searchParams.get('type') || ''
  const category = searchParams.get('category') || ''
  const [location, setLocation] = useState(searchParams.get('location') || '')
  const queryKey = useMemo(() => ['posts', { type, category, location }], [type, category, location])
  const queryString = useMemo(() => {
    const params = new URLSearchParams()
    if (type) params.set('type', type)
    if (category) params.set('category', category)
    if (location) params.set('location', location)
    return params.toString()
  }, [type, category, location])
  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: async () => {
      const res = await api.get(`/v1/posts?${queryString}`)
      return res.data
    },
    staleTime: 60_000
  })

  // keep URL in sync when location text changes (debounced)
  useEffect(() => {
    const t = setTimeout(() => {
      const next = new URLSearchParams(searchParams)
      if (location) next.set('location', location); else next.delete('location')
      setSearchParams(next)
    }, 300)
    return () => clearTimeout(t)
  }, [location, searchParams, setSearchParams])

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <select className="border rounded-md px-2 py-1" value={type} onChange={e => {
              const next = new URLSearchParams(searchParams)
              if (e.target.value) next.set('type', e.target.value); else next.delete('type')
              setSearchParams(next)
            }}>
              <option value="">All</option>
              <option value="LOST">Lost</option>
              <option value="FOUND">Found</option>
            </select>
            <select className="border rounded-md px-2 py-1" value={category} onChange={e => {
              const next = new URLSearchParams(searchParams)
              if (e.target.value) next.set('category', e.target.value); else next.delete('category')
              setSearchParams(next)
            }}>
              <option value="">All categories</option>
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            <Input placeholder="Filter by location" value={location} onChange={e => setLocation(e.target.value)} />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-gray-500">Loading posts…</div>}
          {!isLoading && (!data || data.length === 0) && (
            <div className="text-sm text-gray-500">No posts found. Try adjusting filters.</div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(data || []).map((p) => (
              <PostCard key={p._id} post={p} />
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


