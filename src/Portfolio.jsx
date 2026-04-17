import { useState, useEffect, useRef, useCallback } from 'react'

// ─────────────────────────────────────────────────────────────────────────────
// BASE64 PLACEHOLDERS  ← Replace with your real files
// Photo:  https://www.base64-image.de/
// Resume: https://base64.guru/converter/encode/pdf
// ─────────────────────────────────────────────────────────────────────────────
const PROFILE_PHOTO_BASE64 = '/profile.jpg'
const RESUME_BASE64 = '/resume.pdf' // Path to your resume in the public folder

// ─────────────────────────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────────────────────────
const NAV_LINKS = ['Home', 'About', 'Education', 'Skills', 'Projects', 'Achievements', 'Contact']
const TYPEWRITER_PHRASES = [
  '"I build tech that saves lives."',
  'Founder  ·  Innovator  ·  Engineer.',
  'AI   ×   IoT   ×   Full‑Stack Dev.',
]
const TICKER_ITEMS = [
  '🐍 Python', '⚛️ React.js', '🍓 Raspberry Pi', '👁️ OpenCV', '📡 ESP8266',
  '🍃 MongoDB', '🤖 Machine Learning', '⚡ Arduino', '🔥 Firebase', '🌐 IoT Systems',
  '🎨 Tailwind CSS', '📊 Data Science', '🖥️ Computer Vision', '🔧 Embedded Systems',
  '☁️ Google Cloud', '🗄️ SQL', '🐙 GitHub', '📱 Edge AI',
]
const EDUCATION = [
  {
    degree: 'B.E. in Information Science & Engineering',
    institution: 'Vidyavardhaka College of Engineering, Mysuru',
    period: 'Aug 2024 – Jul 2028', detail: '2nd Year · VTU Affiliated', score: 'Pursuing',
  },
  {
    degree: 'PUC Science',
    institution: 'Tungal Independent PU Science College, Vijayapur',
    period: '2024', detail: 'Karnataka State Board', score: '92%',
  },
  {
    degree: '10th Standard (CBSE)',
    institution: 'Anandathirtha Vidyalaya, Udupi',
    period: '2022', detail: 'Central Board of Secondary Education', score: '82%',
  },
]
const ABOUT_STATS = [
  { num: 5, suffix: '+', label: 'Projects Shipped', sub: 'AI · IoT · Web' },
  { num: 2, suffix: '', label: 'Patents Published', sub: 'Indian Innovation' },
  { num: 2, suffix: '×', label: 'Hackathon Podiums', sub: 'National & College' },
  { num: 3, suffix: '', label: 'Ventures Founded', sub: 'Tech Startups' },
  { num: 2, suffix: 'nd', label: 'Year of Engineering', sub: 'VCE, Mysuru' },
  { num: 92, suffix: '%', label: 'PUC Score', sub: 'Karnataka Board' },
]
const SKILLS = [
  { cat: 'Languages', emoji: '⌨️', items: [{ name: 'Python', level: 88 }, { name: 'JavaScript', level: 82 }, { name: 'Java (OOP)', level: 70 }, { name: 'C', level: 65 }] },
  { cat: 'Web Technologies', emoji: '🌐', items: [{ name: 'React.js', level: 85 }, { name: 'HTML5/CSS3', level: 92 }, { name: 'Tailwind CSS', level: 87 }] },
  { cat: 'Databases', emoji: '🗄️', items: [{ name: 'SQL', level: 75 }, { name: 'MongoDB', level: 70 }] },
  { cat: 'Tools', emoji: '🛠️', items: [{ name: 'GitHub', level: 86 }, { name: 'VS Code', level: 94 }, { name: 'Google Cloud', level: 60 }, { name: 'Eclipse', level: 72 }] },
  { cat: 'Data Science', emoji: '📊', items: [{ name: 'Machine Learning', level: 75 }, { name: 'Pandas & NumPy', level: 80 }, { name: 'Computer Vision', level: 70 }, { name: 'Data Viz', level: 72 }] },
  { cat: 'Hardware / IoT', emoji: '🔧', items: [{ name: 'Arduino', level: 85 }, { name: 'Raspberry Pi', level: 82 }, { name: 'ESP8266', level: 78 }, { name: 'Embedded Sys.', level: 72 }] },
  { cat: 'Soft Skills', emoji: '🤝', items: [{ name: 'Leadership', level: 90 }, { name: 'Public Speaking', level: 85 }, { name: 'Problem Solving', level: 92 }, { name: 'Project Mgmt', level: 80 }] },
]
const PROJECTS = [
  {
    num: '01', cat: 'AI · Safety', title: 'SafeNest', status: 'Completed',
    desc: 'AI-based surveillance using OpenCV and Raspberry Pi. Real-time living-being detection in low-light environments to prevent accidents.',
    tags: ['Computer Vision', 'Raspberry Pi', 'OpenCV']
  },
  {
    num: '02', cat: 'IoT · Infrastructure', title: 'Hydrova', status: 'Completed',
    desc: 'Smart water level monitoring with ESP8266 and GSM module. Real-time alerts for authorities to prevent urban flooding.',
    tags: ['IoT', 'ESP8266', 'GSM', 'Monitoring']
  },
  {
    num: '03', cat: 'Environment · Tech', title: 'VAHANA', status: 'Completed',
    desc: 'Vehicle Air-Quality Health Analytics and Notification Assistant. Tracks exhaust data to enforce pollution standards.',
    tags: ['Environmental Tech', 'Sensors', 'IoT']
  },
  {
    num: '04', cat: 'AI · EdTech', title: 'VidyaTej-AI', status: 'Completed',
    desc: 'Full-stack platform with React.js, Tailwind & Firebase. AI-powered resume analysis, roadmap generation, and job matching.',
    tags: ['React.js', 'Firebase', 'AI', 'EdTech']
  },
  {
    num: '05', cat: 'Health', title: 'BloodConnect', status: 'Completed',
    desc: 'Real-time platform connecting blood donors with recipients in critical need. Intelligent nearby donor matching.',
    tags: ['HealthTech', 'Real-time']
  },
  {
    num: '06', cat: 'Upcoming', title: 'Next Innovation', status: 'In Progress',
    desc: 'AI-based environmental monitoring with cutting-edge sensors and ML models for predictive analytics and alerts.',
    tags: ['AI', 'Environment']
  },
]
const ACHIEVEMENTS = [
  {
    icon: '📜', title: 'Patents Filed', subtitle: '2 Published Patents', content: [
      { label: 'Patent 1 — AI Surveillance', detail: 'App No. 202541012161 A · Published 2025\nSafeNest AI surveillance system — officially published Indian innovation.' },
      { label: 'Patent 2 — HYDROVA', detail: 'App No. 202541120925 A · Published 02 Jan 2026\n"HYDROVA — The Future of Manhole Water Management"\nFiled: 03 Dec 2025 · Inventors: Prof. Karthik R, Pravachan D S, Pranav S Handral\nApplicant: Vidyavardhaka College of Engineering' },
    ]
  },
  {
    icon: '🏆', title: 'Hackathon Wins', subtitle: 'National & Inter-college Podiums', content: [
      { label: 'IIT Bombay Hackathon', detail: '3rd Place — National Level among thousands of participants.' },
      { label: 'Nitte Meenakshi Institute of Technology', detail: '2nd Place — Inter-college hackathon for innovative tech solutions.' },
    ]
  },
  {
    icon: '🚀', title: 'Founder & Innovator', subtitle: '3 Ventures Built', content: [
      { label: 'SAFENEST', detail: 'Technology startup: AI-based safety solutions for urban environments.' },
      { label: 'VIDYATEJ', detail: 'AI-powered EdTech venture bridging education and technology.' },
      { label: 'HYDROVA', detail: 'IoT-based water level monitoring for urban drainage and smart cities.' },
    ]
  },
  {
    icon: '🎖️', title: 'Leadership Roles', subtitle: 'NSS & T&P Coordinator', content: [
      { label: 'NSS Coordinator', detail: 'National Service Scheme — community outreach, camps, volunteer leadership.' },
      { label: 'Training & Placement Coordinator', detail: 'T&P Department — placement drives, campus recruitment, student prep.' },
    ]
  },
]
const HERO_STATS = [
  { value: '5+', label: 'Projects Built' },
  { value: '2×', label: 'Podium Finishes' },
  { value: '2', label: 'Patents Filed' },
  { value: '∞', label: 'Curiosity' },
]

