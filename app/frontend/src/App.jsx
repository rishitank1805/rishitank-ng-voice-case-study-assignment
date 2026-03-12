import { useEffect, useState } from "react";

const API_BASE = "/api";

export default function App() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });
  const [items, setItems] = useState([]);
  const [error, setError] = useState("");

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

    const res = await fetch(`${API_BASE}/submissions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      setError(body.error || "Submit failed");
      return;
    }

    setForm({ name: "", email: "", message: "" });
    await loadSubmissions();
  }

  return (
    <main className="container">
      <h1>Case Study Form</h1>
      <p>Minimal local React + Django + Postgres setup.</p>

      <form onSubmit={onSubmit} className="card">
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <textarea
          placeholder="Message"
          value={form.message}
          onChange={(e) => setForm({ ...form, message: e.target.value })}
        />
        <button type="submit">Submit</button>
      </form>

      {error && <p className="error">{error}</p>}

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
