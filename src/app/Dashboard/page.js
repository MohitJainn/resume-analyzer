"use client";
import AnalysisResult from "../componenets/AnalysisResult";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import jsPDF from "jspdf";
import {
  LineChart, Line, XAxis, YAxis,
  Tooltip, ResponsiveContainer,
} from "recharts";
import { signOut } from "next-auth/react";
export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/Login");
  }, [status, router]);

  useEffect(() => { fetchHistory(); }, []);

  if (status === "loading") {
    return <div style={s.loadingScreen}><div style={s.loadingDot} /></div>;
  }

  async function fetchHistory() {
    const res = await fetch("/api/history");
    const data = await res.json();
    setHistory(data);
  }

  const validScores = history.map((r) => r.analysis?.atsScore).filter((s) => s > 0);
  const currentScore = validScores.at(-1) ?? 0;
  const bestScore = validScores.length ? Math.max(...validScores) : 0;
  const averageScore = validScores.length
    ? Math.round(validScores.reduce((a, b) => a + b, 0) / validScores.length) : 0;

  const graphData = [...history].reverse().map((r) => ({
    date: new Date(r.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short" }),
    score: r.analysis?.atsScore || 0,
  }));

  async function handleupload(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);
    const formData = new FormData();
    formData.append("resume", file);
    const res = await fetch("/api/upload-resume", { method: "POST", body: formData });
    const data = await res.json();
    setAnalysis(data.analysis);
    await fetchHistory();
    setLoading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }

  function downloadPDF() {
    const doc = new jsPDF();
    const margin = 20;
    const maxWidth = doc.internal.pageSize.getWidth() - margin * 2;
    let y = 20;

    function addLine(text, size = 11, bold = false) {
      doc.setFontSize(size);
      doc.setFont("helvetica", bold ? "bold" : "normal");
      doc.splitTextToSize(text, maxWidth).forEach((line) => {
        if (y > 270) { doc.addPage(); y = 20; }
        doc.text(line, margin, y);
        y += size * 0.5;
      });
      y += 2;
    }

    function addSection(title, items) {
      y += 4;
      addLine(title, 12, true);
      items.forEach((item, i) => addLine(`${i + 1}. ${item.replace(/\*\*(.*?)\*\*/g, "$1")}`, 10));
    }

    addLine("Resume Analysis Report", 18, true);
    y += 4;
    addLine(`ATS Score: ${analysis.atsScore} / 100`, 13, true);
    y += 4;
    addSection("Strengths", analysis.strengths);
    addSection("Weaknesses", analysis.weaknesses);
    addSection("Missing Skills", analysis.missingSkills);
    addSection("Improvements", analysis.improvements);
    doc.save("resume-analysis.pdf");
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={s.tooltip}>
        <p style={s.tooltipLabel}>{label}</p>
        <p style={s.tooltipScore}>{payload[0].value}<span style={s.tooltipOf}>/100</span></p>
      </div>
    );
  };

  return (
    <div style={s.page}>
      <style>{css}</style>
<header style={s.header}>
  <span style={s.logo}>ats<span style={s.logoSlash}>/</span>check</span>
  <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
    <span style={s.headerRight}>resume analyzer</span>
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      style={s.logoutBtn}
      className="logoutBtn"
    >
      logout
    </button>
  </div>
</header>

      <main style={s.main}>

        <div style={s.hero}>
          <h1 style={s.title}>your resume,<br /><span style={s.titleDim}>through the machine.</span></h1>
          <p style={s.subtitle}>upload a pdf. get a breakdown. fix what's wrong.</p>
        </div>

        {history.length > 0 && (
          <div style={s.graphCard}>
            <p style={s.eyebrow}>score over time</p>
            <div style={s.statsRow}>
              <StatBox label="last" value={currentScore} />
              <StatBox label="best" value={bestScore} highlight />
              <StatBox label="avg" value={averageScore} />
            </div>
            <div style={{ height: 160, marginTop: 24 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={graphData}>
                  <XAxis dataKey="date" tick={{ fill: "#9a8f82", fontSize: 9, fontFamily: "Lora, serif" }} axisLine={false} tickLine={false} />
                  <YAxis domain={[0, 100]} tick={{ fill: "#9a8f82", fontSize: 9, fontFamily: "Lora, serif" }} axisLine={false} tickLine={false} width={24} />
                  <Tooltip content={<CustomTooltip />} />
                  <Line type="monotone" dataKey="score" stroke="#c8a96e" strokeWidth={1.5}
                    dot={{ fill: "#c8a96e", r: 3, strokeWidth: 0 }}
                    activeDot={{ r: 4, fill: "#c8a96e" }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        <form onSubmit={handleupload} style={s.uploadCard}>
          <div
            style={{ ...s.dropzone, ...(dragOver ? s.dropzoneActive : {}), ...(file ? s.dropzoneFilled : {}) }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input id="fileInput" type="file" accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])} />
            {file ? (
              <div style={s.fileInfo}>
                <span style={s.fileIcon}>▪</span>
                <span style={s.fileName}>{file.name}</span>
                <span style={s.fileSize}>{(file.size / 1024).toFixed(1)} kb</span>
              </div>
            ) : (
              <div style={s.dropPrompt}>
                <p style={s.dropText}>drop pdf here or click to browse</p>
              </div>
            )}
          </div>

          <button type="submit" disabled={!file || loading}
            style={{ ...s.btn, ...(!file || loading ? s.btnDisabled : {}) }}
            className="mainBtn">
            {loading
              ? <span style={s.btnInner}><span className="spinner" />analyzing...</span>
              : <span style={s.btnInner}>run analysis</span>}
          </button>
        </form>

        {analysis && (
          <>
            <AnalysisResult analysis={analysis} />
            <button onClick={downloadPDF} style={s.btn} className="mainBtn">
              <span style={s.btnInner}>download report</span>
            </button>
          </>
        )}

        {history.length > 0 && (
          <div style={s.historyWrap}>
            <p style={s.eyebrow}>history</p>
            {history.map((resume) => (
              <div key={resume._id} style={s.historyRow}>
                <div style={s.historyMeta}>
                  <span style={s.historyName}>{resume.fileName}</span>
                  <span style={s.historyDate}>
                    {new Date(resume.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
                <div style={s.historyActions}>
                  <span style={s.historyScore}>{resume.analysis?.atsScore ?? "—"}</span>
                  <button onClick={() => setAnalysis(resume.analysis)} style={s.viewBtn} className="viewBtn">
                    view
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

      </main>
    </div>
  );
}

function StatBox({ label, value, highlight }) {
  return (
    <div style={s.statBox}>
      <span style={s.statLabel}>{label}</span>
      <span style={{ ...s.statValue, ...(highlight ? { color: "#c8a96e" } : {}) }}>{value}</span>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Lora:ital,wght@0,400;0,500;1,400&family=DM+Mono:wght@300;400&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #1c1814; }

  .mainBtn:hover:not(:disabled) {
    background: #c8a96e !important;
    color: #1c1814 !important;
    border-color: #c8a96e !important;
  }

  .viewBtn:hover { color: #c8a96e !important; }

  @keyframes spin { to { transform: rotate(360deg); } }
  .spinner {
    display: inline-block; width: 11px; height: 11px;
    border: 1.5px solid rgba(210,200,185,0.2);
    border-top-color: #d2c8b9;
    border-radius: 50%;
    animation: spin 0.8s linear infinite;
    margin-right: 8px; vertical-align: middle;
  }

  @keyframes pulse {
    0%, 100% { opacity: 1; } 50% { opacity: 0.2; }
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .fadeIn { animation: fadeUp 0.4s ease forwards; }
.logoutBtn:hover {
  border-color: rgba(210,200,185,0.3) !important;
  color: #d2c8b9 !important;
}
  `;

const s = {
  logoutBtn: {
  background: "none",
  border: "1px solid rgba(210,200,185,0.12)",
  color: "rgba(210,200,185,0.35)",
  fontSize: 10,
  fontFamily: "'DM Mono', monospace",
  letterSpacing: "0.08em",
  padding: "5px 12px",
  borderRadius: 5,
  cursor: "pointer",
  transition: "all 0.15s ease",
},
  page: {
    minHeight: "100vh",
    background: "#1c1814",
    color: "#d2c8b9",
    fontFamily: "'DM Mono', monospace",
  },
  loadingScreen: {
    minHeight: "100vh",
    background: "#1c1814",
    display: "flex", alignItems: "center", justifyContent: "center",
  },
  loadingDot: {
    width: 7, height: 7, borderRadius: "50%",
    background: "#c8a96e",
    animation: "pulse 1.2s ease infinite",
  },
  header: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "18px 32px",
    borderBottom: "1px solid rgba(210,200,185,0.07)",
  },
  logo: {
    fontFamily: "'Lora', serif",
    fontSize: 15,
    color: "#d2c8b9",
    letterSpacing: "0.01em",
  },
  logoSlash: { color: "rgba(210,200,185,0.25)", margin: "0 1px" },
  headerRight: {
    fontSize: 10, letterSpacing: "0.14em",
    textTransform: "uppercase",
    color: "rgba(210,200,185,0.22)",
  },
  main: {
    maxWidth: 600,
    margin: "0 auto",
    padding: "64px 24px 80px",
    display: "flex", flexDirection: "column", gap: 36,
  },
  hero: { display: "flex", flexDirection: "column", gap: 12 },
  title: {
    fontFamily: "'Lora', serif",
    fontSize: "clamp(30px, 5vw, 44px)",
    lineHeight: 1.15,
    color: "#d2c8b9",
    letterSpacing: "-0.3px",
    fontWeight: 400,
  },
  titleDim: {
    color: "rgba(210,200,185,0.35)",
    fontStyle: "italic",
  },
  subtitle: {
    fontSize: 12,
    color: "rgba(210,200,185,0.38)",
    lineHeight: 1.7,
    fontWeight: 300,
  },
  eyebrow: {
    fontSize: 9,
    letterSpacing: "0.18em",
    textTransform: "uppercase",
    color: "rgba(210,200,185,0.25)",
    marginBottom: 16,
  },

  // Graph
  graphCard: {
    background: "rgba(255,255,255,0.02)",
    border: "1px solid rgba(210,200,185,0.07)",
    borderRadius: 10,
    padding: "20px 18px",
  },
  statsRow: { display: "flex", gap: 32 },
  statBox: { display: "flex", flexDirection: "column", gap: 5 },
  statLabel: { fontSize: 9, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(210,200,185,0.25)" },
  statValue: { fontSize: 26, fontWeight: 400, color: "#d2c8b9", letterSpacing: "-0.5px", fontFamily: "'Lora', serif" },
  tooltip: {
    background: "#241f1a",
    border: "1px solid rgba(210,200,185,0.08)",
    borderRadius: 6,
    padding: "8px 12px",
  },
  tooltipLabel: { fontSize: 9, color: "rgba(210,200,185,0.35)", marginBottom: 3, letterSpacing: "0.08em" },
  tooltipScore: { fontSize: 16, color: "#c8a96e", fontFamily: "'Lora', serif" },
  tooltipOf: { fontSize: 10, color: "rgba(210,200,185,0.3)", marginLeft: 2 },

  // Upload
  uploadCard: {
    display: "flex", flexDirection: "column", gap: 10,
  },
  dropzone: {
    border: "1px dashed rgba(210,200,185,0.12)",
    borderRadius: 8,
    padding: "36px 20px",
    display: "flex", alignItems: "center", justifyContent: "center",
    cursor: "pointer",
    transition: "border-color 0.15s, background 0.15s",
    background: "rgba(255,255,255,0.015)",
  },
  dropzoneActive: { borderColor: "rgba(200,169,110,0.4)", background: "rgba(200,169,110,0.04)" },
  dropzoneFilled: { borderStyle: "solid", borderColor: "rgba(200,169,110,0.25)", background: "rgba(200,169,110,0.03)" },
  dropPrompt: { display: "flex", flexDirection: "column", alignItems: "center" },
  dropText: { fontSize: 11, color: "rgba(210,200,185,0.25)", fontStyle: "italic" },
  fileInfo: { display: "flex", alignItems: "center", gap: 10 },
  fileIcon: { fontSize: 9, color: "#d2c8b9" },
  fileName: { fontSize: 12, color: "#d2c8b9" },
  fileSize: { fontSize: 10, color: "rgba(210,200,185,0.3)" },

  btn: {
    width: "100%",
    padding: "11px 20px",
    background: "transparent",
    color: "#d2c8b9",
    border: "1px solid rgba(210,200,185,0.15)",
    borderRadius: 7,
    fontSize: 11,
    fontFamily: "'DM Mono', monospace",
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.15s ease",
  },
  btnDisabled: { opacity: 0.22, cursor: "not-allowed" },
  btnInner: { display: "flex", alignItems: "center", justifyContent: "center", gap: 6 },

  // History
  historyWrap: { display: "flex", flexDirection: "column" },
  historyRow: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "12px 0",
    borderBottom: "1px solid rgba(210,200,185,0.06)",
  },
  historyMeta: { display: "flex", flexDirection: "column", gap: 3 },
  historyName: { fontSize: 11, color: "#d2c8b9" },
  historyDate: { fontSize: 9, color: "rgba(210,200,185,0.28)", letterSpacing: "0.05em" },
  historyActions: { display: "flex", alignItems: "center", gap: 14 },
  historyScore: { fontSize: 16, color: "#d2c8b9", fontFamily: "'Lora', serif" },
  viewBtn: {
    background: "none", border: "none",
    color: "rgba(210,200,185,0.28)",
    fontSize: 10, fontFamily: "'DM Mono', monospace",
    cursor: "pointer", letterSpacing: "0.06em",
    transition: "color 0.15s ease", padding: 0,
  },
};