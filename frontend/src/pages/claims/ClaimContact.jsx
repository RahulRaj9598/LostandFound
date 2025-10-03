import { useParams } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

export default function ClaimContact() {
  const { id } = useParams()
  const { data, isLoading, error } = useQuery({
    queryKey: ['claim-contact', id],
    queryFn: async () => {
      const res = await api.get(`/v1/claims/${id}/contact`)
      return res.data
    }
  })

  return (
    <div className="mx-auto max-w-3xl p-4">
      <Card>
        <CardHeader>
          <h1 className="text-xl font-semibold">Contact Details</h1>
        </CardHeader>
        <CardContent>
          {isLoading && <div>Loading...</div>}
          {error && <div className="text-red-600">{error?.response?.data?.error || 'Not available'}</div>}
          {data && (
            <div className="space-y-3">
              <div>
                <div className="font-medium">Owner</div>
                <div className="text-sm text-gray-600">Email: {data.ownerContact?.email || '—'}</div>
                <div className="text-sm text-gray-600">Phone: {data.ownerContact?.phone || '—'}</div>
              </div>
              <div>
                <div className="font-medium">Requester</div>
                <div className="text-sm text-gray-600">Email: {data.requesterContact?.email || '—'}</div>
                <div className="text-sm text-gray-600">Phone: {data.requesterContact?.phone || '—'}</div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}


