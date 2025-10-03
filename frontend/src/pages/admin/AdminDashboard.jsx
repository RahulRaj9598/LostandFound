import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'
import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useAuth } from '../../stores/auth.js'

export default function AdminDashboard() {
  const me = useAuth(s => s.user)
  const [activeTab, setActiveTab] = useState('users')
  const queryClient = useQueryClient()
  const isAdmin = !!(me && me.role === 'ADMIN')
  const usersQ = useQuery({
    queryKey: ['admin-users'],
    queryFn: async () => (await api.get('/v1/admin/users')).data,
    enabled: isAdmin
  })
  const allUsersQ = useQuery({
    queryKey: ['admin-users-all'],
    queryFn: async () => (await api.get('/v1/admin/users/all')).data,
    enabled: isAdmin
  })
  const claimsQ = useQuery({
    queryKey: ['admin-claims'],
    queryFn: async () => (await api.get('/v1/admin/claims')).data,
    enabled: isAdmin
  })

  const approve = useMutation({
    mutationFn: async (id) => (await api.patch(`/v1/admin/users/${id}/approve`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  })
  const reject = useMutation({
    mutationFn: async (id) => (await api.patch(`/v1/admin/users/${id}/reject`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-users'] })
  })
  const decide = useMutation({
    mutationFn: async ({ id, decision }) => (await api.patch(`/v1/admin/claims/${id}/decision`, { decision })).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin-claims'] })
  })

  if (!isAdmin) return <Navigate to="/home" replace />

  return (
    <div className="mx-auto max-w-6xl p-4 space-y-6">
      <header className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Admin</h1>
        <nav className="inline-flex items-center gap-2 text-sm">
          <button className={`px-3 py-1.5 rounded-md border ${activeTab==='users'?'bg-gray-900 text-white border-gray-900':'bg-white'}`} onClick={() => setActiveTab('users')}>Users</button>
          <button className={`px-3 py-1.5 rounded-md border ${activeTab==='claims'?'bg-gray-900 text-white border-gray-900':'bg-white'}`} onClick={() => setActiveTab('claims')}>Claims</button>
        </nav>
      </header>

      {activeTab === 'users' && (
        <section className="rounded-xl border bg-white">
          <div className="p-4 border-b"><h2 className="font-medium">Pending Users</h2></div>
          <div className="p-4 overflow-x-auto">
            {usersQ.isLoading && <div className="text-sm text-gray-500">Loading…</div>}
            {usersQ.error && <div className="text-sm text-red-600">Failed to load users</div>}
            {usersQ.data && usersQ.data.length === 0 && <div className="text-sm text-gray-500">No pending users.</div>}
            {usersQ.data && usersQ.data.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Name</th>
                    <th className="py-2">Email</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {usersQ.data.map(u => (
                    <tr key={u._id} className="border-t">
                      <td className="py-2">{u.profile?.name || '—'}</td>
                      <td className="py-2">{u.email}</td>
                      <td className="py-2">
                        <div className="inline-flex items-center gap-2">
                          <button disabled={approve.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => approve.mutate(u._id)}>{approve.isPending ? 'Approving…' : 'Approve'}</button>
                          <button disabled={reject.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => reject.mutate(u._id)}>{reject.isPending ? 'Rejecting…' : 'Reject'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      {activeTab === 'claims' && (
        <section className="rounded-xl border bg-white">
          <div className="p-4 border-b"><h2 className="font-medium">Pending Claims</h2></div>
          <div className="p-4 overflow-x-auto">
            {claimsQ.isLoading && <div className="text-sm text-gray-500">Loading…</div>}
            {claimsQ.error && <div className="text-sm text-red-600">Failed to load claims</div>}
            {claimsQ.data && claimsQ.data.length === 0 && <div className="text-sm text-gray-500">No pending claims.</div>}
            {claimsQ.data && claimsQ.data.length > 0 && (
              <table className="w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-500">
                    <th className="py-2">Claim</th>
                    <th className="py-2">Status</th>
                    <th className="py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {claimsQ.data.map(c => (
                    <tr key={c._id} className="border-t">
                      <td className="py-2">#{c._id}</td>
                      <td className="py-2">
                        <span className="px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 text-xs">{c.status}</span>
                      </td>
                      <td className="py-2">
                        <div className="inline-flex items-center gap-2">
                          <button disabled={decide.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => decide.mutate({ id: c._id, decision: 'APPROVE' })}>{decide.isPending ? 'Saving…' : 'Approve'}</button>
                          <button disabled={decide.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => decide.mutate({ id: c._id, decision: 'REJECT' })}>{decide.isPending ? 'Saving…' : 'Reject'}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </section>
      )}

      <section className="rounded-xl border bg-white">
        <div className="p-4 border-b"><h2 className="font-medium">All Users (Moderation)</h2></div>
        <div className="p-4 overflow-x-auto">
          {allUsersQ.isLoading && <div className="text-sm text-gray-500">Loading…</div>}
          {allUsersQ.error && <div className="text-sm text-red-600">Failed to load users</div>}
          {allUsersQ.data && allUsersQ.data.length > 0 && (
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left text-gray-500">
                  <th className="py-2">Name</th>
                  <th className="py-2">Email</th>
                  <th className="py-2">Role</th>
                  <th className="py-2">Status</th>
                  <th className="py-2">Flags</th>
                  <th className="py-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {allUsersQ.data.map(u => {
                  const flagged = (u.flagsCount || 0) > 2 || u.flaggedForReview
                  return (
                  <tr key={u._id} className={`border-t ${flagged ? 'bg-red-50/60' : ''}`}>
                    <td className="py-2">{u.profile?.name || '—'}</td>
                    <td className="py-2">{u.email}</td>
                    <td className="py-2">{u.role}</td>
                    <td className="py-2">{u.status}{u.suspendedUntil ? ` (until ${new Date(u.suspendedUntil).toLocaleDateString()})` : ''}</td>
                      <td className="py-2">
                        <span className={`px-2 py-0.5 rounded-full border text-xs ${flagged ? 'bg-red-50 text-red-700 border-red-200' : 'bg-gray-50 text-gray-700 border-gray-200'}`}>
                          {(u.flagsCount || 0)}{u.flaggedForReview ? ' (review)' : ''}
                        </span>
                      </td>
                    <td className="py-2">
                      <ModerateUserActions userId={u._id} />
                    </td>
                  </tr>
                )})}
              </tbody>
            </table>
          )}
        </div>
      </section>
    </div>
  )
}

function ModerateUserActions({ userId }) {
  const queryClient = useQueryClient()
  const moderate = useMutation({
    mutationFn: async ({ id, action }) => (await api.patch(`/v1/admin/users/${id}/moderate`, { action })).data,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users-all'] })
    }
  })
  return (
    <div className="inline-flex items-center gap-2">
      <button disabled={moderate.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => moderate.mutate({ id: userId, action: 'SUSPEND_1WEEK' })}>Suspend 1 week</button>
      <button disabled={moderate.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => moderate.mutate({ id: userId, action: 'TERMINATE' })}>Terminate</button>
      <button disabled={moderate.isPending} className="px-3 py-1 rounded-md border hover:bg-gray-50" onClick={() => moderate.mutate({ id: userId, action: 'LEAVE' })}>Leave</button>
    </div>
  )
}


