import { useParams, Link } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Button } from '@/components/ui/button'

export default function PostClaims() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const [flaggedIds, setFlaggedIds] = useState(new Set())
  const [decisions, setDecisions] = useState({}) // { [claimId]: 'ACCEPTED' | 'REJECTED' | 'REJECT_FALSE' }
  const { data, isLoading, error } = useQuery({
    queryKey: ['claims', { postId: id }],
    queryFn: async () => (await api.get(`/v1/claims?postId=${id}`)).data
  })

  const decide = useMutation({
    mutationFn: async ({ claimId, status, flagFalseClaim }) => (await api.patch(`/v1/claims/${claimId}`, { status, flagFalseClaim })).data,
    onSuccess: (_data, variables) => {
      if (variables?.flagFalseClaim) {
        setFlaggedIds(prev => new Set(prev).add(variables.claimId))
        setDecisions(prev => ({ ...prev, [variables.claimId]: 'REJECT_FALSE' }))
      } else if (variables?.status === 'ACCEPTED') {
        setDecisions(prev => ({ ...prev, [variables.claimId]: 'ACCEPTED' }))
      } else if (variables?.status === 'REJECTED') {
        setDecisions(prev => ({ ...prev, [variables.claimId]: 'REJECTED' }))
      }
      queryClient.invalidateQueries({ queryKey: ['claims', { postId: id }] })
    }
  })

  return (
    <div className="mx-auto max-w-4xl p-4 space-y-4">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold">Claims for this Post</h1>
            <Link to={`/posts/${id}`} className="text-sm underline">Back to Post</Link>
          </div>
        </CardHeader>
        <CardContent>
          {isLoading && <div className="text-sm text-gray-500">Loading…</div>}
          {error && <div className="text-sm text-red-600">Failed to load claims</div>}
          {!isLoading && (!data || data.length === 0) && <div className="text-sm text-gray-500">No claims yet.</div>}
          <div className="space-y-3">
            {(data || []).map((c) => (
              <div key={c._id} className="rounded-md border p-3 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-gray-500">Status: {c.status} {c.flaggedFalse ? '(flagged)' : ''}</div>
                    <div className="text-sm">{c.message}</div>
                  </div>
                  <div className="flex gap-2">
                    {(() => { const locked = !!decisions[c._id] || c.status !== 'PENDING' || !!c.flaggedFalse; return (
                    <>
                    <Button onClick={() => decide.mutate({ claimId: c._id, status: 'ACCEPTED' })} disabled={decide.isPending || locked} className={decisions[c._id] === 'ACCEPTED' || c.status === 'ACCEPTED' ? 'bg-green-600 text-white hover:bg-green-700' : ''}>Accept</Button>
                    <Button variant="destructive" onClick={() => decide.mutate({ claimId: c._id, status: 'REJECTED' })} disabled={decide.isPending || locked} className={decisions[c._id] === 'REJECTED' || c.status === 'REJECTED' ? 'bg-red-600 text-white hover:bg-red-700' : ''}>Reject</Button>
                    <Button
                      variant="destructive"
                      onClick={() => decide.mutate({ claimId: c._id, status: 'REJECTED', flagFalseClaim: true })}
                      disabled={decide.isPending || flaggedIds.has(c._id) || !!decisions[c._id] || locked}
                      className={decisions[c._id] === 'REJECT_FALSE' || c.flaggedFalse ? 'bg-red-700 text-white' : ''}
                    >
                      {flaggedIds.has(c._id) || decisions[c._id] === 'REJECT_FALSE' || c.flaggedFalse ? 'Flagged' : 'Reject as False'}
                    </Button>
                    </> )})()}
                    <Link to={`/claims/${c._id}/contact`} className="px-3 py-1.5 rounded-md border">Contact</Link>
                  </div>
                </div>
                {Array.isArray(c.evidence) && c.evidence.length > 0 && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {c.evidence.map((ev, idx) => (
                      <a key={idx} href={ev.url} target="_blank" rel="noreferrer" className="block" onClick={(e) => {
                        if (!window.confirm('Open this evidence image in a new tab?')) { e.preventDefault() }
                      }}>
                        <img src={ev.url} alt={`evidence-${idx+1}`} className="w-full h-32 object-cover rounded" />
                      </a>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


