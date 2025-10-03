import PostsList from './posts/PostsList.jsx'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'

export default function AppHome() {
  return (
    <div className="space-y-6">
      <section className="bg-white border-b">
        <div className="mx-auto max-w-6xl px-4 py-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Welcome back</h1>
            <p className="text-gray-600 text-sm">Create a new post or explore recent lost and found items.</p>
          </div>
          <div className="flex gap-3">
            <Link to="/posts/new"><Button>Create Post</Button></Link>
            <Link to="/posts"><Button variant="outline">Browse</Button></Link>
          </div>
        </div>
      </section>
      <PostsList />
    </div>
  )
}


