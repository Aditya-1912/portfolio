import { useState, useEffect, useRef } from "react";

// ─── DATA ──────────────────────────────────────────────────────────────────────

const NAV_LINKS = ["About", "Skills", "Projects", "Certifications", "Achievements", "Contact"];

const SKILLS = {
  "Programming Languages": [
    { name: "Python", level: 88 },
    { name: "C++", level: 75 },
    { name: "Java", level: 72 },
  ],
  "Core Skills": [
    { name: "Data Structures & Algorithms", level: 82 },
    { name: "Problem Solving", level: 90 },
    { name: "Mathematical Thinking", level: 85 },
  ],
  Tools: [
    { name: "Git & GitHub", level: 80 },
    { name: "VS Code", level: 92 },
    { name: "Jupyter Notebook", level: 85 },
  ],
};

const INTERESTS = [
  { icon: "🤖", label: "Machine Learning" },
  { icon: "🔒", label: "Cybersecurity (Basics)" },
  { icon: "⚛️", label: "Physics-based Problem Solving" },
];

const PROJECTS = [
  {
    title: "GeoLock System",
    emoji: "🗺️",
    accent: "#00d4ff",
    description:
      "A location-based security system that restricts or grants access based on geographic location. Leverages real-time GPS APIs and Android permissions to enforce geofenced authentication.",
    tech: ["Java", "Android", "APIs", "GPS"],
    github: "#",
  },
  {
    title: "FIFA World Cup Data Analysis",
    emoji: "⚽",
    accent: "#a78bfa",
    description:
      "Performed comprehensive data cleaning and exploratory analysis on the FIFA World Cup historical dataset using Python. Extracted meaningful insights on team performance, goal trends, and match outcomes.",
    tech: ["Python", "Pandas", "NumPy", "Matplotlib"],
    github: "#",
  },
  {
    title: "Tesla Coil Project",
    emoji: "⚡",
    accent: "#34d399",
    description:
      "Designed and built a functional Tesla coil model for a science exhibition, demonstrating wireless energy transfer through resonant inductive coupling — bridging electronics theory with hands-on engineering.",
    tech: ["Electronics", "Physics", "Circuit Design"],
    github: null,
  },
];

const CERTIFICATIONS = [
  {
    title: "Python for Data Science",
    issuer: "IBM / Coursera",
    year: "2024",
    icon: "🐍",
    color: "#00d4ff",
  },
  {
    title: "Introduction to Cybersecurity",
    issuer: "Cisco Networking Academy",
    year: "2024",
    icon: "🔐",
    color: "#a78bfa",
  },
  {
    title: "Data Structures & Algorithms",
    issuer: "GeeksforGeeks / NPTEL",
    year: "2023",
    icon: "🧩",
    color: "#34d399",
  },
];

const ACHIEVEMENTS = [
  { icon: "♟️", title: "1st Prize — Chess Competition", desc: "Secured first place in the inter-collegiate chess championship, demonstrating strategic thinking and composure under pressure." },
  { icon: "⚽", title: "Football Enthusiast", desc: "Active football player — combining team dynamics and tactical gameplay with the same mindset applied to engineering challenges." },
  { icon: "🔬", title: "Science Exhibition Participant", desc: "Participated in multiple science exhibitions and technical events, presenting working models to faculty and industry judges." },
];

// ─── GLOBAL STYLES (injected once) ────────────────────────────────────────────

