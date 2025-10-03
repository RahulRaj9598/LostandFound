const cats = ['Electronics', 'Bags', 'Documents', 'Keys', 'Clothing', 'Pets']

export default function Categories() {
  return (
    <section className="bg-white">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <h2 className="text-2xl sm:text-3xl font-semibold mb-6">Popular categories</h2>
        <div className="flex flex-wrap gap-3 mb-6">
          {cats.map(c => (
            <button key={c} className="px-4 py-2 rounded-md border bg-white hover:bg-blue-50 text-sm">
              {c}
            </button>
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {cats.map(c => {
            const img = {
              Electronics: '/electronics.jpg',
              Bags: '/bags.jpg',
              Documents: '/documents.jpg',
              Keys: '/keys.jpg',
              Clothing: '/clothing.jpg',
              Pets: '/pets.jpg'
            }[c]
            return (
              <div key={c} className="rounded-xl border bg-white p-6 shadow-sm hover:shadow-md transition-shadow">
                <div className="h-28 mb-4 grid place-items-center overflow-hidden rounded-md">
                  <img src={img} alt={c} className="h-28 w-full object-contain" />
                </div>
                <div className="text-center font-medium">{c}</div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}


