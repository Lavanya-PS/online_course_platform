// src/components/Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [unverified, setUnverified] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async () => {
    if (!email || !password) return alert("All fields required");

    try {
      const res = await axios.post("http://localhost:5000/login", {
        email,
        password,
      });

      // SUCCESS
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);

      navigate("/");

    } catch (err) {
      const msg = err.response?.data?.error;

      if (msg === "Verify your email first" || msg === "Please verify your email first") {
        setUnverified(true);
      } else {
        alert(msg || "Login error");
      }
    }
  };

  // SEND VERIFICATION CODE
  const resendCode = async () => {
    try {
      await axios.post("http://localhost:5000/send-verification", { email });
      alert("Verification code sent!");
    } catch (err) {
      alert("Failed to resend code");
    }
  };

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Login</h2>

        <input
          type="email"
          placeholder="Enter email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={styles.input}
        />

        <input
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={styles.input}
        />

        <button onClick={handleLogin} style={styles.loginBtn}>
          Login
        </button>

        {/* SHOW THIS ONLY IF USER IS NOT VERIFIED */}
        {unverified && (
          <div style={styles.verifyBox}>
            <p style={{ color: "red", fontWeight: "bold" }}>
              Your email is not verified.
            </p>

            <button
              onClick={() => navigate(`/verify-email?email=${email}`)}
              style={styles.verifyBtn}
            >
              Verify Email
            </button>

            <button onClick={resendCode} style={styles.resendBtn}>
              Resend Verification Code
            </button>
          </div>
        )}

        <p
          style={{ marginTop: 15, textAlign: "center", color: "#007bff", cursor: "pointer" }}
          onClick={() => navigate("/forgot-password")}
        >
          Forgot Password?
        </p>

        <p style={{ textAlign: "center" }}>
          Don't have an account?{" "}
          <span
            onClick={() => navigate("/signup")}
            style={{ color: "blue", cursor: "pointer" }}
          >
            Signup
          </span>
        </p>
      </div>
    </div>
  );
}

/* STYLES */
const styles = {
  page: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 100,
    minHeight: "100vh",
    background: "#f5f7fa",
  },

  card: {
    width: 380,
    background: "white",
    padding: 25,
    borderRadius: 15,
    color:'blue',
    boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
  },

  input: {
    width: "100%",
    padding: 12,
    borderRadius: 8,
    border: "1px solid #8157e2ff",
    marginBottom: 12,
    fontSize: 14,
  },

  loginBtn: {
    width: "100%",
    padding: 12,
    background: "#2a7ed1ff",
    color: "white",
    border: "none",
    borderRadius: 8,
    fontWeight: "bold",
    cursor: "pointer",
    marginBottom: 10,
  },

  verifyBox: {
    background: "#fff3cd",
    padding: 15,
    borderRadius: 10,
    marginTop: 15,
    textAlign: "center",
    border: "1px solid #ffeeba",
  },

  verifyBtn: {
    width: "100%",
    padding: 10,
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
    marginBottom: 10,
  },

  resendBtn: {
    width: "100%",
    padding: 10,
    background: "#444",
    color: "white",
    border: "none",
    borderRadius: 8,
    cursor: "pointer",
  },
};
