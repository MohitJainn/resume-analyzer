"use client";
import AnalysisResult from "../componenets/AnalysisResult";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const { status } = useSession();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/Login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={styles.loadingScreen}>
        <div style={styles.loadingDot} />
      </div>
    );
  }

  async function handleupload(e) {
    e.preventDefault();
    if (!file) return;
    setLoading(true);

    const formData = new FormData();
    formData.append("resume", file);

    const res = await fetch("/api/upload-resume", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();
    setAnalysis(data.analysis);
    setLoading(false);
  }

  function handleDrop(e) {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    if (dropped?.type === "application/pdf") setFile(dropped);
  }

  return (
    <div style={styles.page}>
      <style>{css}</style>

      <header style={styles.header}>
        <span style={styles.logo}>résumé<span style={styles.logoAccent}>.</span></span>
        <span style={styles.headerTag}>ATS Analyzer</span>
      </header>

      <main style={styles.main}>
        <div style={styles.hero}>
          <p style={styles.eyebrow}>Upload · Analyze · Improve</p>
          <h1 style={styles.title}>Make your resume<br />ATS-ready.</h1>
          <p style={styles.subtitle}>
            Drop your PDF below and get instant feedback on how well your resume passes applicant tracking systems.
          </p>
        </div>

        <form onSubmit={handleupload} style={styles.card}>
          <div
            style={{
              ...styles.dropzone,
              ...(dragOver ? styles.dropzoneActive : {}),
              ...(file ? styles.dropzoneFilled : {}),
            }}
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <input
              id="fileInput"
              type="file"
              accept=".pdf"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />

            {file ? (
              <div style={styles.fileInfo}>
                <span style={styles.fileIcon}>📄</span>
                <span style={styles.fileName}>{file.name}</span>
                <span style={styles.fileSize}>{(file.size / 1024).toFixed(1)} KB</span>
              </div>
            ) : (
              <div style={styles.dropPrompt}>
                <div style={styles.uploadIcon}>↑</div>
                <p style={styles.dropText}>Drag & drop your PDF here</p>
                <p style={styles.dropSub}>or click to browse</p>
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!file || loading}
            style={{
              ...styles.button,
              ...(!file || loading ? styles.buttonDisabled : {}),
            }}
            className="analyzeBtn"
          >
            {loading ? (
              <span style={styles.btnContent}>
                <span className="spinner" /> Analyzing...
              </span>
            ) : (
              <span style={styles.btnContent}>Analyze Resume →</span>
            )}
          </button>
        </form>

        {analysis && <AnalysisResult analysis={analysis} />}
      </main>
    </div>
  );
}

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Mono:wght@300;400;500&display=swap');

  * { box-sizing: border-box; margin: 0; padding: 0; }

  body { background: #0d0d0d; }

  .analyzeBtn:hover:not(:disabled) {
    background: #e8ff5a !important;
    color: #0d0d0d !important;
    transform: translateY(-1px);
  }

  .analyzeBtn:active:not(:disabled) {
    transform: translateY(0px);
  }

  @keyframes spin {
    to { transform: rotate(360deg); }
  }

  .spinner {
    display: inline-block;
    width: 14px;
    height: 14px;
    border: 2px solid rgba(255,255,255,0.3);
    border-top-color: white;
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
    margin-right: 8px;
    vertical-align: middle;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .fadeIn { animation: fadeUp 0.5s ease forwards; }

  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50%       { opacity: 0.3; }
  }
`;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0d0d0d",
    color: "#f0ede6",
    fontFamily: "'DM Mono', monospace",
  },
  loadingScreen: {
    minHeight: "100vh",
    background: "#0d0d0d",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loadingDot: {
    width: 10,
    height: 10,
    borderRadius: "50%",
    background: "#e8ff5a",
    animation: "pulse 1s ease infinite",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "24px 40px",
    borderBottom: "1px solid rgba(240,237,230,0.08)",
  },
  logo: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: 22,
    color: "#f0ede6",
    letterSpacing: "-0.5px",
  },
  logoAccent: {
    color: "#e8ff5a",
  },
  headerTag: {
    fontSize: 11,
    letterSpacing: "0.15em",
    textTransform: "uppercase",
    color: "rgba(240,237,230,0.4)",
  },
  main: {
    maxWidth: 680,
    margin: "0 auto",
    padding: "80px 24px 60px",
    display: "flex",
    flexDirection: "column",
    gap: 40,
  },
  hero: {
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  eyebrow: {
    fontSize: 11,
    letterSpacing: "0.2em",
    textTransform: "uppercase",
    color: "#e8ff5a",
  },
  title: {
    fontFamily: "'Instrument Serif', serif",
    fontSize: "clamp(42px, 7vw, 64px)",
    lineHeight: 1.05,
    color: "#f0ede6",
    letterSpacing: "-1.5px",
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 1.7,
    color: "rgba(240,237,230,0.5)",
    maxWidth: 480,
  },
  card: {
    background: "rgba(255,255,255,0.03)",
    border: "1px solid rgba(240,237,230,0.1)",
    borderRadius: 16,
    padding: 28,
    display: "flex",
    flexDirection: "column",
    gap: 16,
  },
  dropzone: {
    border: "1.5px dashed rgba(240,237,230,0.15)",
    borderRadius: 12,
    padding: "48px 24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    cursor: "pointer",
    transition: "all 0.2s ease",
    background: "rgba(255,255,255,0.02)",
  },
  dropzoneActive: {
    borderColor: "#e8ff5a",
    background: "rgba(232,255,90,0.04)",
  },
  dropzoneFilled: {
    borderColor: "rgba(232,255,90,0.4)",
    borderStyle: "solid",
    background: "rgba(232,255,90,0.04)",
  },
  dropPrompt: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
  uploadIcon: {
    fontSize: 28,
    color: "rgba(240,237,230,0.2)",
    marginBottom: 4,
  },
  dropText: {
    fontSize: 14,
    color: "rgba(240,237,230,0.6)",
  },
  dropSub: {
    fontSize: 12,
    color: "rgba(240,237,230,0.3)",
  },
  fileInfo: {
    display: "flex",
    alignItems: "center",
    gap: 12,
  },
  fileIcon: {
    fontSize: 24,
  },
  fileName: {
    fontSize: 14,
    color: "#f0ede6",
    fontWeight: 500,
  },
  fileSize: {
    fontSize: 12,
    color: "rgba(240,237,230,0.4)",
  },
  button: {
    width: "100%",
    padding: "14px 24px",
    background: "#1a1a1a",
    color: "#f0ede6",
    border: "1px solid rgba(240,237,230,0.15)",
    borderRadius: 10,
    fontSize: 13,
    fontFamily: "'DM Mono', monospace",
    fontWeight: 500,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.2s ease",
  },
  buttonDisabled: {
    opacity: 0.35,
    cursor: "not-allowed",
  },
  btnContent: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
};