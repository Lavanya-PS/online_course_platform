// src/App.js  (FRONTEND ONLY – CLEAN)
import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Home from "./components/Home";
import AddCourseForm from "./components/AddCourseForm";
import CourseList from "./components/CourseList";
import EnrolledCourses from "./components/EnrolledCourses";
import Login from "./components/Login";
import Signup from "./components/Signup";
import VerifyEmail from "./components/VerifyEmail";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import AdminEnrollments from "./components/AdminEnrollments";


const App = () => {
  const [user, setUser] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  useEffect(() => {
    const u = localStorage.getItem("user");
    if (u) setUser(JSON.parse(u));
  }, []);

  const performLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    setShowLogoutConfirm(false);
    window.location.href = "/";
  };

  return (
    <Router>
      <div style={styles.container}>

        {/* NAVBAR */}
        <nav style={styles.navbar}>
          <div style={styles.navbarContainer}>
            <h2
              style={styles.logo}
              onClick={() => (window.location.href = "/")}
            >
              Online Course Platform
            </h2>

            {/* MOBILE MENU BUTTON */}
            <button
              style={styles.mobileMenuBtn}
              onClick={() => setMenuOpen(!menuOpen)}
            >
              ☰
            </button>

            {/* NAV LINKS */}
            <div
              style={{
                ...styles.navLinks,
                ...(menuOpen
                  ? styles.navLinksMobileOpen
                  : styles.navLinksMobileClosed),
              }}
            >
              {user ? (
                <>
                  <Link to="/" style={styles.link}>Home</Link>
                  {user.email === "admin09@gmail.com" && (
                    <Link to="/add-course" style={styles.link}>Add Course</Link>
                  )}
                  {user && user.role === "admin" && (
  <Link to="/admin/enrollments" style={styles.link}>Admin Enrollments</Link>
)}

                  <Link to="/courses" style={styles.link}>Courses</Link>
                  <Link to="/enrolled" style={styles.link}>Enrolled</Link>

                  <button
                    onClick={() => setShowLogoutConfirm(true)}
                    style={styles.logoutBtn}
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" style={styles.link}>Login</Link>
                  <Link to="/signup" style={styles.link}>Signup</Link>
                </>
              )}
            </div>
          </div>
        </nav>

        {/* LOGOUT POPUP */}
        {showLogoutConfirm && (
          <div style={styles.popupOverlay}>
            <div style={styles.popupBox}>
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to logout?</p>

              <div style={styles.popupBtnWrap}>
                <button style={styles.confirmBtn} onClick={performLogout}>
                  Yes, Logout
                </button>
                <button
                  style={styles.cancelBtn}
                  onClick={() => setShowLogoutConfirm(false)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* PAGE CONTENT */}
        <div style={styles.pageContent}>
          <Routes>
            <Route path="/" element={<Home user={user} />} />
            <Route path="/add-course" element={<AddCourseForm />} />
            <Route path="/courses" element={<CourseList />} />
            <Route path="/enrolled" element={<EnrolledCourses />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/verify-email" element={<VerifyEmail />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/enrollments" element={<AdminEnrollments />} />

          </Routes>
        </div>

      </div>
    </Router>
  );
};

/* STYLES BELOW — SAFE FOR FRONTEND */
const styles = {
  container: {
    minHeight: "100vh",
    backgroundImage:
      "url('https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format')",
    backgroundSize: "cover",
    color: "white",
  },

  navbar: {
    position: "fixed",
    top: 0,
    width: "100%",
    background: "#1a1a1a",
    padding: "10px 0",
    boxShadow: "0 3px 10px rgba(0,0,0,0.3)",
    zIndex: 2000,
  },

  navbarContainer: {
    width: "100%",
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "0 20px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
  },

  logo: {
    color: "white",
    fontSize: "22px",
    fontWeight: "bold",
    cursor: "pointer",
  },

  navLinks: {
    display: "flex",
    gap: "20px",
    alignItems: "center",
    flexWrap: "wrap",
  },

  link: {
    color: "white",
    textDecoration: "none",
    fontSize: "16px",
    fontWeight: 500,
  },

  logoutBtn: {
    background: "#e63946",
    padding: "8px 18px",
    borderRadius: "8px",
    border: "none",
    color: "white",
    fontWeight: 600,
    cursor: "pointer",
  },

  mobileMenuBtn: {
    display: "none",
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "30px",
    cursor: "pointer",
  },

  navLinksMobileOpen: {
    display: "flex",
    flexDirection: "column",
    background: "#1a1a1a",
    padding: "12px",
    position: "absolute",
    top: "70px",
    right: "20px",
    borderRadius: "10px",
    gap: "12px",
  },

  navLinksMobileClosed: {
    display: "flex",
  },

  pageContent: {
    padding: "30px",
    marginTop: "90px",
  },

  popupOverlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "rgba(0,0,0,0.6)",
    backdropFilter: "blur(6px)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 3000,
  },

  popupBox: {
    width: "330px",
    background: "white",
    color: "black",
    padding: "25px",
    borderRadius: "12px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.3)",
  },

  popupBtnWrap: {
    display: "flex",
    justifyContent: "center",
    gap: "12px",
    marginTop: "15px",
  },

  confirmBtn: {
    background: "#e63946",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },

  cancelBtn: {
    background: "gray",
    padding: "10px 18px",
    border: "none",
    borderRadius: "8px",
    color: "white",
    cursor: "pointer",
    fontWeight: 600,
  },
};

/* Enable hamburger menu on mobile */
if (window.innerWidth < 768) {
  styles.navLinks.display = "none";
  styles.mobileMenuBtn.display = "block";
}

export default App;
