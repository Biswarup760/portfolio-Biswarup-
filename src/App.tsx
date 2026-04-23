import { useState } from 'react'
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'framer-motion'
//import { AnimatedText } from './components/AnimatedText'
import { Cursor } from './components/Cursor'
import { Intro } from './components/Intro'
import { LiveBackground } from './components/LiveBackground'
import { profile, skillGroups, works, journey, type SkillGroup, type WorkItem, type JourneyItem } from './data/site'

function safeExternal(href: string) {
  return { href, target: '_blank', rel: 'noreferrer' } as const
}

function WorksList({ items }: { items: WorkItem[] }) {
  const prefersReducedMotion = useReducedMotion()
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null)

  return (
    <div className="grid gap-8 md:grid-cols-2" style={{ perspective: 1200 }}>
      {items.map((w, index) => {
        const isFlipped = flippedIndex === index;
        return (
          <motion.div
            key={w.title}
            initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, scale: 0.9, rotateY: 15 }}
            whileInView={prefersReducedMotion ? { opacity: 1 } : { opacity: 1, scale: 1, rotateY: 0 }}
            viewport={{ once: false, amount: 0.2 }}
            transition={{ duration: 0.8, delay: index * 0.2, type: "spring", stiffness: 100, damping: 20 }}
            className="group relative cursor-pointer"
            onClick={() => setFlippedIndex(isFlipped ? null : index)}
          >
            <motion.div 
              className="relative w-full h-full transform-style-3d transition-all duration-700"
              animate={{ rotateY: isFlipped ? 180 : 0 }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              {/* Front side */}
              <div 
                className="relative overflow-hidden rounded-[32px] border border-white/10 bg-white/[0.03] p-4 md:p-6 shadow-glass backdrop-blur-xl"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
              >
                <div className="relative aspect-[4/3] md:aspect-[16/11] overflow-hidden rounded-2xl border border-white/10 bg-black">
                  <motion.img
                    src={w.previewImage}
                    alt=""
                    className="h-full w-full object-cover opacity-80"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.7, ease: 'easeOut' }}
                    loading="lazy"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(255,255,255,0.1),transparent_50%),linear-gradient(to_bottom,transparent,rgba(0,0,0,0.8))]" />
                  <div className="absolute inset-x-0 bottom-0 p-6 md:p-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
                    <div>
                      <h3 className="text-2xl md:text-4xl font-medium text-white">{w.title}</h3>
                      <p className="mt-2 text-sm md:text-base text-white/60">{w.category}</p>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      <span className="btn bg-white/10 text-white backdrop-blur-md" onClick={(e) => { e.stopPropagation(); setFlippedIndex(isFlipped ? null : index); }}>
                        Details ⤾
                      </span>
                      {w.href ? (
                        <a href={w.href} target="_blank" rel="noreferrer" className="btn !bg-orange-500 hover:!bg-orange-600 !text-white !border-transparent backdrop-blur-md shadow-lg shadow-orange-500/20" onClick={(e) => e.stopPropagation()}>
                          View Project ↗
                        </a>
                      ) : (
                        <span className="btn bg-white/5 text-white/50 backdrop-blur-md cursor-not-allowed border-transparent" onClick={(e) => e.stopPropagation()}>
                          Under Development
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Back side */}
              <div 
                className="absolute inset-0 overflow-hidden rounded-[32px] border border-white/10 bg-black/80 p-8 md:p-12 shadow-glass backdrop-blur-xl flex flex-col justify-center items-center text-center"
                style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
              >
                <h3 className="text-3xl md:text-5xl font-bold text-orange-500 mb-4">{w.title}</h3>
                
                {/* Tech Stack */}
                <div className="flex flex-wrap justify-center gap-2 mb-6">
                  {w.techStack?.map(tech => (
                    <span key={tech} className="px-3 py-1 text-xs font-medium bg-white/10 text-white/80 rounded-full border border-white/5">
                      {tech}
                    </span>
                  ))}
                </div>

                <p className="text-lg md:text-xl text-white/80 max-w-2xl leading-relaxed mb-8">
                  {w.details}
                </p>
                {w.href ? (
                  <a className="btn btn-primary !bg-orange-500 hover:!bg-orange-600 !border-transparent !text-white" {...safeExternal(w.href)} onClick={(e) => e.stopPropagation()}>
                    Visit Site ↗
                  </a>
                ) : (
                  <span className="btn bg-white/10 text-white/50 cursor-not-allowed" onClick={(e) => e.stopPropagation()}>
                    Under Development
                  </span>
                )}
              </div>
            </motion.div>
          </motion.div>
        )
      })}
    </div>
  )
}

