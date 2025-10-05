import { Link } from "react-router-dom"

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-white">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight">Lost something? Found something?</h1>
            <p className="text-gray-600">FindMyStuff connects finders and owners with a simple claim-and-contact flow. Post lost or found items, verify, and reconnect.</p>
            <div className="flex flex-wrap gap-3">
              <Link to='/posts/new' className="px-5 py-2.5 rounded-md bg-blue-600 text-white hover:bg-blue-700">Report Lost Item</Link>
              <Link to='/posts/new' className="px-5 py-2.5 rounded-md border border-blue-600 text-blue-600 hover:bg-blue-50">Post Found Item</Link>
            </div>
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
              <HeroStat label="items posted" value="12,450+" />
              <HeroStat label="matches made" value="8,900+" />
              <HeroStat label="Avg. time to match" value="~36h" />
              <HeroStat label="Communities" value="120+" />
            </div>
          </div>
          <div className="relative">
            <div className="aspect-[16/10] w-full rounded-xl border overflow-hidden">
              <img src="/bags.jpg" alt="Illustration of returning a found bag" className="h-full w-full object-cover" />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function HeroStat({ value, label }) {
  return (
    <div className="rounded-xl border bg-white p-3 text-center">
      <div className="text-lg font-semibold">{value}</div>
      <div className="text-xs text-gray-500">{label}</div>
    </div>
  )
}


