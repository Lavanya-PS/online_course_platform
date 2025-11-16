// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import { api } from "../api";

function ForgotPassword() {
  const [email, setEmail] = useState("");

  const sendResetCode = async () => {
    try {
      await api.post("/forgot-password", { email });
      alert("Reset code has been sent to your email!");
    } catch (err) {
      alert(err.response?.data?.error || "Unable to send reset code");
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Forgot Password</h2>

        <input
          type="email"
          placeholder="Enter your email"
          style={styles.input}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button style={styles.button} onClick={sendResetCode}>
          Send Reset Code
        </button>

        <p style={styles.back}>
          <a href="/login" style={{ color: "#007bff", textDecoration: "none" }}>
            ← Back to Login
          </a>
        </p>
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #ffffff, #ffffff)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: "360px",
    background: "rgba(255, 255, 255, 0.95)",
    padding: "28px",
    borderRadius: "12px",
    boxShadow: "0 8px 15px rgba(0,0,0,0.2)",
    textAlign: "center",
    color: "black",
  },
  title: {
    marginBottom: "20px",
    fontSize: "26px",
    fontWeight: "700",
  },
  input: {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    borderRadius: "8px",
    border: "1px solid #ccc",
    fontSize: "16px",
  },
  button: {
    width: "100%",
    padding: "12px",
    borderRadius: "8px",
    border: "none",
    background: "#ff4b4b",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  back: {
    marginTop: "15px",
    fontSize: "14px",
  },
};

export default ForgotPassword;
