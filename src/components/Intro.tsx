import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'

export function Intro({ onComplete }: { onComplete: () => void }) {
  const [isVisible, setIsVisible] = useState(true)
  const [loadingText, setLoadingText] = useState("00")
  const [showName, setShowName] = useState(false)

  useEffect(() => {
    // Fast loading counter simulation (acts like an AI boot sequence)
    let counter = 0;
    const interval = setInterval(() => {
      counter += 18; 
      if (counter >= 100) {
        setLoadingText("100");
        clearInterval(interval);
        setShowName(true);
      } else {
        setLoadingText(counter.toString().padStart(2, '0'));
      }
    }, 40);

    // Hide the intro after 2.4 seconds total to let the new sequence play
    const timer = setTimeout(() => {
      setIsVisible(false)
      setTimeout(onComplete, 800) // Call onComplete after exit animation finishes
    }, 2400)
    
    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    }
  }, [onComplete])

  const name = "Biswarup Goswami".split("")

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#050505]"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.15, filter: "blur(25px)" }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
        >
          {/* Phase 1: AI / System Boot sequence */}
          <AnimatePresence>
            {!showName && (
              <motion.div 
                className="absolute flex flex-col items-center justify-center"
                exit={{ opacity: 0, y: -20, filter: "blur(10px)", scale: 0.9 }}
                transition={{ duration: 0.3 }}
              >
                <div className="text-orange-500 font-mono text-sm md:text-lg tracking-[0.4em] font-medium drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">
                  SYS.INIT [{loadingText}%]
                </div>
                <div className="w-40 h-[2px] bg-white/10 mt-6 overflow-hidden relative rounded-full">
                  <motion.div 
                    className="absolute top-0 left-0 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,0.8)]" 
                    initial={{ width: "0%" }}
                    animate={{ width: `${loadingText}%` }}
                    transition={{ duration: 0.05 }}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Phase 2: Name and Subtitle reveal */}
          <AnimatePresence>
            {showName && (
              <motion.div 
                className="flex flex-col items-center justify-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="overflow-hidden flex items-center justify-center">
                  {name.map((char, index) => (
                    <motion.span
                      key={index}
                      initial={{ opacity: 0, y: 40, filter: "blur(10px)", scale: 0.8 }}
                      animate={{ opacity: 1, y: 0, filter: "blur(0px)", scale: 1 }}
                      transition={{
                        duration: 0.4,
                        delay: index * 0.03,
                        type: "spring",
                        damping: 12,
                        stiffness: 200
                      }}
                      className={`text-5xl md:text-7xl font-bold tracking-tighter ${char === ' ' ? 'w-4 md:w-6' : ''} ${index > 8 ? 'text-orange-500 drop-shadow-[0_0_15px_rgba(249,115,22,0.8)]' : 'text-white'}`}
                    >
                      {char}
                    </motion.span>
                  ))}
                </div>
                
                <motion.div
                  initial={{ opacity: 0, y: 15, letterSpacing: "0em", filter: "blur(10px)" }}
                  animate={{ opacity: 1, y: 0, letterSpacing: "0.2em", filter: "blur(0px)" }}
                  transition={{ duration: 0.7, delay: 0.4, ease: "easeOut" }}
                  className="mt-6 text-white/50 text-xs md:text-sm font-mono uppercase font-semibold"
                >
                  <span className="text-orange-500 drop-shadow-[0_0_8px_rgba(249,115,22,0.6)]">AI / ML</span> • Data Analyst
                </motion.div>

                <motion.div 
                  className="mt-6 h-[2px] bg-orange-500 rounded-full"
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: "160px", opacity: 1 }}
                  transition={{ duration: 0.7, delay: 0.6, ease: "circOut" }}
                  style={{ boxShadow: "0 0 20px rgba(249, 115, 22, 0.8)" }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
