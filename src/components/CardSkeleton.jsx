import { motion } from 'framer-motion'

function Shimmer() {
  return (
    <motion.div
      animate={{ x: ['-100%', '200%'] }}
      transition={{ duration: 1.4, repeat: Infinity, ease: 'linear', repeatDelay: 0.3 }}
      style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.7) 50%, transparent 100%)',
        pointerEvents: 'none',
      }}
    />
  )
}

function Bone({ width = '100%', height = 12, radius = 6, style = {} }) {
  return (
    <div style={{
      position: 'relative',
      overflow: 'hidden',
      width,
      height,
      borderRadius: radius,
      background: 'var(--color-surface-3)',
      flexShrink: 0,
      ...style,
    }}>
      <Shimmer />
    </div>
  )
}

export default function CardSkeleton() {
  return (
    <div style={{
      background: 'var(--color-surface)',
      borderRadius: 20,
      boxShadow: '0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06)',
      padding: '20px 16px 16px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 10,
    }}>
      {/* ID */}
      <Bone width={28} height={9} radius={4} style={{ alignSelf: 'flex-start' }} />

      {/* Image placeholder */}
      <Bone width={88} height={88} radius={12} />

      {/* Name */}
      <Bone width="65%" height={13} radius={6} />

      {/* Type badge */}
      <Bone width={52} height={20} radius={980} />

      {/* Button */}
      <Bone width="100%" height={32} radius={8} style={{ marginTop: 2 }} />
    </div>
  )
}
