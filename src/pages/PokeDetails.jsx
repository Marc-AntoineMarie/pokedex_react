import { useState, useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  useMotionTemplate,
  AnimatePresence,
} from 'framer-motion'
import api from '../services/api'

/* ── Palette ─────────────────────────────────────────── */
const typePalette = {
  fire:     { bg: '#fff3eb', accent: '#e8642c', text: '#b84000', glow: 'rgba(232,100,44,0.25)' },
  water:    { bg: '#e8f4fd', accent: '#3a90d4', text: '#006cbf', glow: 'rgba(58,144,212,0.25)' },
  grass:    { bg: '#eaf7ec', accent: '#3aab52', text: '#1a7c31', glow: 'rgba(58,171,82,0.25)'  },
  electric: { bg: '#fff9e0', accent: '#d4a800', text: '#8a6800', glow: 'rgba(212,168,0,0.25)'  },
  ice:      { bg: '#e6f7f9', accent: '#2ab4c4', text: '#007b8a', glow: 'rgba(42,180,196,0.25)' },
  fighting: { bg: '#fdecea', accent: '#d94032', text: '#a12a21', glow: 'rgba(217,64,50,0.25)'  },
  poison:   { bg: '#f5ecfc', accent: '#9c3ec8', text: '#7b2fa1', glow: 'rgba(156,62,200,0.25)' },
  ground:   { bg: '#f5f0eb', accent: '#a07850', text: '#7a5230', glow: 'rgba(160,120,80,0.25)' },
  flying:   { bg: '#eff0fc', accent: '#5868d0', text: '#3a4db8', glow: 'rgba(88,104,208,0.25)' },
  psychic:  { bg: '#fdeef4', accent: '#e0457e', text: '#be2265', glow: 'rgba(224,69,126,0.25)' },
  bug:      { bg: '#f0f7e6', accent: '#6ea800', text: '#4a7800', glow: 'rgba(110,168,0,0.25)'  },
  rock:     { bg: '#f2ede8', accent: '#96694a', text: '#6b4c35', glow: 'rgba(150,105,74,0.25)' },
  ghost:    { bg: '#eeecf5', accent: '#6654b0', text: '#4b3985', glow: 'rgba(102,84,176,0.25)' },
  dragon:   { bg: '#eaeef8', accent: '#4460d0', text: '#2c459e', glow: 'rgba(68,96,208,0.25)'  },
  dark:     { bg: '#ebebed', accent: '#505055', text: '#3a3a3c', glow: 'rgba(80,80,85,0.25)'   },
  steel:    { bg: '#edf1f4', accent: '#5a7890', text: '#3a5568', glow: 'rgba(90,120,144,0.25)' },
  fairy:    { bg: '#fde8f0', accent: '#d4408a', text: '#b0225f', glow: 'rgba(212,64,138,0.25)' },
  normal:   { bg: '#f2f2f7', accent: '#aeaeb2', text: '#6e6e73', glow: 'rgba(174,174,178,0.2)' },
}

const statMeta = {
  hp:               { label: 'PV',      color: '#34c759' },
  attack:           { label: 'Attaque', color: '#ff9f0a' },
  defense:          { label: 'Défense', color: '#0071e3' },
  'special-attack': { label: 'Sp. Atk',color: '#bf5af2' },
  'special-defense':{ label: 'Sp. Déf', color: '#5ac8fa' },
  speed:            { label: 'Vitesse', color: '#ff375f' },
}

/* ── StatRow ─────────────────────────────────────────── */
function StatRow({ name, value, delay }) {
  const meta = statMeta[name] || { label: name, color: '#aeaeb2' }
  const pct  = Math.min((value / 255) * 100, 100)

  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay }}
      style={{ display: 'grid', gridTemplateColumns: '88px 40px 1fr', alignItems: 'center', gap: 12, marginBottom: 10 }}
    >
      <span style={{ fontSize: '0.78rem', color: 'var(--color-label-2)', textAlign: 'right', fontWeight: 500 }}>
        {meta.label}
      </span>
      <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--color-label)', textAlign: 'right' }}>
        {value}
      </span>
      <div style={{ background: 'var(--color-surface-3)', borderRadius: 980, height: 7, overflow: 'hidden' }}>
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.65, ease: [0.25, 0.1, 0.25, 1], delay: delay + 0.1 }}
          style={{ height: '100%', background: meta.color, borderRadius: 980 }}
        />
      </div>
    </motion.div>
  )
}

/* ── InfoTile ────────────────────────────────────────── */
function InfoTile({ label, value, delay, accent }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.25, 0.1, 0.25, 1], delay }}
      style={{
        background: 'var(--color-surface)',
        borderRadius: 16,
        padding: '16px 18px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 12px rgba(0,0,0,0.05)',
      }}
    >
      <p style={{ fontSize: '0.68rem', color: 'var(--color-label-3)', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 6 }}>
        {label}
      </p>
      <p style={{ fontSize: '1.05rem', fontWeight: 700, letterSpacing: '-0.02em', color: accent || 'var(--color-label)', textTransform: 'capitalize' }}>
        {value}
      </p>
    </motion.div>
  )
}

