import { motion } from 'framer-motion'

export default function PokeballLoader({ label = 'Chargement…' }) {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '80px 0',
      gap: 28,
    }}>
      {/* Pokéball */}
      <div style={{ position: 'relative', width: 72, height: 72 }}>

        {/* Glow */}
        <motion.div
          animate={{ opacity: [0.3, 0.7, 0.3], scale: [0.9, 1.15, 0.9] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
          style={{
            position: 'absolute',
            inset: -10,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(255,59,48,0.18) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />

        {/* Top half — red, slides up */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          style={{
            position: 'absolute',
            top: 0, left: 0,
            width: 72, height: 36,
            overflow: 'hidden',
          }}
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none">
            <circle cx="36" cy="36" r="34" fill="#FF3B30" stroke="#1d1d1f" strokeWidth="3" />
          </svg>
        </motion.div>

        {/* Bottom half — white, slides down */}
        <motion.div
          animate={{ y: [0, 7, 0] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: [0.45, 0, 0.55, 1] }}
          style={{
            position: 'absolute',
            bottom: 0, left: 0,
            width: 72, height: 36,
            overflow: 'hidden',
            display: 'flex',
            alignItems: 'flex-end',
          }}
        >
          <svg width="72" height="72" viewBox="0 0 72 72" fill="none" style={{ marginTop: -36 }}>
            <circle cx="36" cy="36" r="34" fill="white" stroke="#1d1d1f" strokeWidth="3" />
          </svg>
        </motion.div>

        {/* Center band + button — stays centered */}
        <div style={{
          position: 'absolute',
          top: '50%',
          left: 0,
          width: '100%',
          transform: 'translateY(-50%)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          {/* Horizontal line */}
          <div style={{
            position: 'absolute',
            width: '100%',
            height: 3,
            background: '#1d1d1f',
          }} />
          {/* Button ring */}
          <div style={{
            width: 22, height: 22,
            borderRadius: '50%',
            background: '#1d1d1f',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2,
          }}>
            <motion.div
              animate={{ scale: [1, 1.25, 1], backgroundColor: ['#ffffff', '#ff6b6b', '#ffffff'] }}
              transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
              style={{ width: 12, height: 12, borderRadius: '50%' }}
            />
          </div>
        </div>
      </div>

      {/* Label */}
      <motion.p
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 1.6, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          fontSize: '0.875rem',
          color: 'var(--color-label-2)',
          fontWeight: 500,
          letterSpacing: '-0.01em',
        }}
      >
        {label}
      </motion.p>
    </div>
  )
}
