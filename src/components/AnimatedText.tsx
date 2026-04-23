import { motion, type Variants } from 'framer-motion'

type AnimatedTextProps = {
  text: string
  className?: string
  as?: 'p' | 'h1' | 'h2' | 'h3' | 'span'
  delay?: number
  once?: boolean
}

const container = (delay: number): Variants => ({
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.02,
      delayChildren: delay,
    },
  },
})

const word: Variants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(8px)' },
  show: {
    opacity: 1,
    y: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.6,
      ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
    },
  },
}

export function AnimatedText({ text, className, as = 'p', delay = 0, once = true }: AnimatedTextProps) {
  const Tag =
    as === 'h1'
      ? motion.h1
      : as === 'h2'
        ? motion.h2
        : as === 'h3'
          ? motion.h3
          : as === 'span'
            ? motion.span
            : motion.p
  const words = text.split(' ')

  return (
    <Tag
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once, amount: 0.7 }}
      variants={container(delay)}
      aria-label={text}
    >
      {words.map((w, i) => (
        <motion.span
          // eslint-disable-next-line react/no-array-index-key
          key={`${w}-${i}`}
          className="inline-block"
          variants={word}
        >
          {w}
          <span className="inline-block w-1" />
        </motion.span>
      ))}
    </Tag>
  )
}