const GLOBAL_STYLE = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=IBM+Plex+Mono:wght@300;400;500&family=DM+Sans:wght@300;400;500&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  html { scroll-behavior: smooth; }

  :root {
    --bg: #050810;
    --surface: #0c1220;
    --glass: rgba(255,255,255,0.04);
    --border: rgba(255,255,255,0.08);
    --cyan: #00d4ff;
    --purple: #a78bfa;
    --green: #34d399;
    --text: #e2e8f0;
    --muted: #64748b;
    --font-display: 'Syne', sans-serif;
    --font-mono: 'IBM Plex Mono', monospace;
    --font-body: 'DM Sans', sans-serif;
  }
  body.light {
    --bg: #f0f4ff;
    --surface: #ffffff;
    --glass: rgba(0,0,0,0.03);
    --border: rgba(0,0,0,0.08);
    --text: #0f172a;
    --muted: #64748b;
  }

  body {
    background: var(--bg);
    color: var(--text);
    font-family: var(--font-body);
    line-height: 1.7;
    overflow-x: hidden;
    transition: background 0.4s, color 0.4s;
  }

  /* Scrollbar */
  ::-webkit-scrollbar { width: 4px; }
  ::-webkit-scrollbar-track { background: var(--bg); }
  ::-webkit-scrollbar-thumb { background: var(--cyan); border-radius: 2px; }

  /* Grid noise bg */
  .grid-bg {
    background-image:
      linear-gradient(rgba(0,212,255,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(0,212,255,0.03) 1px, transparent 1px);
    background-size: 60px 60px;
  }

  /* Glow text */
  .glow-cyan { text-shadow: 0 0 30px rgba(0,212,255,0.5), 0 0 60px rgba(0,212,255,0.2); }
  .glow-purple { text-shadow: 0 0 30px rgba(167,139,250,0.5); }

  /* Glass card */
  .glass-card {
    background: var(--glass);
    border: 1px solid var(--border);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    border-radius: 16px;
    transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), border-color 0.3s, box-shadow 0.3s;
  }
  .glass-card:hover {
    transform: translateY(-6px);
    border-color: rgba(0,212,255,0.3);
    box-shadow: 0 20px 60px rgba(0,0,0,0.3), 0 0 30px rgba(0,212,255,0.08);
  }

  /* Animated skill bar */
  .skill-bar-fill {
    height: 100%;
    border-radius: 9999px;
    transition: width 1.2s cubic-bezier(0.4,0,0.2,1);
    position: relative;
    overflow: hidden;
  }
  .skill-bar-fill::after {
    content: '';
    position: absolute;
    top: 0; left: -100%; width: 60%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.35), transparent);
    animation: shimmer 2s infinite;
  }
  @keyframes shimmer {
    0% { left: -100%; }
    100% { left: 200%; }
  }

  /* Floating orbs */
  .orb {
    position: absolute;
    border-radius: 50%;
    filter: blur(80px);
    pointer-events: none;
    animation: drift 8s ease-in-out infinite alternate;
  }
  @keyframes drift {
    0% { transform: translate(0, 0) scale(1); }
    100% { transform: translate(30px, -20px) scale(1.05); }
  }

  /* Typewriter cursor */
  .cursor-blink::after {
    content: '|';
    animation: blink 1s step-end infinite;
    color: var(--cyan);
  }
  @keyframes blink {
    50% { opacity: 0; }
  }

  /* Nav active dot */
  .nav-link { position: relative; }
  .nav-link::after {
    content: '';
    position: absolute;
    bottom: -4px; left: 50%;
    width: 0; height: 2px;
    background: var(--cyan);
    border-radius: 1px;
    transition: width 0.3s, left 0.3s;
    transform: translateX(-50%);
  }
  .nav-link:hover::after { width: 100%; left: 50%; }

  /* Fade-up reveal */
  .reveal {
    opacity: 0;
    transform: translateY(30px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .reveal.visible {
    opacity: 1;
    transform: translateY(0);
  }

  /* Button gradient */
  .btn-primary {
    background: linear-gradient(135deg, var(--cyan), #0070ff);
    color: #000;
    font-weight: 700;
    font-family: var(--font-display);
    letter-spacing: 0.05em;
    border: none;
    cursor: pointer;
    padding: 14px 32px;
    border-radius: 8px;
    transition: transform 0.2s, box-shadow 0.2s;
    font-size: 0.9rem;
  }
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 30px rgba(0,212,255,0.4);
  }
  .btn-outline {
    background: transparent;
    border: 1px solid rgba(0,212,255,0.4);
    color: var(--cyan);
    font-weight: 600;
    font-family: var(--font-display);
    cursor: pointer;
    padding: 13px 28px;
    border-radius: 8px;
    transition: all 0.2s;
    font-size: 0.9rem;
  }
  .btn-outline:hover {
    background: rgba(0,212,255,0.08);
    border-color: var(--cyan);
    box-shadow: 0 0 20px rgba(0,212,255,0.2);
  }

  /* Hero gradient text */
  .gradient-text {
    background: linear-gradient(135deg, var(--cyan) 0%, var(--purple) 60%, #ff6b9d 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  /* Section title underline */
  .section-title::after {
    content: '';
    display: block;
    width: 60px;
    height: 3px;
    background: linear-gradient(90deg, var(--cyan), var(--purple));
    border-radius: 2px;
    margin: 12px auto 0;
  }

  /* Tag chip */
  .chip {
    display: inline-block;
    padding: 3px 12px;
    border-radius: 999px;
    font-family: var(--font-mono);
    font-size: 0.72rem;
    border: 1px solid;
    letter-spacing: 0.04em;
  }

  /* Contact input */
  .contact-input {
    width: 100%;
    background: var(--glass);
    border: 1px solid var(--border);
    border-radius: 8px;
    padding: 14px 18px;
    color: var(--text);
    font-family: var(--font-body);
    font-size: 0.95rem;
    transition: border-color 0.2s, box-shadow 0.2s;
    outline: none;
    resize: none;
  }
  .contact-input:focus {
    border-color: rgba(0,212,255,0.5);
    box-shadow: 0 0 0 3px rgba(0,212,255,0.08);
  }
  .contact-input::placeholder { color: var(--muted); }

  /* Project card accent border */
  .project-card {
    position: relative;
    overflow: hidden;
  }
  .project-card::before {
    content: '';
    position: absolute;
    top: 0; left: 0; right: 0;
    height: 2px;
    background: var(--accent-color, var(--cyan));
    opacity: 0.7;
    transition: opacity 0.3s;
  }
  .project-card:hover::before { opacity: 1; }

  /* Toggle switch */
  .toggle-track {
    width: 46px; height: 24px;
    border-radius: 12px;
    position: relative;
    cursor: pointer;
    transition: background 0.3s;
  }
  .toggle-thumb {
    position: absolute;
    top: 3px; left: 3px;
    width: 18px; height: 18px;
    border-radius: 50%;
    background: white;
    transition: transform 0.3s;
    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
  }

  /* Cert card icon */
  .cert-icon-wrap {
    width: 52px; height: 52px;
    border-radius: 12px;
    display: flex; align-items: center; justify-content: center;
    font-size: 1.5rem;
    flex-shrink: 0;
  }

  /* Mobile menu */
  @media (max-width: 768px) {
    .mobile-menu {
      position: fixed;
      top: 0; right: 0;
      width: 75vw; height: 100vh;
      background: var(--surface);
      border-left: 1px solid var(--border);
      z-index: 200;
      display: flex; flex-direction: column;
      padding: 80px 32px 32px;
      gap: 24px;
      transform: translateX(100%);
      transition: transform 0.3s cubic-bezier(0.4,0,0.2,1);
    }
    .mobile-menu.open { transform: translateX(0); }
  }
`;

// ─── HOOKS ────────────────────────────────────────────────────────────────────

function useIntersection(ref, threshold = 0.15) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return visible;
}

// ─── COMPONENTS ───────────────────────────────────────────────────────────────

/* Inject global styles */
function GlobalStyles() {
  useEffect(() => {
    const el = document.createElement("style");
    el.textContent = GLOBAL_STYLE;
    document.head.appendChild(el);
    return () => document.head.removeChild(el);
  }, []);
  return null;
}

/* Sticky nav */
function Navbar({ dark, setDark }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navStyle = {
    position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
    padding: "0 5%",
    height: "68px",
    display: "flex", alignItems: "center", justifyContent: "space-between",
    background: scrolled ? "rgba(5,8,16,0.85)" : "transparent",
    backdropFilter: scrolled ? "blur(20px)" : "none",
    borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "none",
    transition: "all 0.3s",
  };

  return (
    <>
      <nav style={navStyle}>
        {/* Logo */}
        <a href="#home" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", textDecoration: "none", color: "var(--text)" }}>
          AS<span style={{ color: "var(--cyan)" }}>.</span>
        </a>

        {/* Desktop links */}
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }} className="desktop-nav">
          {NAV_LINKS.map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} className="nav-link"
              style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", letterSpacing: "0.08em", textDecoration: "none", color: "var(--muted)", transition: "color 0.2s" }}
              onMouseEnter={e => e.target.style.color = "var(--cyan)"}
              onMouseLeave={e => e.target.style.color = "var(--muted)"}
            >{l}</a>
          ))}
          {/* Toggle */}
          <button onClick={() => setDark(!dark)} aria-label="Toggle theme"
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "var(--muted)", fontSize: "1rem" }}>
            {dark ? "☀️" : "🌙"}
          </button>
        </div>

        {/* Hamburger */}
        <button onClick={() => setMobileOpen(o => !o)}
          style={{ display: "none", background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--text)" }}
          className="hamburger">☰</button>
      </nav>

      {/* Mobile menu */}
      <div className={`mobile-menu ${mobileOpen ? "open" : ""}`}>
        <button onClick={() => setMobileOpen(false)}
          style={{ position: "absolute", top: 20, right: 20, background: "none", border: "none", cursor: "pointer", fontSize: "1.4rem", color: "var(--muted)" }}>✕</button>
        {NAV_LINKS.map(l => (
          <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
            style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, color: "var(--text)", textDecoration: "none" }}>
            {l}
          </a>
        ))}
        <button onClick={() => { setDark(!dark); setMobileOpen(false); }}
          style={{ background: "none", border: "none", cursor: "pointer", fontSize: "1.1rem", color: "var(--muted)", textAlign: "left" }}>
          {dark ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </div>

      {/* Responsive style injection */}
      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
          .hamburger { display: block !important; }
        }
      `}</style>
    </>
  );
}

/* Hero section */
function Hero() {
  const [typed, setTyped] = useState("");
  const phrases = ["ML Engineer", "Data Analyst", "Problem Solver", "Tech Enthusiast"];
  const phraseIdx = useRef(0);
  const charIdx = useRef(0);
  const deleting = useRef(false);

  useEffect(() => {
    let timer;
    function tick() {
      const phrase = phrases[phraseIdx.current];
      if (!deleting.current) {
        setTyped(phrase.slice(0, charIdx.current + 1));
        charIdx.current++;
        if (charIdx.current === phrase.length) {
          deleting.current = true;
          timer = setTimeout(tick, 1800);
          return;
        }
      } else {
        setTyped(phrase.slice(0, charIdx.current - 1));
        charIdx.current--;
        if (charIdx.current === 0) {
          deleting.current = false;
          phraseIdx.current = (phraseIdx.current + 1) % phrases.length;
        }
      }
      timer = setTimeout(tick, deleting.current ? 60 : 90);
    }
    timer = setTimeout(tick, 500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <section id="home" className="grid-bg" style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", position: "relative", overflow: "hidden", padding: "100px 5% 60px" }}>
      {/* Floating orbs */}
      <div className="orb" style={{ width: 400, height: 400, background: "rgba(0,212,255,0.12)", top: "10%", left: "5%" }} />
      <div className="orb" style={{ width: 300, height: 300, background: "rgba(167,139,250,0.1)", bottom: "15%", right: "8%", animationDelay: "-4s" }} />
      <div className="orb" style={{ width: 200, height: 200, background: "rgba(52,211,153,0.08)", top: "50%", left: "40%", animationDelay: "-2s" }} />

      <div style={{ textAlign: "center", maxWidth: 800, position: "relative", zIndex: 1 }}>
        {/* Badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 28,
          background: "rgba(0,212,255,0.08)", border: "1px solid rgba(0,212,255,0.2)",
          padding: "8px 20px", borderRadius: 999,
          fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--cyan)",
          letterSpacing: "0.1em",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--cyan)", animation: "blink 1s step-end infinite", display: "inline-block" }} />
          AVAILABLE FOR INTERNSHIPS · CGPA 9.5
        </div>

        {/* Name */}
        <h1 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2.8rem,8vw,6rem)", lineHeight: 1.05, marginBottom: 16 }}>
          Aditya<br />
          <span className="gradient-text glow-cyan">Satpute</span>
        </h1>

        {/* Typewriter */}
        <p style={{ fontFamily: "var(--font-mono)", fontSize: "clamp(1rem,2.5vw,1.35rem)", color: "var(--cyan)", marginBottom: 20, height: "2.2em", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <span className="cursor-blink">{typed}</span>
        </p>

        {/* Location */}
        <p style={{ color: "var(--muted)", fontFamily: "var(--font-mono)", fontSize: "0.82rem", marginBottom: 40, letterSpacing: "0.06em" }}>
          📍 Mumbai, India
        </p>

        {/* CTAs */}
        <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
          <button className="btn-primary" onClick={() => document.getElementById("projects").scrollIntoView({ behavior: "smooth" })}>
            View Projects →
          </button>
          <button className="btn-outline" onClick={() => {
            const a = document.createElement("a");
            a.href = "#"; a.download = "Aditya_Satpute_Resume.pdf"; a.click();
          }}>
            ⬇ Download CV
          </button>
        </div>

        {/* Scroll indicator */}
        <div style={{ marginTop: 70, animation: "drift 2s ease-in-out infinite alternate", color: "var(--muted)", fontSize: "0.78rem", fontFamily: "var(--font-mono)", letterSpacing: "0.1em" }}>
          ↓ scroll to explore
        </div>
      </div>
    </section>
  );
}

/* About section */
function About() {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <section id="about" ref={ref} style={{ padding: "100px 5%" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }} className={`reveal ${visible ? "visible" : ""}`}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)", fontSize: "0.78rem", letterSpacing: "0.15em", marginBottom: 12 }}>01 / ABOUT ME</p>
        <h2 className="section-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 48, textAlign: "center" }}>
          The Mind Behind The Code
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 48, alignItems: "center" }}>
          {/* Text */}
          <div className="glass-card" style={{ padding: "36px 40px" }}>
            <p style={{ color: "var(--muted)", lineHeight: 1.9, fontSize: "1rem" }}>
              I'm <strong style={{ color: "var(--text)" }}>Aditya Satpute</strong>, a passionate Information Technology engineering student with a strong flair for problem-solving and a deep curiosity for mathematics and physics. I thrive on tackling complex challenges and engineering efficient, elegant solutions through code.
            </p>
            <p style={{ color: "var(--muted)", lineHeight: 1.9, fontSize: "1rem", marginTop: 18 }}>
              My core interests lie at the intersection of <span style={{ color: "var(--cyan)" }}>machine learning</span>, <span style={{ color: "var(--purple)" }}>software development</span>, and foundational <span style={{ color: "var(--green)" }}>cybersecurity concepts</span>. With a disciplined mindset and relentless curiosity, I'm building toward a career in advanced technology — with aspirations for higher research and global-scale impact.
            </p>
          </div>

          {/* Stats grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
            {[
              { val: "9.5", label: "CGPA", color: "var(--cyan)" },
              { val: "3+", label: "Projects Built", color: "var(--purple)" },
              { val: "3+", label: "Certifications", color: "var(--green)" },
              { val: "∞", label: "Curiosity Level", color: "#ff6b9d" },
            ].map(s => (
              <div key={s.label} className="glass-card" style={{ padding: "28px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "2.4rem", color: s.color }}>{s.val}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", letterSpacing: "0.08em", marginTop: 6 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <style>{`@media(max-width:768px){ #about .reveal > div:last-child { grid-template-columns: 1fr !important; } }`}</style>
    </section>
  );
}

/* Individual skill bar */
function SkillBar({ name, level, delay, visible }) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    if (visible) {
      const t = setTimeout(() => setWidth(level), delay);
      return () => clearTimeout(t);
    }
  }, [visible]);

  return (
    <div style={{ marginBottom: 18 }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 7 }}>
        <span style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--text)", fontWeight: 500 }}>{name}</span>
        <span style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--cyan)" }}>{level}%</span>
      </div>
      <div style={{ height: 6, background: "rgba(255,255,255,0.06)", borderRadius: 999 }}>
        <div className="skill-bar-fill" style={{
          width: `${width}%`,
          background: "linear-gradient(90deg, var(--cyan), var(--purple))",
        }} />
      </div>
    </div>
  );
}

