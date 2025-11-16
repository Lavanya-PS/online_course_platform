// src/components/ResetPassword.jsx
import React, { useState } from "react";
import { api } from "../api";

function ResetPassword() {
  const [form, setForm] = useState({
    email: "",
    code: "",
    newPassword: "",
  });

  const [strength, setStrength] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });

    if (e.target.name === "newPassword") checkStrength(e.target.value);
  };

  const checkStrength = (pw) => {
    if (pw.length < 6) {
      setStrength("Weak (minimum 6 characters)");
    } else if (!/[A-Z]/.test(pw)) {
      setStrength("Add at least one uppercase letter");
    } else if (!/\d/.test(pw)) {
      setStrength("Add at least one number");
    } else {
      setStrength("Strong Password ✔");
    }
  };

  const resetPassword = async () => {
    try {
      await api.post("/reset-password", form);
      alert("Password reset successful! Please login.");
    } catch (err) {
      alert(err.response?.data?.error || "Reset failed");
    }
  };

  return (
    <div style={styles.bg}>
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Password</h2>

        <input
          name="email"
          type="email"
          placeholder="Enter your email"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          name="code"
          type="text"
          placeholder="Enter reset code"
          style={styles.input}
          onChange={handleChange}
        />

        <input
          name="newPassword"
          type="password"
          placeholder="Enter new password"
          style={styles.input}
          onChange={handleChange}
        />

        {strength && (
          <p style={{ color: "#555", marginTop: "-8px", marginBottom: "10px" }}>
            {strength}
          </p>
        )}

        <button style={styles.button} onClick={resetPassword}>
          Reset Password
        </button>

        <p style={styles.backText}>
          <a href="/login" style={styles.loginLink}>← Back to Login</a>
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
    background: "green",
    color: "white",
    fontSize: "16px",
    fontWeight: "600",
    cursor: "pointer",
  },
  backText: {
    marginTop: "15px",
    fontSize: "14px",
  },
  loginLink: {
    color: "#007bff",
    textDecoration: "none",
    fontWeight: "600",
  },
};

export default ResetPassword;
