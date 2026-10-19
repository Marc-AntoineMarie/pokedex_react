import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import api from '../services/api'
import PokeCard from '../components/PokeCard'
import CardSkeleton from '../components/CardSkeleton'
import Pagination from '../components/Pagination'

const LIMIT = 20

function Home() {
  const [pokemons, setPokemons] = useState([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [hasNext, setHasNext] = useState(true)

  useEffect(() => {
    setLoading(true)
    setError(null)
    const offset = (page - 1) * LIMIT
    api.get(`/pokemon?limit=${LIMIT}&offset=${offset}`)
      .then((res) => {
        setHasNext(res.data.next !== null)
        return Promise.all(
          res.data.results.map((p) => api.get(p.url.replace('https://pokeapi.co/api/v2', '')))
        )
      })
      .then((details) => {
        setPokemons(details.map((r) => ({
          id: r.data.id,
          nom: r.data.name,
          element: r.data.types[0].type.name,
          image: r.data.sprites.front_default,
        })))
        setLoading(false)
      })
      .catch(() => {
        setError('Impossible de charger les données.')
        setLoading(false)
      })
  }, [page])

  return (
    <div>
      {/* Page title */}
      <div style={{ marginBottom: 'var(--s8)' }}>
        <h1 style={{
          fontFamily: 'var(--font-display)',
          fontSize: 'clamp(1.75rem, 3vw, 2.25rem)',
          fontWeight: 700,
          letterSpacing: '-0.03em',
          color: 'var(--color-label)',
        }}>
          Mon Pokédex
        </h1>
        <p style={{ marginTop: 'var(--s2)', fontSize: '0.9rem', color: 'var(--color-label-2)' }}>
          {pokemons.length > 0 ? `Page ${page} · ${pokemons.length} pokémons` : ' '}
        </p>
      </div>

      {/* States */}
      {loading && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
          gap: 'var(--s4)',
        }}>
          {Array.from({ length: 20 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      )}
      {error && (
        <div style={{
          padding: 'var(--s4) var(--s5)',
          borderRadius: 'var(--r-md)',
          background: '#fff5f5',
          color: 'var(--color-destructive)',
          fontSize: '0.875rem',
        }}>
          {error}
        </div>
      )}
      {!loading && !error && pokemons.length === 0 && (
        <p style={{ color: 'var(--color-label-2)', fontSize: '0.9rem' }}>Aucun pokémon disponible.</p>
      )}

      {/* Grid */}
      {!loading && !error && (
        <motion.div
          key={page}
          initial="hidden"
          animate="visible"
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))',
            gap: 'var(--s4)',
          }}
        >
          {pokemons.map((pokemon) => (
            <motion.div
              key={pokemon.id}
              variants={{
                hidden:  { opacity: 0, y: 12 },
                visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.25, 0.1, 0.25, 1] } },
              }}
            >
              <PokeCard pokemon={pokemon} />
            </motion.div>
          ))}
        </motion.div>
      )}

      <Pagination
        page={page}
        onPrev={() => { setPage(page - 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        onNext={() => { setPage(page + 1); window.scrollTo({ top: 0, behavior: 'smooth' }) }}
        disablePrev={page === 1}
        disableNext={!hasNext}
      />
    </div>
  )
}

export default Home
