// src/components/Signup.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

function Signup() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [pwStrength, setPwStrength] = useState({ label: "", color: "" });

  useEffect(() => {
    const userString = localStorage.getItem("user");
    if (userString) {
      navigate("/courses");
    }
    // eslint-disable-next-line
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "password") {
      evaluateStrength(e.target.value);
    }
  };

  const evaluateStrength = (pw) => {
    if (!pw) return setPwStrength({ label: "", color: "" });

    let score = 0;
    if (pw.length >= 6) score++;
    if (/[A-Z]/.test(pw)) score++;
    if (/\d/.test(pw)) score++;
    if (/[\W_]/.test(pw)) score++;

    if (score <= 1) setPwStrength({ label: "Very weak", color: "red" });
    else if (score === 2) setPwStrength({ label: "Weak", color: "orange" });
    else if (score === 3) setPwStrength({ label: "Good", color: "blue" });
    else setPwStrength({ label: "Strong", color: "green" });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/signup", form);
      alert("Signup successful! Please login.");
      navigate("/login");
    } catch (err) {
      console.error("Signup error:", err);
      alert(err.response?.data?.error || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Signup</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={form.name}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={styles.input}
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={styles.input}
        />

        {pwStrength.label && (
          <p style={{ color: pwStrength.color, marginTop: -6, marginBottom: 8 }}>
            Password strength: {pwStrength.label}
          </p>
        )}

        <p style={{ color: "#333", fontSize: 13 }}>
          Password rules: minimum 6 characters, at least 1 uppercase letter and 1 number.
        </p>

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Signing up..." : "Signup"}
        </button>
      </form>
    </div>
  );
}

export default Signup;

const styles = {
  container: {
    padding: 20,
    maxWidth: 420,
    margin: "60px auto",
    background: "#fff",
    borderRadius: 10,
    boxShadow: "0 0 10px rgba(0,0,0,0.08)",
  },
  heading: {
    textAlign: "center",
    marginBottom: 20,
    color: "#007bff",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: 12,
  },
  input: {
    padding: 12,
    border: "1px solid #ccc",
    borderRadius: 6,
    fontSize: 16,
  },
  button: {
    padding: "12px 16px",
    border: "none",
    borderRadius: 6,
    backgroundColor: "#007bff",
    color: "#fff",
    cursor: "pointer",
    fontSize: 16,
  },
};