// ─────────────────────────────────────────────────────────────────────────────
// HOOKS
// ─────────────────────────────────────────────────────────────────────────────

function useCursor() {
  const dotRef = useRef(null)
  const ringRef = useRef(null)
  const labelRef = useRef(null)
  const bubblesRef = useRef([])
  const mouse = useRef({ x: -200, y: -200 })
  const ring = useRef({ x: -200, y: -200 })
  const trail = useRef(Array(8).fill({ x: -200, y: -200 }))
  const raf = useRef(null)
  const hovering = useRef(false)

  useEffect(() => {
    const dot = dotRef.current, rng = ringRef.current, lbl = labelRef.current
    const lerp = (a, b, t) => a + (b - a) * t

    const onMove = (e) => { mouse.current = { x: e.clientX, y: e.clientY } }

    const onOver = (e) => {
      const el = e.target.closest('a,button,[data-cursor-label]')
      if (el && !hovering.current) {
        hovering.current = true
        if (dot) { dot.style.transform = 'translate(-50%,-50%) scale(0)'; dot.style.opacity = '0' }
        if (rng) { rng.style.width = '54px'; rng.style.height = '54px'; rng.style.background = 'rgba(163,230,53,0.1)'; rng.style.borderColor = 'rgba(163,230,53,0.9)' }
        const txt = el.getAttribute('data-cursor-label') || ''
        if (lbl) { lbl.textContent = txt; lbl.style.opacity = txt ? '1' : '0' }
      }
    }
    const onOut = (e) => {
      const from = e.target.closest('a,button,[data-cursor-label]')
      const to = e.relatedTarget?.closest('a,button,[data-cursor-label]')
      if (from && from !== to && hovering.current) {
        hovering.current = false
        if (dot) { dot.style.transform = 'translate(-50%,-50%) scale(1)'; dot.style.opacity = '1' }
        if (rng) { rng.style.width = '28px'; rng.style.height = '28px'; rng.style.background = 'transparent'; rng.style.borderColor = '#a3e635' }
        if (lbl) { lbl.style.opacity = '0'; lbl.textContent = '' }
      }
    }
    const onClick = () => {
      if (!rng) return
      rng.style.transition = 'none'
      rng.style.width = '72px'; rng.style.height = '72px'; rng.style.opacity = '0'
      requestAnimationFrame(() => {
        rng.style.transition = 'width 0.22s ease,height 0.22s ease,opacity 0.22s ease'
        const sz = hovering.current ? '54px' : '28px'
        rng.style.width = sz; rng.style.height = sz; rng.style.opacity = '0.7'
        setTimeout(() => { if (rng) rng.style.transition = '' }, 280)
      })
    }

    window.addEventListener('mousemove', onMove)
    document.addEventListener('mouseover', onOver, true)
    document.addEventListener('mouseout', onOut, true)
    window.addEventListener('click', onClick)

    const tick = () => {
      if (dot) { dot.style.left = mouse.current.x + 'px'; dot.style.top = mouse.current.y + 'px' }
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12)
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12)
      if (rng) { rng.style.left = ring.current.x + 'px'; rng.style.top = ring.current.y + 'px' }
      if (lbl) { lbl.style.left = ring.current.x + 'px'; lbl.style.top = ring.current.y + 'px' }
      const newT = [{ ...mouse.current }]
      for (let i = 1; i < 8; i++) newT.push({ x: lerp(trail.current[i - 1].x, trail.current[i]?.x ?? mouse.current.x, 0.35), y: lerp(trail.current[i - 1].y, trail.current[i]?.y ?? mouse.current.y, 0.35) })
      trail.current = newT
      bubblesRef.current.forEach((el, i) => {
        if (!el) return
        const s = 9 - i
        el.style.left = trail.current[i].x + 'px'; el.style.top = trail.current[i].y + 'px'
        el.style.width = s + 'px'; el.style.height = s + 'px'
        el.style.opacity = ((1 - i / 9) * 0.42).toFixed(2)
      })
      raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => {
      window.removeEventListener('mousemove', onMove)
      document.removeEventListener('mouseover', onOver, true)
      document.removeEventListener('mouseout', onOut, true)
      window.removeEventListener('click', onClick)
      cancelAnimationFrame(raf.current)
    }
  }, [])
  return { dotRef, ringRef, labelRef, bubblesRef }
}

