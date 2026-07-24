import {
  AlertCircle,
  CheckCircle2,
  ExternalLink,
  Gauge,
  ImageOff,
  Loader2,
  Radar,
  Search,
  ShieldCheck,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";
import { useState } from "react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Metric({ icon, label, value, accent }) {
  return (
    <div className="metric" style={{ "--accent": accent }}>
      <div className="metricIcon">{icon}</div>
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function App() {
  const [url, setUrl] = useState("");
  const [report, setReport] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleAudit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");
    setReport(null);

    try {
      const response = await fetch(`${API_URL}/audit`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error.message);
      }

      setReport(data);
    } catch (err) {
      setError(err.message || "Could not audit this website.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="app">
      <section className="hero">
        <div className="badge">
          <Sparkles size={16} />
          Smart website audit
        </div>

        <h1 className="title3d" data-text="Page Pulse">
          Page Pulse
        </h1>

        <p className="description">
          A clean audit console that checks a website's status, response speed,
          SEO basics, heading structure, image alt text, and content depth in one
          quick scan.
        </p>

        <div className="signalRow">
          <span>
            <Zap size={16} /> Speed
          </span>
          <span>
            <ShieldCheck size={16} /> Accessibility
          </span>
          <span>
            <Radar size={16} /> SEO Signals
          </span>
        </div>
      </section>

      <section className="auditCard">
        <form onSubmit={handleAudit}>
          <label htmlFor="url">Website Link</label>

          <div className="smartInput">
            <Search className="inputIcon" size={20} />

            <input
              id="url"
              type="text"
              placeholder="example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />

            <button type="submit" disabled={loading || !url.trim()}>
              {loading ? <Loader2 className="spin" size={18} /> : <Radar size={18} />}
              {loading ? "Scanning" : "Audit"}
            </button>
          </div>
        </form>
      </section>

      {error && (
        <section className="errorBox">
          <AlertCircle size={20} />
          <p>{error}</p>
        </section>
      )}

      {report && (
        <section className="report">
          <div className="reportTop">
            <div>
              <p className="eyebrow">Audit report</p>
              <h2>{report.title}</h2>

              <a href={report.url} target="_blank" rel="noreferrer">
                {report.url}
                <ExternalLink size={15} />
              </a>
            </div>

            <div className="status">
              <CheckCircle2 size={18} />
              HTTP {report.status}
            </div>
          </div>

          <div className="grid">
            <Metric
              icon={<Gauge size={20} />}
              label="Response Time"
              value={report.responseTime}
              accent="#2563eb"
            />
            <Metric
              icon={<Type size={20} />}
              label="H1 Count"
              value={report.h1Count}
              accent="#16a34a"
            />
            <Metric
              icon={<ImageOff size={20} />}
              label="Missing Alt"
              value={report.missingAltImages}
              accent="#ea580c"
            />
            <Metric
              icon={<Sparkles size={20} />}
              label="Word Count"
              value={report.wordCount}
              accent="#7c3aed"
            />
          </div>

          <div className="meta">
            <span>Meta Description</span>
            <p>{report.metaDescription}</p>
          </div>
        </section>
      )}

      <footer>
        <a href="https://digitalheroesco.com" target="_blank" rel="noreferrer">
          Built for Digital Heroes Training Task
        </a>
      </footer>
    </main>
  );
}

export default App;