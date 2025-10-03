import SignupImage from '../../assets/Signup.jpg'
const stats = [
  { label: 'Items posted', value: '12,450+' },
  { label: 'Matches made', value: '8,900+' },
  { label: 'Avg. time to match', value: '~36h' },
  { label: 'Communities', value: '120+' }
]

export default function Stats() {
  return (
    <section className="relative" style={{ backgroundImage: `url(${SignupImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {stats.map(s => (
          <div key={s.label} className="rounded-lg border bg-white p-6">
            <div className="text-2xl font-bold">{s.value}</div>
            <div className="text-sm text-gray-600">{s.label}</div>
          </div>
        ))}
      </div>
      </div>
    </section>
  )
}


