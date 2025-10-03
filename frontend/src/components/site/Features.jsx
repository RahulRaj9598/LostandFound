import { ShieldCheck, Images, Mail, MapPin, Sparkles } from 'lucide-react'

const items = [
  { icon: ShieldCheck, title: 'Verified contact reveal', desc: 'Contacts are shared only after an accepted/approved claim.' },
  { icon: Images, title: 'Photo evidence', desc: 'Attach images to posts and claims via Cloudinary-backed uploads.' },
  { icon: MapPin, title: 'Location aware', desc: 'Add an approximate location to help owners find their items.' },
  { icon: Mail, title: 'Email verification', desc: 'Simple OTP-based verification for secure signups and logins.' },
]

export default function Features() {
  return (
    <section id="features" className="bg-gradient-to-b from-gray-50 to-white">
      <div className="mx-auto max-w-6xl px-4 py-16">
        <div className="flex items-center gap-2 mb-3 text-blue-700">
          <Sparkles className="h-5 w-5" />
          <span className="text-sm font-medium uppercase tracking-wider">Features</span>
        </div>
        <h2 className="text-3xl font-semibold tracking-tight mb-8">Why use FindMyStuff?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {items.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="group rounded-xl border bg-white p-6 flex flex-col gap-3 transition-shadow hover:shadow-md">
              <div className="h-10 w-10 rounded-lg grid place-items-center bg-blue-50 text-blue-700 group-hover:bg-blue-100">
                <Icon className="h-5 w-5" />
              </div>
              <div className="font-medium">{title}</div>
              <p className="text-sm text-gray-600">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}


