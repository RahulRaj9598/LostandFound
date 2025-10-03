import { useParams } from 'react-router-dom'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'

export default function ClaimDetail() {
  const { id } = useParams()
  const queryClient = useQueryClient()
  const { data, isLoading, error } = useQuery({
    queryKey: ['claim', id],
    queryFn: async () => (await api.get(`/v1/claims/${id}`)).data
  })
  const mutation = useMutation({
    mutationFn: async (body) => (await api.patch(`/v1/claims/${id}`, body)).data,
    onSuccess: (fresh) => {
      queryClient.setQueryData(['claim', id], fresh)
    }
  })

  if (isLoading) return <div className="mx-auto max-w-3xl p-4">Loading…</div>
  if (error) return <div className="mx-auto max-w-3xl p-4 text-red-600">Failed to load</div>

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Claim</h1>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label>Status</Label>
              <Input value={data.status || 'PENDING'} readOnly />
            </div>
            <div>
              <Label>Message</Label>
              <Input value={data.message || ''} readOnly />
            </div>
            <div className="flex gap-3">
              <Button onClick={() => mutation.mutate({ status: 'ACCEPTED' })}>Accept</Button>
              <Button variant="destructive" onClick={() => mutation.mutate({ status: 'REJECTED' })}>Reject</Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}


