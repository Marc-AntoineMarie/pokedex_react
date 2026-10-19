import { motion } from 'framer-motion'

function Pagination({ page, onPrev, onNext, disablePrev, disableNext }) {
  const btn = (disabled) => ({
    padding: '9px 20px',
    borderRadius: 'var(--r-pill)',
    background: disabled ? 'var(--color-surface-2)' : 'var(--color-accent)',
    color: disabled ? 'var(--color-label-3)' : '#fff',
    fontSize: '0.875rem',
    fontWeight: 500,
    cursor: disabled ? 'not-allowed' : 'pointer',
    opacity: disabled ? 0.5 : 1,
    border: 'none',
    letterSpacing: '-0.01em',
  })

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 'var(--s8)',
      marginTop: 'var(--s12)',
    }}>
      <motion.button
        whileTap={!disablePrev ? { scale: 0.96 } : {}}
        onClick={onPrev}
        disabled={disablePrev}
        style={btn(disablePrev)}
      >
        ← Précédent
      </motion.button>

      <span style={{ fontSize: '0.875rem', color: 'var(--color-label-2)', minWidth: 56, textAlign: 'center' }}>
        Page {page}
      </span>

      <motion.button
        whileTap={!disableNext ? { scale: 0.96 } : {}}
        onClick={onNext}
        disabled={disableNext}
        style={btn(disableNext)}
      >
        Suivant →
      </motion.button>
    </div>
  )
}

export default Pagination
