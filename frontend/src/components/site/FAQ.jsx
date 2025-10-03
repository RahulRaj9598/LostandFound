const faqs = [
  { q: 'Is it free to use?', a: 'Yes, FindMyStuff is free for posting and claiming.' },
  { q: 'How is privacy handled?', a: 'Contact details are shared only after a claim is accepted/approved.' },
  { q: 'Can I edit my post?', a: 'Yes, you can update or archive your posts anytime.' }
]

export default function FAQ() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl font-semibold mb-6">FAQ</h2>
        <div className="space-y-4">
          {faqs.map(f => (
            <details key={f.q} className="rounded-lg border bg-gray-50 p-4">
              <summary className="font-medium cursor-pointer">{f.q}</summary>
              <p className="text-sm text-gray-600 mt-2">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  )
}


