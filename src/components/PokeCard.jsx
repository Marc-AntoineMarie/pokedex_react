import { Link } from 'react-router-dom'

function PokeCard({ pokemon }) {
  return (
    <div>
      <img src={pokemon.image} alt={pokemon.nom} />
      <h3>{pokemon.nom}</h3>
      <p>{pokemon.element}</p>
      <Link to={`/poke/${pokemon.id}`}>Voir détails</Link>
    </div>
  )
}

export default PokeCard
