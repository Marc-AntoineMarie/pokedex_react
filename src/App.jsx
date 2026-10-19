import { Routes, Route, Link, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './pages/Home'
import PokeDetails from './pages/PokeDetails'

function App() {
  const location = useLocation()

  return (
    <div style={{ minHeight: '100vh' }}>
      {/* Nav bar — translucent, Apple-style */}
      <header style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(245,245,247,0.85)',
        backdropFilter: 'saturate(180%) blur(20px)',
        WebkitBackdropFilter: 'saturate(180%) blur(20px)',
        borderBottom: '1px solid var(--color-separator)',
      }}>
        <div style={{
          maxWidth: 1080,
          margin: '0 auto',
          padding: '0 var(--s6)',
          height: 52,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <Link to="/" style={{
            fontFamily: 'var(--font-display)',
            fontWeight: 700,
            fontSize: '1.1rem',
            letterSpacing: '-0.02em',
            color: 'var(--color-label)',
          }}>
            Pokédex
          </Link>
          <nav style={{ display: 'flex', gap: 'var(--s6)' }}>
            <Link to="/" style={{
              fontSize: '0.875rem',
              color: 'var(--color-label-2)',
              fontWeight: 400,
            }}>
              Accueil
            </Link>
          </nav>
        </div>
      </header>

      <AnimatePresence mode="wait">
        <motion.main
          key={location.pathname}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.28, ease: [0.25, 0.1, 0.25, 1] } }}
          exit={{ opacity: 0, transition: { duration: 0.15 } }}
          style={{
            maxWidth: 1080,
            margin: '0 auto',
            padding: 'var(--s10) var(--s6)',
          }}
        >
          <Routes location={location}>
            <Route path="/" element={<Home />} />
            <Route path="/poke/:id" element={<PokeDetails />} />
          </Routes>
        </motion.main>
      </AnimatePresence>
    </div>
  )
}

export default App
