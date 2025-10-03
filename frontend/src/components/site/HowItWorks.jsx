import SignupImage from '../../assets/Signup.jpg'
const steps = [
  { n: '1', title: 'Post Lost or Found', desc: 'Create a post with clear photos, category, and where/when it was lost or found.' },
  { n: '2', title: 'Submit/Review Claims', desc: 'Finders submit evidence for lost posts; owners submit proof for found posts.' },
  { n: '3', title: 'Verify & Connect', desc: 'After acceptance/approval, contact details are shared to coordinate return.' }
]

export default function HowItWorks() {
  return (
    <section id="how" className="relative" style={{ backgroundImage: `url(${SignupImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
      <div className="bg-white/70 backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <h2 className="text-2xl font-semibold mb-8">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {steps.map(s => (
            <div key={s.n} className="rounded-lg border bg-white p-6">
              <div className="h-10 w-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-semibold mb-4">{s.n}</div>
              <div className="font-medium mb-1">{s.title}</div>
              <p className="text-sm text-gray-600">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
      </div>
    </section>
  )
}


