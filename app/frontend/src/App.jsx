import { useEffect, useState } from "react";

const API_BASE = "/api";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function loadSubmissions() {
    const res = await fetch(`${API_BASE}/submissions`);
    const data = await res.json();
    setItems(data.items || []);
  }

  useEffect(() => {
    loadSubmissions().catch(() => setError("Unable to load submissions"));
  }, []);

  async function onSubmit(e) {
    e.preventDefault();
    setError("");
    setSuccess("");

    const payload = {
      name: form.name.trim(),
      email: form.email.trim(),
      message: form.message.trim(),
    };

    if (!payload.name || !payload.email || !payload.message) {
      setError("Please fill name, email, and message before submitting.");
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch(`${API_BASE}/submissions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        setError(body.error || "Submit failed");
        return;
      }

      setForm({ name: "", email: "", message: "" });
      await loadSubmissions();
      setSuccess("Submitted successfully.");
    } catch {
      setError("Unable to submit right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="container">
      <h1>Case Study Form</h1>
      <p>Minimal local React + Django + Postgres setup.</p>

      <form onSubmit={onSubmit} className="card">
        <input
          placeholder="Name"
          value={form.name}
          required
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          required
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          placeholder="Message"
          value={form.message}
          required
          onChange={(e) => setForm({ ...form, message: e.target.value })}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              e.currentTarget.form?.requestSubmit();
            }
          }}
        />
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </form>

      {error && <p className="error">{error}</p>}
      {success && <p>{success}</p>}

      <section className="card">
        <h2>Recent Submissions</h2>
        <ul>
          {items.map((item) => (
            <li key={item.id}>
              <strong>{item.name}</strong> ({item.email}) - {item.message}
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
