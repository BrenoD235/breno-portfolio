import Navbar    from '@/components/Navbar'
import Hero      from '@/components/Hero'
import About     from '@/components/About'
import Portfolio from '@/components/Portfolio'
import Contact   from '@/components/Contact'
import Footer    from '@/components/Footer'

export default function App() {
  return (
    <>
      <Navbar />
      <main className="pt-16">
        <Hero />
        <About />
        <Portfolio />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