/* ── Main ────────────────────────────────────────────── */
export default function PokeDetails() {
  const { id }   = useParams()
  const heroRef  = useRef(null)
  const [pokemon, setPokemon] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error,   setError]   = useState(null)

  /* mouse parallax on hero artwork */
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const imgX = useSpring(useTransform(mx, [-0.5, 0.5], [-14, 14]), { stiffness: 200, damping: 30 })
  const imgY = useSpring(useTransform(my, [-0.5, 0.5], [-10, 10]), { stiffness: 200, damping: 30 })
  const glX  = useTransform(mx, [-0.5, 0.5], ['15%', '85%'])
  const glY  = useTransform(my, [-0.5, 0.5], ['15%', '85%'])
  const gloss = useMotionTemplate`radial-gradient(circle 140px at ${glX} ${glY}, rgba(255,255,255,0.55), transparent)`

  const handleHeroMove = (e) => {
    const r = heroRef.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width  - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }
  const handleHeroLeave = () => { mx.set(0); my.set(0) }

  useEffect(() => {
    setLoading(true)
    api.get(`/pokemon/${id}`)
      .then(r => { setPokemon(r.data); setLoading(false) })
      .catch(() => { setError('Pokémon introuvable.'); setLoading(false) })
  }, [id])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: 80, color: 'var(--color-label-2)', fontSize: '0.9rem' }}>
      Chargement…
    </div>
  )
  if (error) return (
    <div style={{ padding: '12px 16px', background: '#fff5f5', borderRadius: 12, color: 'var(--color-destructive)', fontSize: '0.875rem' }}>
      {error}
    </div>
  )
  if (!pokemon) return null

  const mainType = pokemon.types[0].type.name
  const pal      = typePalette[mainType] || typePalette.normal
  const idStr    = String(pokemon.id).padStart(3, '0')
  const artwork  = pokemon.sprites.other?.['official-artwork']?.front_default || pokemon.sprites.front_default

  return (
    <div style={{ maxWidth: 700, margin: '0 auto' }}>

      {/* Back */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.05 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 20, fontSize: '0.875rem', fontWeight: 500, color: 'var(--color-accent)' }}>
          ← Retour
        </Link>
      </motion.div>

      {/* ── Hero card ──────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        style={{
          borderRadius: 28,
          overflow: 'hidden',
          boxShadow: `0 2px 8px rgba(0,0,0,0.07), 0 16px 48px ${pal.glow}`,
          marginBottom: 16,
        }}
      >
        {/* Hero zone */}
        <div
          ref={heroRef}
          onMouseMove={handleHeroMove}
          onMouseLeave={handleHeroLeave}
          style={{
            position: 'relative',
            background: pal.bg,
            padding: '48px 32px 56px',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            overflow: 'hidden',
            cursor: 'default',
          }}
        >
          {/* Blob background */}
          <div style={{
            position: 'absolute',
            width: 280, height: 280,
            borderRadius: '50%',
            background: `radial-gradient(circle, ${pal.accent}20 0%, transparent 70%)`,
            top: '50%', left: '50%',
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none',
          }} />

          {/* Gloss layer */}
          <motion.div style={{ position: 'absolute', inset: 0, background: gloss, pointerEvents: 'none' }} />

          {/* Number */}
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.15 }}
            style={{ fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.06em', color: pal.text, opacity: 0.6, marginBottom: 12 }}
          >
            #{idStr}
          </motion.span>

          {/* Artwork — parallax */}
          <motion.img
            src={artwork}
            alt={pokemon.name}
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0,  scale: 1 }}
            transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
            style={{
              width: 200, height: 200,
              x: imgX, y: imgY,
              filter: `drop-shadow(0 16px 32px ${pal.glow})`,
              zIndex: 1,
            }}
          />

          {/* Name */}
          <motion.h1
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, delay: 0.25 }}
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(1.6rem, 4vw, 2.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              textTransform: 'capitalize',
              color: 'var(--color-label)',
              marginTop: 20,
              marginBottom: 12,
            }}
          >
            {pokemon.name}
          </motion.h1>

          {/* Type badges */}
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.32 }}
            style={{ display: 'flex', gap: 8 }}
          >
            {pokemon.types.map(t => {
              const p = typePalette[t.type.name] || typePalette.normal
              return (
                <span key={t.type.name} style={{
                  padding: '4px 14px',
                  borderRadius: 980,
                  fontSize: '0.78rem',
                  fontWeight: 600,
                  textTransform: 'capitalize',
                  background: 'rgba(255,255,255,0.7)',
                  backdropFilter: 'blur(8px)',
                  color: p.text,
                }}>
                  {t.type.name}
                </span>
              )
            })}
          </motion.div>
        </div>

        {/* Info tiles */}
        <div style={{
          background: 'var(--color-bg)',
          padding: '20px 20px',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 10,
        }}>
          <InfoTile label="Poids"       value={`${pokemon.weight / 10} kg`}                delay={0.2} />
          <InfoTile label="Taille"      value={`${pokemon.height / 10} m`}                 delay={0.25} />
          <InfoTile label="XP de base"  value={pokemon.base_experience ?? '—'}             delay={0.3} accent={pal.text} />
          <InfoTile label="Capacités"   value={pokemon.abilities[0]?.ability.name ?? '—'}  delay={0.35} />
        </div>
      </motion.div>

      {/* ── Stats card ─────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: [0.25, 0.1, 0.25, 1], delay: 0.2 }}
        style={{
          background: 'var(--color-surface)',
          borderRadius: 24,
          boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
          padding: '28px 28px',
        }}
      >
        <h2 style={{
          fontSize: '0.72rem',
          fontWeight: 700,
          textTransform: 'uppercase',
          letterSpacing: '0.08em',
          color: 'var(--color-label-3)',
          marginBottom: 20,
        }}>
          Statistiques de base
        </h2>
        {pokemon.stats.map((s, i) => (
          <StatRow key={s.stat.name} name={s.stat.name} value={s.base_stat} delay={0.28 + i * 0.05} />
        ))}
      </motion.div>
    </div>
  )
}