/* Skills section */
function Skills() {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <section id="skills" ref={ref} style={{ padding: "100px 5%", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--purple)", fontSize: "0.78rem", letterSpacing: "0.15em", marginBottom: 12, textAlign: "center" }}>02 / SKILLS</p>
        <h2 className="section-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 56, textAlign: "center" }}>
          Technical Arsenal
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {Object.entries(SKILLS).map(([cat, skills], ci) => (
            <div key={cat} className={`glass-card reveal ${visible ? "visible" : ""}`} style={{ padding: "32px 28px", transitionDelay: `${ci * 0.12}s` }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", marginBottom: 24, color: ["var(--cyan)", "var(--purple)", "var(--green)"][ci] }}>
                {["⚙️", "🧠", "🛠"][ci]} {cat}
              </h3>
              {skills.map((s, i) => <SkillBar key={s.name} {...s} delay={ci * 150 + i * 100} visible={visible} />)}
            </div>
          ))}
        </div>

        {/* Interests */}
        <div style={{ marginTop: 40, display: "flex", gap: 16, flexWrap: "wrap", justifyContent: "center" }}>
          {INTERESTS.map(i => (
            <div key={i.label} style={{
              display: "flex", alignItems: "center", gap: 10,
              background: "var(--glass)", border: "1px solid var(--border)", borderRadius: 12,
              padding: "12px 22px", fontFamily: "var(--font-body)", fontSize: "0.9rem",
              transition: "border-color 0.2s",
            }}
              onMouseEnter={e => e.currentTarget.style.borderColor = "rgba(0,212,255,0.3)"}
              onMouseLeave={e => e.currentTarget.style.borderColor = "var(--border)"}
            >
              <span style={{ fontSize: "1.2rem" }}>{i.icon}</span>
              <span style={{ color: "var(--muted)" }}>{i.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Projects section */
function Projects() {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <section id="projects" ref={ref} style={{ padding: "100px 5%" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--green)", fontSize: "0.78rem", letterSpacing: "0.15em", marginBottom: 12, textAlign: "center" }}>03 / PROJECTS</p>
        <h2 className="section-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 56, textAlign: "center" }}>
          Things I've Built
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
          {PROJECTS.map((p, i) => (
            <div key={p.title}
              className={`glass-card project-card reveal ${visible ? "visible" : ""}`}
              style={{ padding: "32px 28px", transitionDelay: `${i * 0.15}s`, "--accent-color": p.accent, cursor: "default" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: 16 }}>{p.emoji}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.25rem", marginBottom: 12, color: p.accent }}>
                {p.title}
              </h3>
              <p style={{ color: "var(--muted)", fontSize: "0.9rem", lineHeight: 1.75, marginBottom: 20 }}>
                {p.description}
              </p>
              {/* Tech chips */}
              <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: 24 }}>
                {p.tech.map(t => (
                  <span key={t} className="chip" style={{ borderColor: `${p.accent}44`, color: p.accent, background: `${p.accent}10` }}>
                    {t}
                  </span>
                ))}
              </div>
              {p.github && (
                <a href={p.github} style={{ fontFamily: "var(--font-mono)", fontSize: "0.8rem", color: "var(--muted)", textDecoration: "none", display: "inline-flex", alignItems: "center", gap: 6, transition: "color 0.2s" }}
                  onMouseEnter={e => e.currentTarget.style.color = p.accent}
                  onMouseLeave={e => e.currentTarget.style.color = "var(--muted)"}>
                  ⎘ View on GitHub →
                </a>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Certifications */
function Certifications() {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <section id="certifications" ref={ref} style={{ padding: "100px 5%", background: "rgba(255,255,255,0.01)" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--cyan)", fontSize: "0.78rem", letterSpacing: "0.15em", marginBottom: 12, textAlign: "center" }}>04 / CERTIFICATIONS</p>
        <h2 className="section-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 56, textAlign: "center" }}>
          Credentials
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: 18, maxWidth: 700, margin: "0 auto" }}>
          {CERTIFICATIONS.map((c, i) => (
            <div key={c.title}
              className={`glass-card reveal ${visible ? "visible" : ""}`}
              style={{ padding: "24px 28px", display: "flex", alignItems: "center", gap: 20, transitionDelay: `${i * 0.1}s` }}>
              <div className="cert-icon-wrap" style={{ background: `${c.color}15`, border: `1px solid ${c.color}40` }}>
                {c.icon}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", color: c.color }}>{c.title}</div>
                <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.75rem", color: "var(--muted)", marginTop: 4 }}>{c.issuer}</div>
              </div>
              <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--muted)", background: "rgba(255,255,255,0.04)", padding: "4px 12px", borderRadius: 6 }}>{c.year}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Achievements */
function Achievements() {
  const ref = useRef(null);
  const visible = useIntersection(ref);

  return (
    <section id="achievements" ref={ref} style={{ padding: "100px 5%" }}>
      <div style={{ maxWidth: 1100, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--purple)", fontSize: "0.78rem", letterSpacing: "0.15em", marginBottom: 12, textAlign: "center" }}>05 / ACHIEVEMENTS</p>
        <h2 className="section-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 56, textAlign: "center" }}>
          Beyond The Code
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 24 }}>
          {ACHIEVEMENTS.map((a, i) => (
            <div key={a.title}
              className={`glass-card reveal ${visible ? "visible" : ""}`}
              style={{ padding: "32px 28px", textAlign: "center", transitionDelay: `${i * 0.12}s` }}>
              <div style={{ fontSize: "3rem", marginBottom: 16 }}>{a.icon}</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.05rem", color: "var(--text)", marginBottom: 12 }}>{a.title}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.88rem", lineHeight: 1.7 }}>{a.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* Contact */
function Contact() {
  const ref = useRef(null);
  const visible = useIntersection(ref);
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" ref={ref} style={{ padding: "100px 5% 60px" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <p style={{ fontFamily: "var(--font-mono)", color: "var(--green)", fontSize: "0.78rem", letterSpacing: "0.15em", marginBottom: 12, textAlign: "center" }}>06 / CONTACT</p>
        <h2 className="section-title" style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(2rem,4vw,3rem)", marginBottom: 16, textAlign: "center" }}>
          Let's Connect
        </h2>
        <p style={{ color: "var(--muted)", textAlign: "center", marginBottom: 56, fontSize: "1rem" }}>
          Open to internships, research collaborations, and exciting opportunities.
        </p>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 32 }} className={`reveal ${visible ? "visible" : ""}`}>
          {/* Info */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            {[
              { icon: "✉️", label: "Email", val: "antarikshayewatkar@gmail.com", href: "mailto:antarikshayewatkar@gmail.com" },
              { icon: "💻", label: "GitHub", val: "github.com/aditya-satpute", href: "#" },
              { icon: "🔗", label: "LinkedIn", val: "linkedin.com/in/aditya-satpute", href: "#" },
            ].map(c => (
              <a key={c.label} href={c.href}
                className="glass-card"
                style={{ padding: "20px 24px", display: "flex", alignItems: "center", gap: 16, textDecoration: "none", color: "inherit" }}>
                <span style={{ fontSize: "1.4rem" }}>{c.icon}</span>
                <div>
                  <div style={{ fontFamily: "var(--font-mono)", fontSize: "0.72rem", color: "var(--muted)", letterSpacing: "0.1em" }}>{c.label}</div>
                  <div style={{ fontFamily: "var(--font-body)", fontSize: "0.88rem", color: "var(--cyan)", marginTop: 2 }}>{c.val}</div>
                </div>
              </a>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="glass-card" style={{ padding: "32px 28px", display: "flex", flexDirection: "column", gap: 16 }}>
            <input className="contact-input" placeholder="Your Name" required style={{ background: "var(--glass)", border: "1px solid var(--border)" }} />
            <input className="contact-input" type="email" placeholder="Your Email" required style={{ background: "var(--glass)", border: "1px solid var(--border)" }} />
            <textarea className="contact-input" rows={4} placeholder="Your Message" required style={{ background: "var(--glass)", border: "1px solid var(--border)" }} />
            <button type="submit" className="btn-primary" style={{ marginTop: 4 }}>
              {sent ? "✓ Message Sent!" : "Send Message →"}
            </button>
          </form>
        </div>

        {/* Footer */}
        <div style={{ textAlign: "center", marginTop: 80, paddingTop: 32, borderTop: "1px solid var(--border)" }}>
          <p style={{ fontFamily: "var(--font-mono)", fontSize: "0.78rem", color: "var(--muted)" }}>
            Crafted with <span style={{ color: "#ff6b9d" }}>♥</span> by Aditya Satpute · {new Date().getFullYear()}
          </p>
        </div>
      </div>
      <style>{`@media(max-width:768px){ #contact .reveal > div { grid-template-columns:1fr !important; } }`}</style>
    </section>
  );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────

export default function App() {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.body.className = dark ? "" : "light";
  }, [dark]);

  return (
    <>
      <GlobalStyles />
      <Navbar dark={dark} setDark={setDark} />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Certifications />
        <Achievements />
        <Contact />
      </main>
    </>
  );
}
