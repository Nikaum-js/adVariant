import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

interface LoadingScreenProps {
  title?: string
  subtitle?: string
}

export function LoadingScreen({
  title = 'Gerando variações...',
  subtitle = 'Isso pode levar alguns segundos. Por favor, aguarde.',
}: LoadingScreenProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16">
      {/* Animated Logo Container */}
      <div className="relative mb-8">
        {/* Outer rotating ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/20"
          style={{ width: 120, height: 120, margin: -20 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
        />

        {/* Middle pulsing ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/40"
          style={{ width: 100, height: 100, margin: -10 }}
          animate={{ scale: [1, 1.1, 1], opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />

        {/* Main circle with gradient */}
        <motion.div
          className="from-primary to-accent relative flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br shadow-2xl shadow-primary/30"
          animate={{ scale: [1, 1.05, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Sparkles className="h-10 w-10 text-white" />
          </motion.div>
        </motion.div>

        {/* Floating particles */}
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            className="bg-primary/60 absolute h-2 w-2 rounded-full"
            style={{
              left: '50%',
              top: '50%',
            }}
            animate={{
              x: [0, Math.cos((i * 60 * Math.PI) / 180) * 50],
              y: [0, Math.sin((i * 60 * Math.PI) / 180) * 50],
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeOut',
            }}
          />
        ))}
      </div>

      {/* Text content */}
      <motion.div
        className="space-y-2 text-center"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h2 className="text-2xl font-semibold">{title}</h2>
        <p className="text-muted-foreground">{subtitle}</p>
      </motion.div>

      {/* Progress dots */}
      <div className="mt-8 flex gap-2">
        {[0, 1, 2].map((i) => (
          <motion.div
            key={i}
            className="bg-primary h-2 w-2 rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 1, 0.3],
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              delay: i * 0.2,
              ease: 'easeInOut',
            }}
          />
        ))}
      </div>

      {/* Animated text hints */}
      <motion.div
        className="text-muted-foreground/60 mt-6 text-sm"
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 3, repeat: Infinity }}
      >
        <AnimatedHints />
      </motion.div>
    </div>
  )
}

function AnimatedHints() {
  const hints = [
    'Analisando briefing...',
    'Aplicando estratégias de persuasão...',
    'Otimizando headlines...',
    'Ajustando tom de voz...',
    'Finalizando variações...',
  ]

  return (
    <motion.div
      className="h-5 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <motion.div
        animate={{ y: [0, -20, -40, -60, -80, 0] }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: 'easeInOut',
          times: [0, 0.2, 0.4, 0.6, 0.8, 1],
        }}
      >
        {hints.map((hint, i) => (
          <div key={i} className="h-5 leading-5">
            {hint}
          </div>
        ))}
      </motion.div>
    </motion.div>
  )
}
