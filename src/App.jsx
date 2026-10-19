import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import PokeDetails from './pages/PokeDetails'

function App() {
  return (
    <>
      <nav>
        <Link to="/">Accueil</Link>
      </nav>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/poke/:id" element={<PokeDetails />} />
      </Routes>
    </>
  )
}

export default App
