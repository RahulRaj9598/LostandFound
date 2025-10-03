import Hero from '../components/site/Hero.jsx'
import Features from '../components/site/Features.jsx'
import HowItWorks from '../components/site/HowItWorks.jsx'
import Stats from '../components/site/Stats.jsx'
import Categories from '../components/site/Categories.jsx'
import Testimonials from '../components/site/Testimonials.jsx'
import FAQ from '../components/site/FAQ.jsx'
import CTA from '../components/site/CTA.jsx'

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <Stats />
      <Features />
      <HowItWorks />
      <Categories />
      <Testimonials />
      <FAQ />
      <CTA />
    </main>
  )
}


