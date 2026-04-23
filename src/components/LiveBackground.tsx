//import { motion } from 'framer-motion'

export function LiveBackground() {
  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      <div 
        className="absolute inset-0 w-full h-full bg-center bg-cover bg-no-repeat opacity-100"
        style={{ backgroundImage: `url(${import.meta.env.BASE_URL}portfolio-bg.png)` }} 
      />
      {/* Optional dark overlay to ensure text readability */}
      <div className="absolute inset-0 bg-black/40 mix-blend-multiply" />
    </div>
  )
}
