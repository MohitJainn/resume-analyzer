"use client";
import { useRouter } from "next/navigation";

export default function LandingPage() {
  const router = useRouter();

  return (
    <div style={s.page}>
      <style>{css}</style>

      <header style={s.header}>
        <span style={s.logo}>résumé<span style={s.accent}>.</span></span>
        <div style={s.nav}>
          <button onClick={() => router.push("/Login")} style={s.navBtn} className="navBtn">
            log in
          </button>
          <button onClick={() => router.push("/Signup")} style={s.signupBtn} className="signupBtn">
            get started
          </button>
        </div>
      </header>

      <main style={s.main}>
        <div style={s.eyebrowRow}>
          <span style={s.eyebrow}>ATS · Resume · Analyzer</span>
        </div>

        <h1 style={s.title}>
          Your resume,<br />
          <span style={s.titleMuted}>seen through</span><br />
          the machine.
        </h1>

        <p style={s.subtitle}>
          Upload your PDF. Get an instant AI-powered breakdown of how
          an applicant tracking system reads your resume — and exactly
          how to fix it.
        </p>

        <div style={s.ctas}>
          <button onClick={() => router.push("/Signup")} style={s.ctaPrimary} className="ctaPrimary">
            analyze my resume →
          </button>
          <button onClick={() => router.push("/Login")} style={s.ctaSecondary} className="ctaSecondary">
            log in
          </button>
        </div>

        <div style={s.statsRow}>
          <div style={s.stat}>
            <span style={s.statNum}>98%</span>
            <span style={s.statLabel}>ATS accuracy</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statNum}>~10s</span>
            <span style={s.statLabel}>analysis time</span>
          </div>
          <div style={s.statDivider} />
          <div style={s.stat}>
            <span style={s.statNum}>AI</span>
            <span style={s.statLabel}>powered feedback</span>
          </div>
        </div>
      </main>

      <div style={s.gridOverlay} />

      <footer style={s.footer}>
        <span style={s.footerText}>built to get you hired.</span>
        <span style={s.footerText}>© 2025</span>
      </footer>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0d0d0d; }

  .navBtn:hover {
    color: #f0ede6 !important;
  }

  .signupBtn:hover {
    background: #e8ff5a !important;
    color: #0d0d0d !important;
  }

  .ctaPrimary:hover {
    background: #e8ff5a !important;
    color: #0d0d0d !important;
    transform: translateY(-1px);
  }

  .ctaSecondary:hover {
    border-color: rgba(240,237,230,0.35) !important;
    color: #f0ede6 !important;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @keyframes pulse {
    0%, 100% { opacity: 0.4; }
    50%       { opacity: 0.08; }
  }
`;

const s = {
  page: {
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#f0ede6",
    fontFamily: "'DM Mono', monospace",
    display: "flex",
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
  },
  gridOverlay: {
    position: "fixed",
    inset: 0,
    backgroundImage: `
      linear-gradient(rgba(240,237,230,0.03) 1px, transparent 1px),
      linear-gradient(90deg, rgba(240,237,230,0.03) 1px, transparent 1px)
    `,
    backgroundSize: "60px 60px",
    pointerEvents: "none",
    zIndex: 0,
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "22px 40px",
    borderBottom: "1px solid rgba(240,237,230,0.07)",
    position: "relative",
    zIndex: 1,
  },
  logo: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 20,
    color: "#f0ede6",
    letterSpacing: "-0.5px",
  },
  accent: {
    color: "#e8ff5a",
  },
  nav: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  navBtn: {
    background: "none",
    border: "none",
    color: "rgba(240,237,230,0.4)",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer",
    letterSpacing: "0.04em",
    transition: "color 0.15s ease",
    padding: "6px 4px",
  },
  signupBtn: {
    background: "transparent",
    border: "1px solid rgba(240,237,230,0.18)",
    color: "#f0ede6",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
    cursor: "pointer",
    letterSpacing: "0.04em",
    padding: "7px 16px",
    borderRadius: 6,
    transition: "all 0.15s ease",
  },
  main: {
    flex: 1,
    maxWidth: 720,
    margin: "0 auto",
    padding: "100px 24px 80px",
    display: "flex",
    flexDirection: "column",
    gap: 32,
    position: "relative",
    zIndex: 1,
  },
  eyebrowRow: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  eyebrow: {
    fontSize: 10,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "rgba(240,237,230,0.3)",
    border: "1px solid rgba(240,237,230,0.1)",
    padding: "4px 10px",
    borderRadius: 3,
  },
  title: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "clamp(48px, 8vw, 80px)",
    lineHeight: 1.02,
    color: "#f0ede6",
    letterSpacing: "-2px",
    animation: "fadeUp 0.6s ease both",
  },
  titleMuted: {
    color: "rgba(240,237,230,0.25)",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 13,
    lineHeight: 1.75,
    color: "rgba(240,237,230,0.42)",
    maxWidth: 460,
    fontWeight: 300,
    animation: "fadeUp 0.6s ease 0.1s both",
  },
  ctas: {
    display: "flex",
    alignItems: "center",
    gap: 12,
    animation: "fadeUp 0.6s ease 0.2s both",
  },
  ctaPrimary: {
    background: "#f0ede6",
    color: "#0d0d0d",
    border: "none",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
    fontWeight: 500,
    letterSpacing: "0.04em",
    padding: "12px 22px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  ctaSecondary: {
    background: "transparent",
    color: "rgba(240,237,230,0.4)",
    border: "1px solid rgba(240,237,230,0.12)",
    fontSize: 12,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.04em",
    padding: "12px 22px",
    borderRadius: 6,
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  statsRow: {
    display: "flex",
    alignItems: "center",
    gap: 28,
    paddingTop: 8,
    animation: "fadeUp 0.6s ease 0.3s both",
  },
  stat: {
    display: "flex",
    flexDirection: "column",
    gap: 4,
  },
  statNum: {
    fontSize: 20,
    fontWeight: 500,
    color: "#f0ede6",
    letterSpacing: "-0.5px",
  },
  statLabel: {
    fontSize: 10,
    color: "rgba(240,237,230,0.3)",
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  statDivider: {
    width: 1,
    height: 32,
    background: "rgba(240,237,230,0.08)",
  },
  footer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "18px 40px",
    borderTop: "1px solid rgba(240,237,230,0.07)",
    position: "relative",
    zIndex: 1,
  },
  footerText: {
    fontSize: 10,
    color: "rgba(240,237,230,0.2)",
    letterSpacing: "0.1em",
  },
};