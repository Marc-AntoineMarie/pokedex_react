import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRightIcon } from '@radix-ui/react-icons'
import {
  motion,
  useMotionValue,
  useMotionTemplate,
  useSpring,
  useTransform,
} from 'framer-motion'

const typePalette = {
  fire:     { bg: '#fff3eb', accent: '#e8642c', text: '#b84000' },
  water:    { bg: '#e8f4fd', accent: '#3a90d4', text: '#006cbf' },
  grass:    { bg: '#eaf7ec', accent: '#3aab52', text: '#1a7c31' },
  electric: { bg: '#fff9e0', accent: '#d4a800', text: '#8a6800' },
  ice:      { bg: '#e6f7f9', accent: '#2ab4c4', text: '#007b8a' },
  fighting: { bg: '#fdecea', accent: '#d94032', text: '#a12a21' },
  poison:   { bg: '#f5ecfc', accent: '#9c3ec8', text: '#7b2fa1' },
  ground:   { bg: '#f5f0eb', accent: '#a07850', text: '#7a5230' },
  flying:   { bg: '#eff0fc', accent: '#5868d0', text: '#3a4db8' },
  psychic:  { bg: '#fdeef4', accent: '#e0457e', text: '#be2265' },
  bug:      { bg: '#f0f7e6', accent: '#6ea800', text: '#4a7800' },
  rock:     { bg: '#f2ede8', accent: '#96694a', text: '#6b4c35' },
  ghost:    { bg: '#eeecf5', accent: '#6654b0', text: '#4b3985' },
  dragon:   { bg: '#eaeef8', accent: '#4460d0', text: '#2c459e' },
  dark:     { bg: '#ebebed', accent: '#505055', text: '#3a3a3c' },
  steel:    { bg: '#edf1f4', accent: '#5a7890', text: '#3a5568' },
  fairy:    { bg: '#fde8f0', accent: '#d4408a', text: '#b0225f' },
  normal:   { bg: '#f2f2f7', accent: '#aeaeb2', text: '#6e6e73' },
}

export default function PokeCard({ pokemon }) {
  const ref = useRef(null)
  const [hovered, setHovered] = useState(false)
  const [btnHover, setBtnHover] = useState(false)

  const mx = useMotionValue(0)
  const my = useMotionValue(0)

  const rotX = useSpring(useTransform(my, [-0.5, 0.5], [12, -12]), { stiffness: 360, damping: 28 })
  const rotY = useSpring(useTransform(mx, [-0.5, 0.5], [-12, 12]), { stiffness: 360, damping: 28 })
  const imgZ  = useSpring(hovered ? 1 : 0, { stiffness: 300, damping: 25 })
  const imgTY = useTransform(imgZ, [0, 1], [0, -10])
  const imgS  = useTransform(imgZ, [0, 1], [1, 1.12])

  const glX = useTransform(mx, [-0.5, 0.5], ['10%', '90%'])
  const glY = useTransform(my, [-0.5, 0.5], ['10%', '90%'])
  const gloss = useMotionTemplate`radial-gradient(circle 70px at ${glX} ${glY}, rgba(255,255,255,0.75), transparent)`

  const handleMove = (e) => {
    const r = ref.current.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width - 0.5)
    my.set((e.clientY - r.top)  / r.height - 0.5)
  }
  const handleLeave = () => {
    mx.set(0); my.set(0); setHovered(false)
  }

  const { bg, accent, text } = typePalette[pokemon.element] || typePalette.normal
  const id = String(pokemon.id).padStart(3, '0')

  return (
    /* perspective wrapper */
    <div style={{ perspective: 800 }}>
      <motion.div
        ref={ref}
        onMouseMove={handleMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={handleLeave}
        style={{
          rotateX: rotX,
          rotateY: rotY,
          transformStyle: 'preserve-3d',
          borderRadius: 20,
          background: 'var(--color-surface)',
          boxShadow: hovered
            ? '0 20px 48px rgba(0,0,0,0.14), 0 4px 12px rgba(0,0,0,0.10)'
            : '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
          overflow: 'hidden',
          cursor: 'pointer',
          transition: 'box-shadow 250ms ease',
          willChange: 'transform',
        }}
      >
        {/* ── Top zone — tinted image area ─────────────────── */}
        <div style={{
          position: 'relative',
          background: bg,
          padding: '20px 16px 28px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}>
          {/* Number badge */}
          <span style={{
            position: 'absolute',
            top: 10, left: 12,
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.04em',
            color: text,
            opacity: 0.7,
          }}>
            #{id}
          </span>

          {/* Pokémon image — pops in 3D */}
          <motion.img
            src={pokemon.image}
            alt={pokemon.nom}
            style={{
              width: 100, height: 100,
              translateY: imgTY,
              scale: imgS,
              translateZ: 30,
              filter: hovered
                ? `drop-shadow(0 12px 18px ${accent}60)`
                : `drop-shadow(0 4px 8px ${accent}30)`,
              transition: 'filter 250ms ease',
              zIndex: 1,
            }}
          />

          {/* Gloss sweep on hover */}
          <motion.div
            style={{
              position: 'absolute',
              inset: 0,
              pointerEvents: 'none',
              opacity: hovered ? 1 : 0,
              background: gloss,
              transition: 'opacity 200ms ease',
            }}
          />
        </div>

        {/* ── Bottom zone — info ───────────────────────────── */}
        <div style={{ padding: '14px 16px 16px' }}>
          {/* Name */}
          <p style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            letterSpacing: '-0.02em',
            textTransform: 'capitalize',
            color: 'var(--color-label)',
            marginBottom: 8,
          }}>
            {pokemon.nom}
          </p>

          {/* Bottom row : type + CTA */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <span style={{
              padding: '3px 10px',
              borderRadius: 980,
              fontSize: '0.68rem',
              fontWeight: 600,
              textTransform: 'capitalize',
              background: bg,
              color: text,
            }}>
              {pokemon.element}
            </span>

            <Link
              to={`/poke/${pokemon.id}`}
              onClick={e => e.stopPropagation()}
              onMouseEnter={() => setBtnHover(true)}
              onMouseLeave={() => setBtnHover(false)}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 4,
                padding: '5px 11px',
                borderRadius: 980,
                background: btnHover ? bg : 'var(--color-surface-2)',
                color: btnHover ? text : 'var(--color-label-2)',
                fontSize: '0.72rem',
                fontWeight: 600,
                transition: 'background 180ms ease, color 180ms ease',
                opacity: 1,
              }}
            >
              <span>Détails</span>
              <motion.span
                animate={{ x: btnHover ? 3 : 0 }}
                transition={{ duration: 0.18, ease: 'easeOut' }}
                style={{ display: 'inline-flex', alignItems: 'center' }}
              >
                <ArrowRightIcon width={13} height={13} />
              </motion.span>
            </Link>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
