export default function AnalysisResult({ analysis }) {
  if (!analysis) return null;

  const score = analysis.atsScore;
  const scoreColor = score >= 75 ? "#4ade80" : score >= 50 ? "#e8ff5a" : "#f87171";
  const scoreLabel = score >= 75 ? "Good shape" : score >= 50 ? "Needs work" : "Needs revision";

  const circumference = 2 * Math.PI * 26;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div style={s.wrap} className="fadeIn">

      {/* Score */}
      <div style={s.scoreBlock}>
        <div style={s.scoreLeft}>
          <p style={s.eye}>ATS Score</p>
          <p style={s.scoreNum}>
            {score}<span style={s.scoreOf}>/100</span>
          </p>
          <p style={{ ...s.scoreTag, color: scoreColor }}>{scoreLabel}</p>
        </div>
        <svg width="68" height="68" style={{ transform: "rotate(-90deg)", flexShrink: 0 }}>
          <circle cx="34" cy="34" r="26" fill="none" stroke="rgba(240,237,230,0.06)" strokeWidth="4" />
          <circle
            cx="34" cy="34" r="26" fill="none"
            stroke={scoreColor} strokeWidth="4"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            style={{ transition: "stroke-dashoffset 1.2s ease" }}
          />
        </svg>
      </div>

      <div style={s.divider} />

      {/* Strengths + Weaknesses */}
      <div style={s.grid2}>
        <ListBlock title="Strengths" items={analysis.strengths} accent="#4ade80" marker="+" />
        <ListBlock title="Weaknesses" items={analysis.weaknesses} accent="#f87171" marker="−" />
      </div>

      <div style={s.divider} />

      {/* Missing Skills */}
      <div>
        <p style={s.eye}>Missing Skills</p>
        <div style={s.tags}>
          {analysis.missingSkills.map((skill, i) => (
            <span key={i} style={s.tag}>{skill}</span>
          ))}
        </div>
      </div>

      <div style={s.divider} />

      {/* Improvements */}
      <div>
        <p style={s.eye}>How to improve</p>
        <div style={s.olWrap}>
          {analysis.improvements.map((item, i) => {
            const clean = item.replace(/\*\*(.*?)\*\*/g, "$1");
            const colonIdx = clean.indexOf(":");
            const title = colonIdx !== -1 ? clean.slice(0, colonIdx).trim() : clean;
            const body = colonIdx !== -1 ? clean.slice(colonIdx + 1).trim() : null;
            return (
              <div key={i} style={s.olItem}>
                <span style={s.olNum}>{String(i + 1).padStart(2, "0")}</span>
                <div>
                  <span style={s.olTitle}>{title}</span>
                  {body && <span style={s.olBody}> — {body}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function ListBlock({ title, items, accent, marker }) {
  return (
    <div style={s.listBlock}>
      <p style={s.eye}>
        <span style={{ color: accent, marginRight: 5 }}>{marker}</span>{title}
      </p>
      {items.map((item, i) => (
        <div key={i} style={s.listItem}>
          <span style={{ ...s.dot, background: accent }} />
          <span style={s.listText}>{item}</span>
        </div>
      ))}
    </div>
  );
}

const s = {
  wrap: {
    fontFamily: "'DM Mono', monospace",
    display: "flex",
    flexDirection: "column",
    gap: 24,
    border: "1px solid rgba(240,237,230,0.08)",
    borderRadius: 16,
    padding: "28px 24px",
    background: "rgba(255,255,255,0.02)",
  },
  scoreBlock: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  scoreLeft: {
    display: "flex",
    flexDirection: "column",
    gap: 5,
  },
  eye: {
    fontSize: 10,
    letterSpacing: "0.16em",
    textTransform: "uppercase",
    color: "rgba(240,237,230,0.28)",
    marginBottom: 6,
  },
  scoreNum: {
    fontSize: 44,
    fontWeight: 500,
    color: "#f0ede6",
    letterSpacing: "-2px",
    lineHeight: 1,
  },
  scoreOf: {
    fontSize: 16,
    fontWeight: 300,
    color: "rgba(240,237,230,0.25)",
    marginLeft: 2,
    letterSpacing: 0,
  },
  scoreTag: {
    fontSize: 10,
    letterSpacing: "0.1em",
    textTransform: "uppercase",
  },
  divider: {
    height: 1,
    background: "rgba(240,237,230,0.06)",
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: 24,
  },
  listBlock: {
    display: "flex",
    flexDirection: "column",
    gap: 0,
  },
  listItem: {
    display: "flex",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: "50%",
    flexShrink: 0,
    marginTop: 5,
  },
  listText: {
    fontSize: 11,
    lineHeight: 1.65,
    color: "rgba(240,237,230,0.5)",
    fontWeight: 300,
  },
  tags: {
    display: "flex",
    flexWrap: "wrap",
    gap: 6,
  },
  tag: {
    fontSize: 10,
    fontFamily: "'DM Mono', monospace",
    padding: "3px 10px",
    border: "1px solid rgba(240,237,230,0.1)",
    borderRadius: 4,
    color: "rgba(240,237,230,0.4)",
    letterSpacing: "0.03em",
  },
  olWrap: {
    display: "flex",
    flexDirection: "column",
    gap: 10,
  },
  olItem: {
    display: "flex",
    gap: 14,
    alignItems: "flex-start",
  },
  olNum: {
    fontSize: 10,
    color: "rgba(240,237,230,0.18)",
    flexShrink: 0,
    paddingTop: 1,
    letterSpacing: "0.05em",
  },
  olTitle: {
    fontSize: 11,
    color: "#f0ede6",
    fontWeight: 500,
  },
  olBody: {
    fontSize: 11,
    color: "rgba(240,237,230,0.42)",
    fontWeight: 300,
  },
};