function useParticles(canvasRef) {
  useEffect(() => {
    const canvas = canvasRef.current; if (!canvas) return
    const ctx = canvas.getContext('2d'); let animId
    const particles = []; const COUNT = 90
    const resize = () => { canvas.width = canvas.offsetWidth; canvas.height = canvas.offsetHeight }
    resize(); window.addEventListener('resize', resize)
    for (let i = 0; i < COUNT; i++) particles.push({ x: Math.random() * canvas.width, y: Math.random() * canvas.height, vx: (Math.random() - 0.5) * 0.4, vy: (Math.random() - 0.5) * 0.4, r: Math.random() * 1.5 + 0.5 })
    const MAX = 140
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      particles.forEach(p => {
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > canvas.width) p.vx *= -1
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2); ctx.fillStyle = 'rgba(163,230,53,0.75)'; ctx.fill()
      })
      for (let i = 0; i < COUNT; i++) for (let j = i + 1; j < COUNT; j++) {
        const dx = particles[i].x - particles[j].x, dy = particles[i].y - particles[j].y, d = Math.hypot(dx, dy)
        if (d < MAX) { ctx.beginPath(); ctx.moveTo(particles[i].x, particles[i].y); ctx.lineTo(particles[j].x, particles[j].y); ctx.strokeStyle = `rgba(163,230,53,${(1 - d / MAX) * 0.22})`; ctx.lineWidth = 0.7; ctx.stroke() }
      }
      animId = requestAnimationFrame(draw)
    }
    draw()
    return () => { cancelAnimationFrame(animId); window.removeEventListener('resize', resize) }
  }, [canvasRef])
}

function useScrollReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible') }), { threshold: 0.12 })
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])
}

function useActiveSection() {
  const [active, setActive] = useState('Home')
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => { if (e.isIntersecting) { const id = e.target.id; setActive(id.charAt(0).toUpperCase() + id.slice(1)) } }),
      { rootMargin: '-40% 0px -55% 0px' }
    )
    NAV_LINKS.forEach(l => { const el = document.getElementById(l.toLowerCase()); if (el) obs.observe(el) })
    return () => obs.disconnect()
  }, [])
  return active
}

function useTypewriter(phrases) {
  const [display, setDisplay] = useState('')
  const stateRef = useRef({ idx: 0, char: 0, deleting: false })
  useEffect(() => {
    let timer
    const SPEED = 72, PAUSE = 2100, DEL = 36, GAP = 380
    const tick = () => {
      const { idx, char, deleting } = stateRef.current
      const full = phrases[idx]
      if (!deleting && char < full.length) { setDisplay(full.slice(0, char + 1)); stateRef.current.char++; timer = setTimeout(tick, SPEED) }
      else if (!deleting && char === full.length) { stateRef.current.deleting = true; timer = setTimeout(tick, PAUSE) }
      else if (deleting && char > 0) { setDisplay(full.slice(0, char - 1)); stateRef.current.char--; timer = setTimeout(tick, DEL) }
      else { stateRef.current.deleting = false; stateRef.current.idx = (idx + 1) % phrases.length; timer = setTimeout(tick, GAP) }
    }
    timer = setTimeout(tick, 1400)
    return () => clearTimeout(timer)
  }, []) // eslint-disable-line
  return display
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPONENTS
// ─────────────────────────────────────────────────────────────────────────────

/* Animated intro loader */
function Loader({ onDone }) {
  const [progress, setProgress] = useState(0)
  const [fading, setFading] = useState(false)

  useEffect(() => {
    const timers = []
      ;[[300, 18], [750, 40], [1200, 65], [1700, 88], [2100, 100]].forEach(([d, v]) => timers.push(setTimeout(() => setProgress(v), d)))
    timers.push(setTimeout(() => setFading(true), 2350))
    timers.push(setTimeout(() => onDone(), 2850))
    return () => timers.forEach(clearTimeout)
  }, [onDone])

  return (
    <div className="fixed inset-0 z-[99999] bg-black grid-pattern flex flex-col items-center justify-center"
      style={{ opacity: fading ? 0 : 1, pointerEvents: fading ? 'none' : 'all', transition: 'opacity 0.5s ease' }}>
      {/* Scan line */}
      <div className="absolute left-0 right-0 h-px pointer-events-none"
        style={{ background: 'linear-gradient(90deg,transparent,rgba(163,230,53,0.55),transparent)', animation: 'scan-line 2.5s linear infinite' }} />
      {/* Logo */}
      <div className="mb-10 animate-fade-up opacity-0 delay-100 select-none">
        <div className="text-8xl font-black font-mono text-lime-400"
          style={{ textShadow: '0 0 50px rgba(163,230,53,0.75),0 0 100px rgba(163,230,53,0.25)' }}>
          PSH<span className="text-white/30">.</span>
        </div>
      </div>
      <p className="font-mono text-gray-600 text-[11px] tracking-[0.42em] uppercase mb-8 animate-fade-up opacity-0 delay-200">
        Initializing Portfolio
      </p>
      {/* Progress bar */}
      <div className="relative w-60 h-px bg-white/5 animate-fade-up opacity-0 delay-300">
        <div className="absolute inset-y-0 left-0 transition-all duration-500 ease-out"
          style={{ width: `${progress}%`, background: '#a3e635', boxShadow: '0 0 14px #a3e635,0 0 28px rgba(163,230,53,0.4)' }} />
        {progress < 100 && (
          <div className="absolute top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-lime-400"
            style={{ left: `${progress}%`, boxShadow: '0 0 8px #a3e635', transition: 'left 0.5s ease' }} />
        )}
      </div>
      <p className="font-mono text-lime-400/50 text-xs mt-4 tabular-nums animate-fade-up opacity-0 delay-400">{progress}%</p>
    </div>
  )
}

/* Three animated gradient blobs */
function FloatingOrbs() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {[
        { w: 520, h: 520, bg: 'rgba(163,230,53,0.13)', t: '-8%', l: '-10%', anim: 'blob-float-1 22s ease-in-out infinite', blur: 48 },
        { w: 420, h: 420, bg: 'rgba(52,211,153,0.10)', t: '35%', r: '-8%', anim: 'blob-float-2 28s ease-in-out infinite', delay: '-10s', blur: 44 },
        { w: 320, h: 320, bg: 'rgba(129,140,248,0.07)', b: '12%', l: '28%', anim: 'blob-float-3 19s ease-in-out infinite', delay: '-6s', blur: 40 },
      ].map((o, i) => (
        <div key={i} style={{
          position: 'absolute', width: o.w, height: o.h, borderRadius: '50%',
          background: `radial-gradient(circle,${o.bg},transparent 70%)`,
          top: o.t, left: o.l, right: o.r, bottom: o.b,
          filter: `blur(${o.blur}px)`,
          animation: o.anim, animationDelay: o.delay,
        }} />
      ))}
    </div>
  )
}

