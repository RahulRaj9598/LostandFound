import SignupImage from '../../assets/Signup.jpg'
const data = [
  { name: 'Aarav', text: 'Found my backpack in a day. The claim process was super simple.' },
  { name: 'Meera', text: 'Returned a phone safely after verifying ownership. Great platform!' },
  { name: 'Karan', text: 'Love the clean UI and quick notifications via email.' }
]

export default function Testimonials() {
  return (
    <section className="relative" style={{ backgroundImage: `url(${SignupImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">What users say</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {data.map(t => (
            <div key={t.name} className="rounded-lg border bg-white p-5">
              <p className="text-gray-700">“{t.text}”</p>
              <div className="mt-3 text-sm text-gray-500">— {t.name}</div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}


