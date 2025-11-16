// src/components/CourseList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function CourseList() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/courses");
      setCourses(res.data);
    } catch (err) {
      console.error("Error fetching courses:", err);
      setCourses([]);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================================
  // ENROLL
  // ==========================================================
  const enrollCourse = async (courseId) => {
    if (!user) return alert("Please login first");
    if (user.role === "admin") return alert("Admin cannot enroll");

    try {
      await axios.post("http://localhost:5000/enroll", {
        user_id: user.id,
        course_id: courseId,
      });

      alert("Enrolled successfully!");
    } catch (err) {
      alert(err.response?.data?.error || "Already enrolled");
    }
  };

  // ==========================================================
  // DELETE COURSE (Admin Only)
  // ==========================================================
  const deleteCourse = async (courseId) => {
    if (!user || user.role !== "admin") {
      return alert("Only admin can delete courses");
    }

    const confirmDelete = window.confirm("Delete this course?");
    if (!confirmDelete) return;

    try {
      await axios.delete(`http://localhost:5000/courses/${courseId}?admin=${user.email}`);
      alert("Course deleted");
      loadCourses();
    } catch (err) {
      console.error("Delete error:", err);
      alert("Unable to delete course");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Available Courses</h2>

      {loading ? (
        <p>Loading…</p>
      ) : courses.length === 0 ? (
        <p>No courses added yet.</p>
      ) : (
        <div style={styles.grid}>
          {courses.map((course) => (
            <div key={course.id} style={styles.card}>

              {/* IMAGE */}
              {course.image && (
                <img
                  src={`http://localhost:5000${course.image}`}
                  alt="Course"
                  style={styles.image}
                />
              )}

              {/* TITLE */}
              <h3>{course.title}</h3>

              {/* CATEGORY */}
              {course.category && (
                <p style={styles.category}>📚 {course.category}</p>
              )}

              {/* DESCRIPTION */}
              <p>{course.description}</p>

              {/* INSTRUCTOR */}
              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>

              {/* YOUTUBE LINK */}
              {course.youtube_link && (
                <a
                  href={course.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  ▶ Watch Preview
                </a>
              )}

              {/* ACTION BUTTONS */}
              <div style={styles.btnRow}>

                {/* USER ENROLL */}
                {user && user.role === "user" && (
                  <button
                    onClick={() => enrollCourse(course.id)}
                    style={styles.enrollBtn}
                  >
                    Enroll
                  </button>
                )}

                {/* ADMIN DELETE */}
                {user && user.role === "admin" && (
                  <>
                    <button
                      onClick={() => deleteCourse(course.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </>
                )}

              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* STYLES */
const styles = {
  container: { padding: 20 },
  heading: { textAlign: "center", color: "#007bff", marginBottom: 20 },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#111",
    color: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
  },

  image: {
    width: "100%",
    height: 150,
    objectFit: "cover",
    borderRadius: 10,
    marginBottom: 10,
  },

  category: {
    background: "#007bff",
    padding: "4px 10px",
    borderRadius: "6px",
    display: "inline-block",
    marginBottom: 10,
  },

  btnRow: {
    display: "flex",
    justifyContent: "space-between",
    marginTop: 15,
  },

  enrollBtn: {
    padding: "10px 12px",
    background: "green",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  deleteBtn: {
    padding: "10px 12px",
    background: "red",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },

  link: {
    display: "inline-block",
    marginTop: 8,
    color: "#ffcc00",
    textDecoration: "none",
  },
};