/* Horizontal tech ticker */
function TechTicker() {
  const doubled = [...TICKER_ITEMS, ...TICKER_ITEMS]
  return (
    <div className="relative overflow-hidden py-5 bg-zinc-950 border-y border-white/5">
      <div className="ticker-fade-l" />
      <div className="ticker-fade-r" />
      <div className="flex gap-12 w-max animate-ticker">
        {doubled.map((item, i) => (
          <span key={i} className="text-sm font-mono text-gray-500 whitespace-nowrap flex items-center gap-2.5">
            <span className="text-lime-400 text-[10px]">◆</span>
            {item}
          </span>
        ))}
      </div>
    </div>
  )
}

/* Count-up animated stat tile */
function CountStat({ num, suffix = '', label, sub }) {
  const [count, setCount] = useState(0)
  const [started, setStarted] = useState(false)
  const ref = useRef(null)

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStarted(true) }, { threshold: 0.5 })
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    if (!started) return
    let t0 = null
    const step = ts => {
      if (!t0) t0 = ts
      const pct = Math.min((ts - t0) / 1600, 1)
      setCount(Math.round((1 - Math.pow(1 - pct, 3)) * num))
      if (pct < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [started, num])

  return (
    <div ref={ref} className="shimmer-card glow-card bg-zinc-900 border border-white/5 rounded-xl p-5 hover:border-lime-400/40 transition-colors duration-300">
      <div className="text-3xl font-black text-lime-400 font-mono mb-1 tabular-nums">
        {started ? count : 0}{suffix}
      </div>
      <div className="text-white font-semibold text-sm">{label}</div>
      {sub && <div className="text-gray-600 text-xs mt-0.5">{sub}</div>}
    </div>
  )
}

