// src/components/VerifyEmail.jsx
import React, { useState, useEffect } from "react";
import { api } from "../api";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [timer, setTimer] = useState(0);
  const navigate = useNavigate();   // <-- ADD THIS

  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const sendCode = async () => {
    try {
      await api.post("/send-verification", { email });
      setSent(true);
      setTimer(60);
      alert("Verification code sent to your email!");
    } catch (err) {
      alert(err.response?.data?.error || "Error sending verification code");
    }
  };

  // ⭐ UPDATED verify()
  const verify = async () => {
    try {
      await api.post("/verify-account", { email, code });

      alert("Email verified successfully!");

      // ⏳ Auto redirect after 1 second
      setTimeout(() => {
        navigate("/login");  // ⬅ Redirect to login page
      }, 1000);

    } catch (err) {
      alert(err.response?.data?.error || "Verification failed");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Verify Your Email</h2>

      <input
        type="email"
        placeholder="Enter your email"
        style={styles.input}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <button
        style={{
          ...styles.button,
          backgroundColor: timer > 0 ? "#888" : "#007bff",
          cursor: timer > 0 ? "not-allowed" : "pointer",
        }}
        disabled={timer > 0}
        onClick={sendCode}
      >
        {timer > 0 ? `Resend in ${timer}s` : sent ? "Resend Code" : "Send Code"}
      </button>

      {sent && (
        <>
          <input
            type="text"
            placeholder="Enter verification code"
            value={code}
            style={styles.input}
            onChange={(e) => setCode(e.target.value)}
          />

          <button style={styles.verifyBtn} onClick={verify}>
            Verify Email
          </button>
        </>
      )}
    </div>
  );
}

const styles = {
  container: {
    maxWidth: 400,
    margin: "80px auto",
    background: "#fff",
    padding: 25,
    borderRadius: 10,
    boxShadow: "0 0 12px rgba(0,0,0,0.1)",
  },
  heading: {
    textAlign: "center",
    marginBottom: 20,
    color: "#007bff",
  },
  input: {
    width: "100%",
    padding: 12,
    margin: "10px 0",
    borderRadius: 6,
    border: "1px solid #ccc",
    fontSize: 16,
  },
  button: {
    width: "100%",
    padding: 12,
    borderRadius: 6,
    border: "none",
    color: "white",
    fontWeight: "bold",
    marginTop: 5,
  },
  verifyBtn: {
    width: "100%",
    padding: 12,
    backgroundColor: "green",
    borderRadius: 6,
    border: "none",
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 10,
    cursor: "pointer",
  },
};

export default VerifyEmail;
