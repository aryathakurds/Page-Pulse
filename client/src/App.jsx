import { AlertCircle, CheckCircle2, ExternalLink, Loader2, Search } from "lucide-react";
import { useState } from "react";
import "./styles.css";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

function Metric({ label, value }) {
  return (
    <div className="metric">
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
        headers: {
          "Content-Type": "application/json",
        },
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
        <p className="eyebrow">Website audit utility</p>
        <h1>Page Pulse</h1>
        <p>
          Check a website's status, speed, title, description, headings, image alt text,
          and word count in one quick report.
        </p>
      </section>

      <section className="panel">
        <form onSubmit={handleAudit}>
          <label htmlFor="url">Website URL</label>

          <div className="inputRow">
            <input
              id="url"
              type="text"
              placeholder="example.com"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
            />

            <button type="submit" disabled={loading || !url.trim()}>
              {loading ? <Loader2 className="spin" size={18} /> : <Search size={18} />}
              {loading ? "Auditing" : "Audit Website"}
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
            <Metric label="Response Time" value={report.responseTime} />
            <Metric label="H1 Count" value={report.h1Count} />
            <Metric label="Images Missing Alt" value={report.missingAltImages} />
            <Metric label="Word Count" value={report.wordCount} />
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