/* 3-D mouse-follow tilt card */
function TiltCard({ children, className, style: extra }) {
  const ref = useRef(null)
  const onMove = useCallback((e) => {
    if (!ref.current) return
    const r = ref.current.getBoundingClientRect()
    const rx = ((e.clientY - r.top) / r.height - 0.5) * -14
    const ry = ((e.clientX - r.left) / r.width - 0.5) * 14
    ref.current.style.transition = 'transform 0.06s ease'
    ref.current.style.transform = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(10px)`
  }, [])
  const onLeave = useCallback(() => {
    if (!ref.current) return
    ref.current.style.transition = 'transform 0.55s ease'
    ref.current.style.transform = 'perspective(900px) rotateX(0deg) rotateY(0deg) translateZ(0px)'
  }, [])
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={onLeave}
      className={className} style={{ ...extra, transformStyle: 'preserve-3d', willChange: 'transform' }}>
      {children}
    </div>
  )
}

/* Reusable section heading with glow orb + neon accent */
function SectionHeading({ eyebrow, title, accent, sub }) {
  return (
    <div className="reveal mb-16 relative">
      <div className="absolute -top-8 -left-8 w-56 h-28 bg-lime-400/5 blur-3xl rounded-full pointer-events-none animate-glow-pulse" />
      <p className="font-mono text-lime-400 text-sm tracking-widest uppercase mb-3">{eyebrow}</p>
      <h2 className="text-4xl md:text-5xl font-black">
        {title} {accent && <span className="text-lime-400 animate-text-glow neon-text">{accent}</span>}
      </h2>
      {sub && <p className="text-gray-500 mt-3 text-sm">{sub}</p>}
    </div>
  )
}

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function Portfolio() {
  const canvasRef = useRef(null)
  const skillsRef = useRef(null)
  const timelineRef = useRef(null)
  const { dotRef, ringRef, labelRef, bubblesRef } = useCursor()

  const [loading, setLoading] = useState(true)
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [showTop, setShowTop] = useState(false)
  const [openAcc, setOpenAcc] = useState(null)
  const [skillsVis, setSkillsVis] = useState(false)
  const [timelineVis, setTimelineVis] = useState(false)
  const [form, setForm] = useState({ name: '', email: '', subject: '', message: '' })
  const [submitted, setSubmitted] = useState(false)

  const typed = useTypewriter(TYPEWRITER_PHRASES)
  const active = useActiveSection()
  useParticles(canvasRef)
  useScrollReveal()

  const handleLoaderDone = useCallback(() => setLoading(false), [])

  /* Scroll / spotlight */
  useEffect(() => {
    const onScroll = () => { setScrolled(window.scrollY > 30); setShowTop(window.scrollY > 400) }
    const onMove = (e) => {
      document.documentElement.style.setProperty('--mx', e.clientX + 'px')
      document.documentElement.style.setProperty('--my', e.clientY + 'px')
    }
    window.addEventListener('scroll', onScroll)
    window.addEventListener('mousemove', onMove)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('mousemove', onMove) }
  }, [])

  /* Skill bars */
  useEffect(() => {
    const el = skillsRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setSkillsVis(true) }, { threshold: 0.08 })
    obs.observe(el); return () => obs.disconnect()
  }, [])

  /* Education timeline */
  useEffect(() => {
    const el = timelineRef.current; if (!el) return
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setTimelineVis(true) }, { threshold: 0.2 })
    obs.observe(el); return () => obs.disconnect()
  }, [])

  const scrollTo = (id) => { setMenuOpen(false); document.getElementById(id.toLowerCase())?.scrollIntoView({ behavior: 'smooth' }) }

  const downloadResume = () => {
    if (!RESUME_BASE64) { alert('Add your base64 PDF string to RESUME_BASE64 in Portfolio.jsx'); return }
    const a = document.createElement('a'); a.href = RESUME_BASE64; a.download = 'Pranav_S_Handral_Resume.pdf'; a.click()
  }

  const socialLinks = [
    {
      href: 'https://www.linkedin.com/in/pranav-handral-945a71314', label: 'LinkedIn', lbl: 'LI',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>
    },
    {
      href: 'https://github.com/Pranav5092006', label: 'GitHub', lbl: 'GH',
      icon: <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>
    },
    {
      href: 'mailto:pranavhandral39031@gmail.com', label: 'Email', lbl: '@',
      icon: <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
    },
  ]

  return (
    <div className="bg-black text-white font-sans overflow-x-hidden">

      {/* ── Loader ── */}
      {loading && <Loader onDone={handleLoaderDone} />}

      {/* ── Global mouse spotlight layer ── */}
      <div className="spotlight-layer fixed inset-0 z-[9990] pointer-events-none" />

      {/* ── Custom Cursor ── */}
      <div ref={dotRef} className="fixed z-[9999] w-2 h-2 bg-lime-400 rounded-full pointer-events-none"
        style={{ position: 'fixed', transform: 'translate(-50%,-50%)', transition: 'transform 0.15s ease,opacity 0.15s ease' }} />
      <div ref={ringRef} className="fixed z-[9998] rounded-full pointer-events-none border-2 border-lime-400"
        style={{ position: 'fixed', width: '28px', height: '28px', transform: 'translate(-50%,-50%)', opacity: 0.70, transition: 'width 0.25s ease,height 0.25s ease,background 0.25s ease,border-color 0.25s ease' }} />
      <div ref={labelRef} className="fixed z-[9997] pointer-events-none text-[8px] font-mono font-black text-black bg-lime-400 rounded-full flex items-center justify-center leading-none"
        style={{ position: 'fixed', width: '36px', height: '36px', transform: 'translate(-50%,-50%)', opacity: 0, transition: 'opacity 0.2s ease' }} />
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} ref={el => bubblesRef.current[i] = el}
          className="fixed z-[9996] rounded-full bg-lime-400 pointer-events-none"
          style={{ position: 'fixed', transform: 'translate(-50%,-50%)' }} />
      ))}

      {/* ══════════════════════════════════════════════════════════════
          STICKY NAV
      ══════════════════════════════════════════════════════════════ */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-black/92 backdrop-blur-xl border-b border-white/5 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
          <span className="font-mono text-lime-400 font-bold text-xl tracking-tight select-none neon-text">
            PSH<span className="text-white/60">.</span>
          </span>
          <div className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map(l => (
              <button key={l} onClick={() => scrollTo(l)}
                className={`text-sm font-medium transition-all duration-200 hover:text-white pb-0.5
                  ${active === l ? 'text-lime-400 border-b border-lime-400' : 'text-gray-400'}`}>
                {l}
              </button>
            ))}
          </div>
          <button className="md:hidden flex flex-col gap-1.5" onClick={() => setMenuOpen(!menuOpen)} aria-label="Menu">
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-2' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
            <span className={`w-6 h-0.5 bg-white transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-2' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile menu overlay */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-black/97 backdrop-blur-xl flex flex-col items-center justify-center gap-8">
          {NAV_LINKS.map((l, i) => (
            <button key={l} onClick={() => scrollTo(l)}
              style={{ animationDelay: `${i * 0.06}s` }}
              className={`text-4xl font-bold animate-fade-up opacity-0 transition-colors ${active === l ? 'text-lime-400 neon-text' : 'text-white hover:text-lime-400'}`}>
              {l}
            </button>
          ))}
        </div>
      )}

      {/* ══════════════════════════════════════════════════════════════
          HERO
      ══════════════════════════════════════════════════════════════ */}
      <section id="home" className="relative min-h-screen flex items-center overflow-hidden">
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-50" />
        <div className="absolute inset-0 bg-gradient-to-br from-black via-black/85 to-black" />
        <FloatingOrbs />
        <div className="absolute bottom-0 left-0 right-0 h-36 aurora-bar animate-aurora pointer-events-none" />

        {/* Floating code snippet decoration */}
        <div className="hidden xl:block absolute right-16 bottom-36 z-20 animate-float2">
          <div className="bg-zinc-950/95 backdrop-blur-lg border border-lime-400/15 rounded-2xl p-5 font-mono text-xs shadow-2xl shadow-black/60 w-52"
            style={{ boxShadow: '0 0 40px rgba(163,230,53,0.06), 0 20px 60px rgba(0,0,0,0.6)' }}>
            <div className="flex items-center gap-1.5 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-400/80" />
              <div className="w-2.5 h-2.5 rounded-full bg-lime-400/80" />
              <span className="ml-2 text-gray-600 text-[10px]">save_lives.py</span>
            </div>
            <div className="space-y-1.5 leading-relaxed">
              <p><span className="text-purple-400">def </span><span className="text-lime-400">save_lives</span><span className="text-white">():</span></p>
              <p className="pl-3"><span className="text-blue-400">build</span><span className="text-white">(</span><span className="text-orange-400">AI</span><span className="text-white">)</span></p>
              <p className="pl-3"><span className="text-blue-400">deploy</span><span className="text-white">(</span><span className="text-orange-400">IoT</span><span className="text-white">)</span></p>
              <p className="pl-3"><span className="text-blue-400">impact</span><span className="text-white">(</span><span className="text-orange-400">∞</span><span className="text-white">)</span></p>
              <p className="pt-1 text-gray-600"><span className="text-gray-500 mr-1">#</span>→ <span className="text-lime-400">True</span><span className="animate-blink text-lime-400">_</span></p>
            </div>
          </div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 w-full pt-24 pb-20">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            {/* Left */}
            <div>
              {/* Availability LED */}
              <div className="animate-fade-up opacity-0 delay-100 flex items-center gap-3 mb-5">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="animate-ping-dot absolute h-full w-full rounded-full bg-lime-400 opacity-75" />
                  <span className="relative flex h-2.5 w-2.5 rounded-full bg-lime-400" />
                </span>
                <span className="font-mono text-lime-400 text-xs tracking-[0.3em] uppercase">Available for opportunities</span>
              </div>

              <h1 className="animate-fade-up opacity-0 delay-200 text-5xl md:text-7xl font-black leading-tight mb-3">
                Pranav S<br />
                <span className="gradient-text-anim">Handral</span>
              </h1>

              <p className="animate-fade-up opacity-0 delay-300 text-gray-400 text-lg mb-4 font-medium">
                Student · Data Scientist · Founder · Innovator
              </p>
              <p className="animate-fade-up opacity-0 delay-400 text-xl md:text-2xl font-bold text-white/90 mb-8 font-mono min-h-[2.5rem]">
                {typed}<span className="animate-blink text-lime-400">|</span>
              </p>

              {/* CTAs */}
              <div className="animate-fade-up opacity-0 delay-500 flex flex-wrap gap-4 mb-10">
                <button onClick={() => scrollTo('Projects')} data-cursor-label="GO"
                  className="px-7 py-3.5 bg-lime-400 text-black font-bold rounded-lg hover:bg-lime-300 transition-all duration-200 hover:scale-105 active:scale-95"
                  style={{ boxShadow: '0 0 30px rgba(163,230,53,0.35)' }}>
                  View Projects
                </button>
                <button onClick={() => scrollTo('About')}
                  className="px-7 py-3.5 border border-white/20 text-white font-medium rounded-lg hover:border-lime-400 hover:text-lime-400 transition-all duration-200">
                  About Me
                </button>
                <button onClick={downloadResume} data-cursor-label="↓"
                  className="px-7 py-3.5 border border-lime-400/40 text-lime-400 font-medium rounded-lg hover:bg-lime-400/10 flex items-center gap-2 transition-all duration-200">
                  Resume
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>

              {/* Social */}
              <div className="animate-fade-up opacity-0 delay-600 flex items-center gap-4">
                {socialLinks.map(({ href, label, lbl, icon }) => (
                  <a key={label} href={href} target="_blank" rel="noopener noreferrer"
                    aria-label={label} data-cursor-label={lbl}
                    className="w-10 h-10 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center text-gray-500 hover:text-lime-400 hover:border-lime-400/30 hover:bg-lime-400/5 transition-all duration-200">
                    {icon}
                  </a>
                ))}
                <span className="text-gray-700 mx-1">|</span>
                <span className="text-gray-600 text-sm font-mono">📍 Mysore, IN</span>
              </div>
            </div>

            {/* Right: photo + stats */}
            <div className="hidden lg:flex flex-col items-center gap-8">
              <div className="animate-fade-in opacity-0 delay-300 relative">
                <div className="absolute -inset-4 rounded-full border border-dashed border-lime-400/20 animate-spin-slow" />
                <div className="absolute -inset-7 rounded-full border border-dashed border-lime-400/10 animate-spin-rev" />
                <div className="w-64 h-64 rounded-full p-1 bg-gradient-to-br from-lime-400 via-emerald-500 to-teal-600 animate-float"
                  style={{ boxShadow: '0 0 80px rgba(163,230,53,0.30),0 30px 60px rgba(0,0,0,0.5)' }}>
                  <img src={PROFILE_PHOTO_BASE64} alt="Pranav S Handral" className="w-full h-full rounded-full object-cover bg-zinc-900" />
                </div>
                <div className="absolute inset-0 rounded-full border border-lime-400/30" style={{ animation: 'pulse-ring 2.5s ease-out infinite' }} />
                <div className="absolute inset-0 rounded-full border border-lime-400/20" style={{ animation: 'pulse-ring 2.5s ease-out infinite', animationDelay: '0.9s' }} />
              </div>
              <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                {HERO_STATS.map(({ value, label }) => (
                  <div key={label} className="shimmer-card bg-zinc-900/80 border border-white/5 rounded-xl p-4 text-center hover:border-lime-400/30 transition-all duration-300 hover:-translate-y-0.5">
                    <div className="text-3xl font-black text-lime-400 font-mono">{value}</div>
                    <div className="text-xs text-gray-500 mt-1">{label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Mobile photo */}
          <div className="flex lg:hidden justify-center mt-12">
            <div className="w-44 h-44 rounded-full p-1 bg-gradient-to-br from-lime-400 to-emerald-600 animate-float"
              style={{ boxShadow: '0 0 40px rgba(163,230,53,0.22)' }}>
              <img src={PROFILE_PHOTO_BASE64} alt="Pranav S Handral" className="w-full h-full rounded-full object-cover bg-zinc-900" />
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-xs text-gray-600 font-mono">scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-lime-400 to-transparent" />
        </div>
      </section>

      {/* ── Tech Ticker ── */}
      <TechTicker />

      {/* ══════════════════════════════════════════════════════════════
          ABOUT
      ══════════════════════════════════════════════════════════════ */}
      <section id="about" className="py-28 bg-zinc-950 dot-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Get to know me" title="About" accent="Me" />
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <div className="reveal space-y-5 text-gray-400 leading-relaxed">
              <p>Hey! I'm <span className="text-white font-semibold">Pranav S Handral</span>, a second-year B.E. student in Information Science & Engineering at VCE, Mysuru. Driven by a singular mission — <span className="text-lime-400 font-semibold">building technology that saves lives</span>.</p>
              <p>From AI-based surveillance detecting intruders in the dark, to IoT water-level monitors preventing urban flooding — every project I make is rooted in real-world impact.</p>
              <p>Beyond engineering, I'm a <span className="text-white font-medium">founder</span> of three ventures — SafeNest, VidyaTej, and Hydrova — each targeting critical civic and educational problems. 2 patents filed, IIT Bombay podium secured, and leading both NSS and T&P committees.</p>
              <p>I thrive at the intersection of <span className="text-lime-400 font-medium">hardware and intelligence</span> — where embedded systems meets machine learning.</p>
              <div className="flex flex-wrap gap-3 pt-2">
                {['📍 Mysore, India', '📧 pranavhandral39031@gmail.com', '📞 +91-9035262169'].map(t => (
                  <span key={t} className="text-sm bg-zinc-900 border border-white/5 rounded-lg px-3 py-1.5 text-gray-300">{t}</span>
                ))}
              </div>
            </div>
            {/* Count-up stats grid */}
            <div className="reveal grid grid-cols-2 gap-4">
              {ABOUT_STATS.map(({ num, suffix, label, sub }) => (
                <CountStat key={label} num={num} suffix={suffix} label={label} sub={sub} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Second ticker (reverse direction decoration) ── */}
      <div className="relative overflow-hidden py-3 bg-black border-y border-white/3">
        <div className="ticker-fade-l" />
        <div className="ticker-fade-r" />
        <div className="flex gap-16 w-max" style={{ animation: 'ticker 40s linear infinite reverse' }}>
          {[...TICKER_ITEMS.slice(9), ...TICKER_ITEMS, ...TICKER_ITEMS.slice(9)].map((item, i) => (
            <span key={i} className="text-xs font-mono text-white/10 whitespace-nowrap flex items-center gap-2">
              <span className="text-lime-400/20">◇</span>{item}
            </span>
          ))}
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════
          EDUCATION  (timeline)
      ══════════════════════════════════════════════════════════════ */}
      <section id="education" className="py-28 bg-zinc-950 dot-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Academic Journey" title="Education" />
          <div className="relative max-w-3xl" ref={timelineRef}>
            {/* Animated vertical line */}
            <div className="absolute left-5 top-2 w-px overflow-hidden" style={{ height: 'calc(100% - 1rem)' }}>
              <div className={`timeline-line${timelineVis ? ' grown' : ''}`} />
            </div>

            <div className="space-y-8">
              {EDUCATION.map((edu, i) => (
                <div key={i} className="flex gap-6" style={{ transitionDelay: `${i * 0.12}s` }}>
                  {/* Timeline dot */}
                  <div className="relative shrink-0">
                    <div className="w-10 h-10 rounded-full bg-zinc-900 border-2 flex items-center justify-center z-10 transition-all duration-700"
                      style={{
                        borderColor: timelineVis ? '#a3e635' : 'rgba(255,255,255,0.1)',
                        boxShadow: timelineVis ? '0 0 20px rgba(163,230,53,0.3)' : 'none',
                        transitionDelay: `${i * 0.4 + 0.3}s`,
                      }}>
                      <div className="w-3 h-3 rounded-full transition-all duration-700"
                        style={{ background: timelineVis ? '#a3e635' : 'rgba(255,255,255,0.1)', transitionDelay: `${i * 0.4 + 0.5}s` }} />
                    </div>
                  </div>
                  {/* Card */}
                  <div className={`shimmer-card glow-card flex-1 group bg-zinc-900/60 border border-white/5 rounded-2xl p-6 hover:border-lime-400/40 transition-all duration-300 mb-2 reveal${timelineVis ? ' visible' : ''}`}
                    style={{ transitionDelay: `${i * 0.15}s` }}>
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                      <div>
                        <span className="inline-block font-mono text-xs text-lime-400 bg-lime-400/10 px-2 py-0.5 rounded mb-2">{edu.period}</span>
                        <h3 className="text-lg font-bold text-white mb-1">{edu.degree}</h3>
                        <p className="text-gray-400 text-sm">{edu.institution}</p>
                        <p className="text-gray-600 text-xs mt-1">{edu.detail}</p>
                      </div>
                      <div className="shrink-0">
                        <span className="text-3xl font-black font-mono text-lime-400">{edu.score}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          SKILLS  (animated progress bars)
      ══════════════════════════════════════════════════════════════ */}
      <section id="skills" className="py-28 bg-black" ref={skillsRef}>
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Technical Arsenal" title="Skills" sub="Proficiency bars animate on scroll — built from real-world project experience." />
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {SKILLS.map((group, gi) => (
              <div key={group.cat} style={{ transitionDelay: `${gi * 0.07}s` }}
                className="shimmer-card glow-card reveal group bg-zinc-900 border border-white/5 rounded-2xl p-6 hover:border-lime-400/40 hover:bg-zinc-800/40 transition-colors duration-300">
                {/* Category header */}
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="text-xl">{group.emoji}</span>
                  <h3 className="font-mono text-xs text-lime-400 tracking-widest uppercase">{group.cat}</h3>
                </div>
                {/* Skill rows with bars */}
                <div className="space-y-4">
                  {group.items.map((item, ii) => (
                    <div key={item.name}>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">{item.name}</span>
                        <span className="font-mono text-xs text-lime-400/60 tabular-nums">{item.level}%</span>
                      </div>
                      <div className="skill-bar-track">
                        <div className="skill-bar-fill"
                          style={{ width: skillsVis ? `${item.level}%` : '0%', transitionDelay: skillsVis ? `${gi * 0.12 + ii * 0.09}s` : '0s' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          PROJECTS  (3-D tilt + glow)
      ══════════════════════════════════════════════════════════════ */}
      <section id="projects" className="py-28 bg-zinc-950 dot-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Things I've built" title="Projects" />
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {PROJECTS.map((p, i) => (
              <TiltCard key={p.num} style={{ transitionDelay: `${i * 0.09}s` }}
                className="reveal shimmer-card glow-card group bg-zinc-900 border border-white/5 rounded-2xl p-6 flex flex-col hover:border-lime-400/40 transition-colors duration-300">
                <div className="flex items-start justify-between mb-4">
                  <span className="proj-num">{p.num}</span>
                  <span className={`text-xs font-mono px-2.5 py-1 rounded-full border ${p.status === 'In Progress' ? 'border-yellow-400/40 text-yellow-400 bg-yellow-400/10' : 'border-lime-400/30 text-lime-400 bg-lime-400/10'}`}>
                    {p.status}
                  </span>
                </div>
                <p className="font-mono text-xs text-gray-500 uppercase tracking-wider mb-2">{p.cat}</p>
                <h3 className="text-xl font-bold text-lime-400 mb-3 group-hover:text-lime-300 group-hover:neon-text transition-colors">{p.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-5 flex-1">{p.desc}</p>
                <div className="flex flex-wrap gap-2">
                  {p.tags.map(t => (
                    <span key={t} className="text-xs bg-white/5 text-gray-400 px-2.5 py-1 rounded-md border border-white/5 group-hover:border-lime-400/20 group-hover:text-lime-300/70 transition-all duration-200">
                      {t}
                    </span>
                  ))}
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          ACHIEVEMENTS  (accordion)
      ══════════════════════════════════════════════════════════════ */}
      <section id="achievements" className="py-28 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Wins & Recognitions" title="Achievements" />
          <div className="space-y-4 max-w-4xl mx-auto">
            {ACHIEVEMENTS.map((acc, i) => (
              <div key={acc.title} style={{ transitionDelay: `${i * 0.08}s` }}
                className={`shimmer-card reveal bg-zinc-900 border rounded-2xl overflow-hidden transition-all duration-300
                  ${openAcc === i ? 'border-lime-400/30 animate-border-glow' : 'border-white/5 hover:border-white/10'}`}>
                <button className="w-full flex items-center justify-between p-6 text-left"
                  onClick={() => setOpenAcc(openAcc === i ? null : i)}>
                  <div className="flex items-center gap-4">
                    <span className="text-2xl">{acc.icon}</span>
                    <div>
                      <h3 className="font-bold text-white text-lg">{acc.title}</h3>
                      <p className="text-gray-500 text-sm">{acc.subtitle}</p>
                    </div>
                  </div>
                  <span className={`text-lime-400 font-mono text-2xl transition-transform duration-300 ${openAcc === i ? 'rotate-45' : ''}`}>+</span>
                </button>
                {openAcc === i && (
                  <div className="px-6 pb-6 border-t border-white/5">
                    <div className="pt-5 space-y-3">
                      {acc.content.map(item => (
                        <div key={item.label} className="bg-black/50 rounded-xl p-4 border border-lime-400/10 hover:border-lime-400/20 transition-colors">
                          <p className="text-lime-400 font-semibold text-sm mb-2">{item.label}</p>
                          <p className="text-gray-400 text-sm leading-relaxed whitespace-pre-line">{item.detail}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          CONTACT
      ══════════════════════════════════════════════════════════════ */}
      <section id="contact" className="py-28 bg-zinc-950 dot-pattern">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHeading eyebrow="Let's connect" title="Contact" />
          <div className="grid md:grid-cols-2 gap-16">
            {/* Contact links */}
            <div className="reveal space-y-8">
              <p className="text-gray-400 leading-relaxed text-lg">
                Whether you have a project idea, collaboration opportunity, or just want to say hi — my inbox is always open!
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Email', value: 'pranavhandral39031@gmail.com', href: 'mailto:pranavhandral39031@gmail.com', lbl: '@' },
                  { label: 'Phone', value: '+91-9035262169', href: 'tel:+919035262169', lbl: '☎' },
                  { label: 'LinkedIn', value: 'pranav-handral-945a71314', href: 'https://www.linkedin.com/in/pranav-handral-945a71314', lbl: 'LI' },
                  { label: 'GitHub', value: 'Pranav5092006', href: 'https://github.com/Pranav5092006', lbl: 'GH' },
                ].map(({ label, value, href, lbl }) => (
                  <a key={label} href={href}
                    target={href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    data-cursor-label={lbl}
                    className="flex items-center gap-4 group">
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center font-mono text-xs font-bold text-gray-500 group-hover:bg-lime-400/10 group-hover:text-lime-400 group-hover:border-lime-400/30 transition-all duration-200 shrink-0">
                      {lbl}
                    </div>
                    <div>
                      <p className="text-xs text-gray-600 mb-0.5">{label}</p>
                      <p className="text-white text-sm group-hover:text-lime-400 transition-colors duration-200">{value}</p>
                    </div>
                  </a>
                ))}
              </div>
            </div>

            {/* Contact form */}
            <div className="reveal">
              {submitted ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-10 bg-zinc-900/50 border border-lime-400/20 rounded-2xl animate-border-glow">
                  <div className="text-6xl mb-6">✅</div>
                  <h3 className="text-2xl font-bold text-white mb-3 neon-text">Message Sent!</h3>
                  <p className="text-gray-400">Thanks for reaching out. I'll get back to you soon!</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: '', email: '', subject: '', message: '' }) }}
                    className="mt-8 px-6 py-2.5 border border-lime-400/40 text-lime-400 rounded-lg hover:bg-lime-400/10 transition-all text-sm">
                    Send another
                  </button>
                </div>
              ) : (
                <form onSubmit={(e) => { e.preventDefault(); setTimeout(() => setSubmitted(true), 400) }} className="space-y-5">
                  {[
                    { id: 'name', label: 'Name', type: 'text', ph: 'Pranav S Handral' },
                    { id: 'email', label: 'Email', type: 'email', ph: 'you@example.com' },
                    { id: 'subject', label: 'Subject', type: 'text', ph: 'Project collaboration...' },
                  ].map(({ id, label, type, ph }) => (
                    <div key={id}>
                      <label htmlFor={id} className="block text-sm text-gray-400 mb-1.5">{label}</label>
                      <input id={id} type={type} required placeholder={ph}
                        value={form[id]} onChange={e => setForm({ ...form, [id]: e.target.value })}
                        className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all duration-200" />
                    </div>
                  ))}
                  <div>
                    <label htmlFor="message" className="block text-sm text-gray-400 mb-1.5">Message</label>
                    <textarea id="message" required rows={5} placeholder="Tell me about your idea..."
                      value={form.message} onChange={e => setForm({ ...form, message: e.target.value })}
                      className="w-full bg-zinc-900 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-600 text-sm focus:outline-none focus:border-lime-400 focus:shadow-[0_0_20px_rgba(163,230,53,0.1)] transition-all duration-200 resize-none" />
                  </div>
                  <button type="submit" data-cursor-label="SEND"
                    className="w-full bg-lime-400 text-black font-bold py-3.5 rounded-xl hover:bg-lime-300 transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                    style={{ boxShadow: '0 0 30px rgba(163,230,53,0.3)' }}>
                    Send Message
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                    </svg>
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════
          FOOTER
      ══════════════════════════════════════════════════════════════ */}
      <footer className="bg-black border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <span className="font-mono text-xl font-black text-lime-400 select-none neon-text">PSH<span className="text-white/40">.</span></span>
          <div className="flex items-center gap-6">
            {[
              { href: 'https://www.linkedin.com/in/pranav-handral-945a71314', label: 'LinkedIn' },
              { href: 'https://github.com/Pranav5092006', label: 'GitHub' },
              { href: 'mailto:pranavhandral39031@gmail.com', label: 'Email' },
            ].map(({ href, label }) => (
              <a key={label} href={href}
                target={href.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
                className="text-gray-500 hover:text-lime-400 text-sm transition-colors duration-200">
                {label}
              </a>
            ))}
          </div>
          <p className="text-gray-700 text-sm font-mono">© 2025 Pranav S Handral · Built with ❤️</p>
        </div>
      </footer>

      {/* ── Back to top ── */}
      {showTop && (
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
          className="fixed bottom-8 right-8 z-40 w-12 h-12 bg-lime-400 text-black rounded-full flex items-center justify-center hover:bg-lime-300 hover:scale-110 transition-all duration-200 animate-fade-in animate-border-glow"
          style={{ boxShadow: '0 0 28px rgba(163,230,53,0.5)' }}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 15l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  )
}