function SkillsSection({
  groups,
  fadeUp,
  stagger,
}: {
  groups: SkillGroup[]
  fadeUp: { hidden: unknown; show: unknown }
  stagger: { hidden: unknown; show: unknown }
}) {
  const reducedMotion = useReducedMotion()

  const accentClass = (accent: SkillGroup['accent']) => {
    switch (accent) {
      case 'blue':
        return 'from-sky-500/25 via-white/5 to-transparent'
      case 'teal':
        return 'from-emerald-500/20 via-white/5 to-transparent'
      default:
        return 'from-violet-500/25 via-white/5 to-transparent'
    }
  }

  return (
    <div>
      <div className="flex items-start justify-between gap-6">
        <div>
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.5 }}
            transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
            className="mt-2 text-4xl font-bold tracking-tight text-orange-500 md:text-5xl drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"
          >
            Technical Skills
          </motion.h2>
        </div>
      </div>

      <motion.div
        className="mt-8 grid gap-4 lg:grid-cols-3"
        style={{ perspective: 1000 }}
        initial="hidden"
        whileInView="show"
        viewport={{ once: false, amount: 0.35 }}
        variants={stagger as never}
      >
        {groups.map((g) => (
          <motion.div
            key={g.title}
            variants={fadeUp as never}
            className="group relative overflow-hidden rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-glass backdrop-blur-xl"
            data-cursor="hover"
            whileHover={reducedMotion ? undefined : { y: -8, scale: 1.02 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <div className={`pointer-events-none absolute inset-0 opacity-0 transition duration-500 group-hover:opacity-100`}>
              <div className={`absolute -inset-20 bg-gradient-to-br ${accentClass(g.accent)} blur-2xl`} />
            </div>

            <div className="relative">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <motion.div
                    className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-white/[0.04]"
                    animate={reducedMotion ? undefined : { y: [0, -4, 0], rotate: [0, 1.5, 0] }}
                    transition={reducedMotion ? undefined : { duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
                  >
                    <img src={g.icon.logo} alt="" className="h-6 w-6 opacity-90" />
                  </motion.div>
                  <div>
                    <h3 className="text-xl font-medium text-white">{g.title}</h3>
                    <p className="mt-1 text-sm text-white/60">{g.subtitle}</p>
                  </div>
                </div>
                <span className="inline-flex size-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-white/70 transition group-hover:bg-white/[0.06]">
                  ↗
                </span>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {g.badges.map((b) => (
                  <motion.span
                    key={b.name}
                    className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.03] px-3 py-1 text-xs text-white/75"
                    initial={reducedMotion ? undefined : { opacity: 0, y: 8 }}
                    whileInView={reducedMotion ? undefined : { opacity: 1, y: 0 }}
                    viewport={{ once: false, amount: 0.7 }}
                    transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number] }}
                  >
                    <img src={b.logo} alt="" className="h-4 w-4 opacity-90" loading="lazy" />
                    {b.name}
                  </motion.span>
                ))}
              </div>

              <motion.ul
                className="mt-6 space-y-2 text-sm text-white/70"
                initial="hidden"
                whileInView="show"
                viewport={{ once: false, amount: 0.6 }}
                variants={{
                  hidden: {},
                  show: { transition: { staggerChildren: 0.06 } },
                }}
              >
                {g.bullets.map((t) => (
                  <motion.li
                    key={t}
                    variants={{
                      hidden: { opacity: 0, y: reducedMotion ? 0 : 10 },
                      show: { opacity: 1, y: 0, transition: { duration: 0.35 } },
                    }}
                    className="flex items-start gap-2"
                  >
                    <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-white/45" />
                    <span>{t}</span>
                  </motion.li>
                ))}
              </motion.ul>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  )
}

function JourneySection({ items }: { items: JourneyItem[] }) {
  const { scrollYProgress } = useScroll()
  
  return (
    <div className="relative max-w-4xl mx-auto py-10">
      <div className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/10" />
      <motion.div 
        className="absolute left-[24px] md:left-1/2 top-0 bottom-0 w-[2px] bg-orange-500 origin-top"
        style={{ scaleY: scrollYProgress }}
      />

      <div className="grid gap-16">
        {items.map((item, index) => {
          const isEven = index % 2 === 0
          return (
            <motion.div 
              key={item.title}
              initial={{ opacity: 0, x: isEven ? -50 : 50, y: 30 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              viewport={{ once: false, margin: "-100px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`relative flex flex-col md:flex-row gap-8 items-start ${isEven ? 'md:flex-row-reverse text-left md:text-right' : 'text-left'}`}
            >
              <div className="absolute left-[19px] md:left-1/2 md:-ml-[6px] top-1 w-[12px] h-[12px] rounded-full bg-black border-2 border-orange-500 z-10" />
              
              <div className="w-full pl-16 md:pl-0 md:w-1/2">
                <div className={`flex flex-col ${isEven ? 'md:items-end' : 'md:items-start'}`}>
                  <span className="text-orange-500 font-mono text-sm mb-2">{item.year}</span>
                  <h3 className="text-2xl font-medium text-white mb-3">{item.title}</h3>
                  <p className="text-white/60 leading-relaxed">{item.description}</p>
                </div>
              </div>
              <div className="hidden md:block md:w-1/2" />
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}

function App() {
  const [introFinished, setIntroFinished] = useState(false)
  const prefersReducedMotion = useReducedMotion()
  const { scrollYProgress, scrollY } = useScroll()
  const heroY = useTransform(scrollYProgress, [0, 0.28], [0, prefersReducedMotion ? 0 : -40])
  //const heroOpacity = useTransform(scrollYProgress, [0, 0.22], [1, 0.35])

  const [isScrolled, setIsScrolled] = useState(false)
  useMotionValueEvent(scrollY, 'change', (v) => {
    setIsScrolled(v > 60)
  })

  //const [tick, setTick] = useState(0)
  /*useMotionValueEvent(scrollYProgress, 'change', (v) => {
    // coarse re-render to keep time/labels feeling alive (without heavy work)
    const next = Math.floor(v * 100)
    setTick((t) => (t === next ? t : next))
  })*/

  const fadeUp = {
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 50, rotateX: prefersReducedMotion ? 0 : 45 },
    show: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: { duration: 0.8, type: 'spring', bounce: 0.4 },
    },
  }

  const stagger = {
    hidden: {},
    show: { transition: { staggerChildren: 0.08, delayChildren: 0.05 } },
  }

  /*const timeLabel = useMemo(() => {
    // simple “clock” like the reference, without timezone complexity
    const d = new Date()
    const hh = String(d.getHours()).padStart(2, '0')
    const mm = String(d.getMinutes()).padStart(2, '0')
    const ss = String(d.getSeconds()).padStart(2, '0')
    return `${hh}:${mm}:${ss}`
  }, [tick])*/

  return (
    <>
      <Intro onComplete={() => setIntroFinished(true)} />
      <div className="relative min-h-dvh overflow-hidden">
        <LiveBackground />
        <Cursor />

        <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-black/25 backdrop-blur-xl">
        <div className="container-page">
          <div className="flex items-center justify-between py-4">
            <a
              href="#top"
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] pl-1 pr-3 py-1 text-sm text-white/80 transition hover:bg-white/[0.06]"
            >
              <div className="relative size-7 flex items-center justify-center">
                {isScrolled ? (
                  <motion.img
                    layoutId="hero-image"
                    src={`${import.meta.env.BASE_URL}me2.png`}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                    style={{ borderRadius: 9999 }}
                  />
                ) : (
                  <span className="size-2 rounded-full bg-white/80" />
                )}
              </div>
              <span className="font-bold text-orange-500 drop-shadow-[0_0_10px_rgba(249,115,22,0.8)]">BG</span>
            </a>

            <nav className="hidden items-center gap-6 text-sm text-white/70 md:flex">
              <a className="hover:text-white" href="#about">
                About
              </a>
              <a className="hover:text-white" href="#projects">
                Projects
              </a>
              <a className="hover:text-white" href="#skills">
                Skills
              </a>
              <a className="hover:text-white" href="#journey">
                Journey
              </a>
              <a className="hover:text-white" href="#contact">
                Contact
              </a>
            </nav>

            <div className="flex items-center gap-3">
              <a 
                className="btn font-medium shadow-lg shadow-orange-500/20" 
                style={{ backgroundColor: '#f97316', color: 'white', borderColor: 'transparent' }} 
                href="/Biswarup resume.pdf" 
                download="Resume_Biswarup.pdf"
              >
                Resume ↓
              </a>
              <a className="btn btn-primary" href="#contact">
                Get in touch →
              </a>
            </div>
          </div>
        </div>
      </header>

      <main id="top" className="relative z-10 pt-20">
        {/* Cinematic Hero Section */}
        <section className="relative min-h-screen w-full flex flex-col justify-end pb-12 pt-32 overflow-hidden -mt-20">
          <motion.div 
            className="absolute inset-0 z-0"
            style={{ y: heroY, scale: useTransform(scrollY, [0, 800], [1.15, 1]) }}
          >
            <motion.img 
              src={`${import.meta.env.BASE_URL}me2.png`}
              alt="" 
              className="absolute bottom-0 left-1/2 -translate-x-1/2 h-[85vh] w-auto max-w-full object-cover object-top brightness-110 contrast-105"
              style={{ WebkitMaskImage: 'linear-gradient(to top, black 90%, transparent 100%), linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskComposite: 'source-in', maskImage: 'linear-gradient(to top, black 90%, transparent 100%), linear-gradient(to right, transparent, black 15%, black 85%, transparent)', maskComposite: 'intersect' }}
              variants={{
                hidden: { opacity: 0 },
                show: { opacity: 1, transition: { duration: 1.5, ease: "easeOut" } }
              }}
              initial="hidden"
              whileInView={introFinished ? "show" : "hidden"}
              viewport={{ once: false }}
            />
            {/* Soft gradient to ensure hero text is readable against the image and global background */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent" />
          </motion.div>

          <div className="container-page relative z-10 w-full flex flex-col md:flex-row md:items-center justify-between gap-8 mt-auto mb-16">
            <div className="overflow-hidden max-w-2xl py-4">
              <motion.h1 
                variants={{
                  hidden: { filter: "blur(12px)", x: -100, opacity: 0 },
                  show: { filter: "blur(0px)", x: 0, opacity: 1, transition: { duration: 1.2, delay: 0.1, type: "spring", bounce: 0.4 } }
                }}
                initial="hidden"
                whileInView={introFinished ? "show" : "hidden"}
                viewport={{ once: false, amount: 0.3 }}
                className="text-4xl md:text-5xl lg:text-7xl font-bold leading-[1.1] tracking-tighter text-white"
              >
                Hi, this is <br/><span className="text-orange-500">Biswarup Goswami</span>
              </motion.h1>
            </div>
            
            <div className="overflow-hidden max-w-sm md:text-right py-4">
               <motion.p
                 variants={{
                   hidden: { filter: "blur(12px)", opacity: 0, x: 100 },
                   show: { filter: "blur(0px)", opacity: 1, x: 0, transition: { duration: 1.2, delay: 0.3, type: "spring", bounce: 0.4 } }
                 }}
                 initial="hidden"
                 whileInView={introFinished ? "show" : "hidden"}
                 viewport={{ once: false, amount: 0.3 }}
                 className="text-xl md:text-2xl font-bold text-white/90 leading-relaxed"
               >
                 Aspiring <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]">data analyst</span> with a keen interest in <span className="text-orange-500 drop-shadow-[0_0_12px_rgba(249,115,22,0.5)]">AI/ML</span>
               </motion.p>
            </div>
          </div>
        </section>


        {/* About Section */}
        <section id="about" className="container-page pt-24 pb-16">
          <div className="max-w-4xl mx-auto text-center">
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8 }}
              className="text-orange-500 font-bold mb-6 uppercase tracking-widest text-lg md:text-xl drop-shadow-[0_0_10px_rgba(249,115,22,0.5)]"
            >
              About Me
            </motion.p>
            <motion.h2 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.1 }}
              className="text-3xl md:text-5xl font-bold text-orange-500 leading-tight mb-8 drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"
            >
              Building practical <span className="text-orange-500">AI</span> and data-driven products with clean design.
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false, amount: 0.5 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="text-lg text-white/60 leading-relaxed"
            >
              {profile.summary}
            </motion.p>
          </div>
        </section>

        {/* Projects */}
        <section id="projects" className="container-page pt-16 md:pt-24">
          <div className="flex items-end justify-between gap-6">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="mt-2 text-4xl font-bold tracking-tight text-orange-500 md:text-5xl drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"
              >
                Featured Projects
              </motion.h2>
            </div>
            <a className="btn hidden md:inline-flex" href="#contact">
              Start collaboration →
            </a>
          </div>

          <div className="mt-8">
            <WorksList items={works} />
          </div>
        </section>

        {/* Technical skills */}
        <section id="skills" className="container-page pt-16 md:pt-24">
          <SkillsSection groups={skillGroups} fadeUp={fadeUp} stagger={stagger} />
        </section>

        {/* My Journey */}
        <section id="journey" className="container-page pt-16 md:pt-24">
          <div className="flex items-end justify-between gap-6 mb-16">
            <div>
              <motion.h2 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: false, amount: 0.5 }}
                transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                className="mt-2 text-4xl font-bold tracking-tight text-orange-500 md:text-5xl drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"
              >
                Milestones
              </motion.h2>
            </div>
          </div>
          <JourneySection items={journey} />
        </section>

        {/* Contact */}
        <section id="contact" className="container-page py-16 md:py-24">
          <div className="glass rounded-3xl p-8 md:p-10">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
              <div>
                <motion.h2 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: false, amount: 0.5 }}
                  transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
                  className="text-3xl font-bold tracking-tight text-orange-500 md:text-4xl drop-shadow-[0_0_15px_rgba(249,115,22,0.6)]"
                >
                  Contact
                </motion.h2>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <a className="btn btn-primary w-full sm:w-auto" href={`mailto:${profile.email}`}>
                  Email me
                </a>
                <a className="btn w-full sm:w-auto" href={`tel:${profile.phone}`}>
                  Call
                </a>
              </div>
            </div>

            <motion.div 
              className="mt-6 grid gap-3 md:grid-cols-2"
              initial="hidden"
              whileInView="show"
              viewport={{ once: false, amount: 0.5 }}
              variants={{
                show: { transition: { staggerChildren: 0.15 } }
              }}
            >
              <motion.a 
                href={`mailto:${profile.email}`}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" } } }}
                whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="glass rounded-2xl px-4 py-6 text-center cursor-pointer transition-colors"
              >
                <div className="mx-auto size-10 flex items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-3 text-lg">
                  ✉
                </div>
                <p className="text-xs text-white/50 mb-1">Email</p>
                <p className="text-sm md:text-base font-medium text-white">{profile.email}</p>
              </motion.a>
              <motion.a 
                href={`tel:${profile.phone}`}
                variants={{ hidden: { opacity: 0, y: 20 }, show: { opacity: 1, y: 0, transition: { type: "spring" } } }}
                whileHover={{ scale: 1.05, y: -5, backgroundColor: "rgba(255,255,255,0.08)" }}
                className="glass rounded-2xl px-4 py-6 text-center cursor-pointer transition-colors"
              >
                <div className="mx-auto size-10 flex items-center justify-center rounded-full bg-orange-500/20 text-orange-500 mb-3 text-lg">
                  ✆
                </div>
                <p className="text-xs text-white/50 mb-1">Phone</p>
                <p className="text-sm md:text-base font-medium text-white">{profile.phone}</p>
              </motion.a>
            </motion.div>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-6 text-sm text-white/50">
              <p>All rights reserved, ©{new Date().getFullYear()}</p>
              <p className="text-white/60">{profile.email}</p>
            </div>
          </div>
        </section>
      </main>
    </div>
    </>
  )
}

export default App
