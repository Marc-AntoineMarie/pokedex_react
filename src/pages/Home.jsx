import { useState, useEffect } from 'react'
import api from '../services/api'
import PokeCard from '../components/PokeCard'
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
        setError('Erreur lors du chargement')
        setLoading(false)
      })
  }, [page])

  return (
    <div>
      <h1>Mon pokedex</h1>
      {loading && <p>Chargement...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {!loading && !error && pokemons.length === 0 && <p>Aucun pokemon disponible.</p>}
      {pokemons.map((pokemon) => (
        <PokeCard key={pokemon.id} pokemon={pokemon} />
      ))}
      <Pagination
        page={page}
        onPrev={() => setPage(page - 1)}
        onNext={() => setPage(page + 1)}
        disablePrev={page === 1}
        disableNext={!hasNext}
      />
    </div>
  )
}

export default Home
