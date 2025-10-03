import { Link } from 'react-router-dom'
import { useAuth } from '../../stores/auth.js'
import { useQuery } from '@tanstack/react-query'
import { api } from '../../lib/apiClient.js'

export function PostCard({ post, onDelete }) {
  const me = useAuth(s => s.user)
  const cover = post?.images?.[0]?.url
  const isFound = post?.type === 'FOUND'
  const ownerIdValue = post && post.ownerId && (typeof post.ownerId === 'object' ? post.ownerId._id : post.ownerId)
  const isOwner = me && ownerIdValue && String(me._id) === String(ownerIdValue)
  const status = String(post?.status || 'OPEN')
  const isResolved = status === 'RESOLVED' || status === 'ARCHIVED'
  const { data: myClaims } = useQuery({
    queryKey: ['my-claim', post?._id, me?._id],
    queryFn: async () => (await api.get(`/v1/claims?postId=${post?._id}&requesterId=${me?._id}`)).data,
    enabled: !!(me && post?._id),
    staleTime: 60_000
  })
  const alreadyClaimed = Array.isArray(myClaims) && myClaims.length > 0
  const statusStyle = (() => {
    switch (status) {
      case 'OPEN': return 'bg-amber-50 text-amber-800 border-amber-200'
      case 'CLAIMED': return 'bg-indigo-50 text-indigo-800 border-indigo-200'
      case 'RESOLVED': return 'bg-green-50 text-green-800 border-green-200'
      case 'ARCHIVED': return 'bg-gray-100 text-gray-700 border-gray-200'
      default: return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  })()
  const bullets = (() => {
    const raw = String(post?.description || '')
      .split(/\r?\n/)
      .map(l => l.trim())
      .filter(Boolean)
      .map(l => l.replace(/^[-•]\s*/, ''))
    return raw.slice(0, 4) // show up to 4 points
  })()
  const mapsHref = (() => {
    const coords = Array.isArray(post?.location?.coordinates) ? post.location.coordinates : null
    if (coords && coords.length === 2) {
      const [lng, lat] = coords
      return `https://www.google.com/maps?q=${encodeURIComponent(lat)},${encodeURIComponent(lng)}`
    }
    if (post?.locationName) return `https://www.google.com/maps?q=${encodeURIComponent(post.locationName)}`
    return null
  })()
  const displayLocation = (() => {
    const name = String(post?.locationName || '')
    const max = 24
    return name.length > max ? name.slice(0, max - 1) + '…' : name
  })()
  return (
    <div className="rounded-xl border bg-white overflow-hidden flex flex-col shadow-sm hover:shadow-md transition-shadow">
      {cover ? (
        <div className="aspect-[4/3] overflow-hidden bg-gray-100">
          <img src={cover} alt={post?.images?.[0]?.alt || post?.title} className="h-full w-full object-cover transition-transform group-hover:scale-[1.02]" />
        </div>
      ) : (
        <div className="aspect-[4/3] bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center text-gray-400">No image</div>
      )}
      <div className="p-4 flex-1 flex flex-col gap-3">
        {/* Row 1: type and status */}
        <div className="flex items-center justify-between">
          <span className={`px-2 py-0.5 text-xs rounded-full border ${isFound ? 'bg-green-50 text-green-700 border-green-200' : 'bg-blue-50 text-blue-700 border-blue-200'}`}>{post?.type}</span>
          <span className={`px-2 py-0.5 text-xs rounded-full border ${statusStyle}`}>{status}</span>
        </div>
        {/* Row 2: title */}
        <h3 className="text-sm font-semibold line-clamp-1">{post?.title}</h3>
        {/* Row 3: key points */}
        {bullets.length > 0 ? (
          <ul className="text-sm text-gray-700 space-y-1 list-disc list-inside">
            {bullets.map((b, i) => (
              <li key={i} className="leading-snug">{b}</li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-600 line-clamp-2">{post?.description}</p>
        )}
        {/* Row 4: meta (category, owner) */}
        <div className="flex items-center justify-start gap-2 text-xs text-gray-600">
          <span className="px-2 py-0.5 rounded-full border bg-gray-50">{post?.category || 'General'}</span>
          {post?.ownerId && (
            <span className="px-2 py-0.5 rounded-full border bg-gray-50">By {post.ownerId.profile?.name || post.ownerId.email || 'Owner'}</span>
          )}
        </div>
        {/* Row 5: location + date + actions */}
        <div className="mt-auto pt-2 flex items-center justify-between text-xs text-gray-500">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1">
            {post?.locationName && (
              mapsHref ? (
                <a
                  href={mapsHref}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 hover:underline"
                  title="Open in Google Maps"
                >
                  <span>📍</span>
                  <span className="font-medium">{displayLocation}</span>
                </a>
              ) : (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full border bg-gray-50 text-gray-700 border-gray-200">
                  <span>📍</span>
                  <span className="font-medium">{displayLocation}</span>
                </span>
              )
            )}
            </div>
            <div className="text-[11px] text-gray-400">{new Date(post?.createdAt).toLocaleDateString()}</div>
          </div>
          {isResolved ? (
            <span className="px-3 py-1.5 rounded-md border bg-gray-100 text-gray-500 cursor-not-allowed">Resolved</span>
          ) : (
            isOwner ? (
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded-full border bg-yellow-50 text-yellow-800 border-yellow-200 inline-flex items-center gap-1">
                  <span>👑</span>
                  <span>Owner</span>
                </span>
                {onDelete && (
                  <button onClick={() => { if (window.confirm('Delete this post?')) onDelete(post._id) }} className="text-sm px-3 py-1.5 rounded-md border hover:bg-red-50 text-red-700 border-red-300">Delete</button>
                )}
              </div>
            ) : (
              alreadyClaimed ? (
                <span className="px-3 py-1.5 rounded-md border bg-gray-100 text-gray-500 cursor-not-allowed">Claimed</span>
              ) : (
                <Link to={`/claims/${post?._id}/new`} className={`text-sm px-3 py-1.5 rounded-md border hover:bg-gray-50`}>
                  Claim
                </Link>
              )
            )
          )}
        </div>
      </div>
    </div>
  )
}


