// src/components/Home.jsx
import React from "react";
import { Link } from "react-router-dom";

function Home() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  const isAdmin =
    user && (user.role === "admin" || user.email === "admin09@gmail.com");

  return (
    <div style={styles.bg}>
      <div style={styles.container}>
        <h1 style={styles.title}>
          Welcome {user ? user.name : "Student"} 👋
        </h1>

        {!user && (
          <div style={styles.card}>
            <p>Please login or signup to continue</p>
            <Link to="/login" style={styles.btn}>Login</Link>
            <Link to="/signup" style={styles.btn2}>Signup</Link>
          </div>
        )}

        {user && (
          <div>
            {/* Admin Dashboard UI */}
            {isAdmin && (
              <div style={styles.card}>
                <h2 style={styles.subTitle}>Admin Dashboard</h2>

                <div style={styles.grid}>
                  <Link to="/add-course" style={styles.linkBox}>
                    ➕ Add New Course
                  </Link>

                  <Link to="/courses" style={styles.linkBox}>
                    📚 View All Courses
                  </Link>

                  <Link to="/admin/enrollments" style={styles.linkBox}>
                    👥 View Enrollments
                  </Link>
                </div>
              </div>
            )}

            {/* User Dashboard UI */}
            {!isAdmin && (
              <div style={styles.card}>
                <h2 style={styles.subTitle}>Student Dashboard</h2>

                <div style={styles.grid}>
                  <Link to="/courses" style={styles.linkBox}>
                    📚 Browse Courses
                  </Link>

                  <Link to="/enrolled" style={styles.linkBox}>
                    🎯 My Enrolled Courses
                  </Link>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

const styles = {
  bg: {
    minHeight: "100vh",
    background: "linear-gradient(to right, #232526, #414345)",
    backgroundImage: "url('/background.jpg')", // Your original background
    padding: "40px 20px",
  },
  container: {
    maxWidth: "900px",
    margin: "0 auto",
    color: "white",
    textAlign: "center",
  },
  title: {
    fontSize: "36px",
    marginBottom: "20px",
    fontWeight: "700",
  },
  subTitle: {
    marginBottom: "15px",
    fontSize: "22px",
  },
  card: {
    background: "rgba(255, 255, 255, 0.1)",
    padding: "25px",
    borderRadius: "12px",
    backdropFilter: "blur(6px)",
    marginTop: "20px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "15px",
    marginTop: "15px",
  },
  linkBox: {
    display: "block",
    padding: "15px",
    background: "#ff4b4b",
    borderRadius: "10px",
    textDecoration: "none",
    color: "white",
    fontWeight: "600",
    boxShadow: "0 3px 8px rgba(0,0,0,0.2)",
  },
  btn: {
    display: "inline-block",
    marginTop: "15px",
    marginRight: "10px",
    padding: "10px 20px",
    background: "#ff4b4b",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
  btn2: {
    display: "inline-block",
    marginTop: "15px",
    padding: "10px 20px",
    background: "#007bff",
    color: "white",
    textDecoration: "none",
    borderRadius: "8px",
  },
};

export default Home;
