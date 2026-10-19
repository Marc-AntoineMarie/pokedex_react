import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import api from '../services/api'

function PokeDetails() {
  const { id } = useParams()
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    setLoading(true)
    api.get(`/pokemon/${id}`)
      .then((res) => {
        setPokemon(res.data)
        setLoading(false)
      })
      .catch(() => {
        setError('Pokemon introuvable')
        setLoading(false)
      })
  }, [id])

  if (loading) return <p>Chargement...</p>
  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!pokemon) return null

  return (
    <div>
      <img src={pokemon.sprites.front_default} alt={pokemon.name} />
      <h1>{pokemon.name}</h1>
      <p>Element : {pokemon.types[0].type.name}</p>
      <p>Poids : {pokemon.weight / 10} kg</p>
      <p>Taille : {pokemon.height / 10} m</p>
      <p>XP de base : {pokemon.base_experience}</p>
    </div>
  )
}

export default PokeDetails
