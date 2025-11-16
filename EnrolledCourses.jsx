// src/components/EnrolledCourses.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function EnrolledCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState(null);
  const [ratingId, setRatingId] = useState(null);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user) fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        `http://localhost:5000/enrollments/user/${user.id}`
      );
      setCourses(res.data);
    } catch (err) {
      console.log("Load error:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateProgress = async (course_id, value) => {
    const prog = parseInt(value);

    // Optimistic UI update
    setCourses((prev) =>
      prev.map((c) =>
        c.course_id === course_id ? { ...c, progress: prog } : c
      )
    );

    setSavingId(course_id);

    try {
      await axios.patch("http://localhost:5000/enrollments/progress", {
        user_id: user.id,
        course_id,
        progress: prog,
      });
    } catch {
      alert("Failed to save progress");
    }

    setSavingId(null);
  };

  const saveRating = async (course_id, rating) => {
    setRatingId(course_id);

    try {
      await axios.patch("http://localhost:5000/enrollments/rating", {
        user_id: user.id,
        course_id,
        rating,
      });

      setCourses((prev) =>
        prev.map((c) =>
          c.course_id === course_id ? { ...c, rating } : c
        )
      );
    } catch {
      alert("Failed to save rating");
    }

    setRatingId(null);
  };

  const downloadCertificate = (course_id) => {
    window.open(
      `http://localhost:5000/enrollments/${user.id}/${course_id}/certificate`,
      "_blank"
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>My Enrolled Courses</h2>

      {loading ? (
        <p>Loading...</p>
      ) : courses.length === 0 ? (
        <p>You have not enrolled in any courses yet.</p>
      ) : (
        <div style={styles.grid}>
          {courses.map((course) => (
            <div key={course.course_id} style={styles.card}>
              {course.image && (
                <img
                  src={`http://localhost:5000${course.image}`}
                  alt="Course"
                  style={styles.image}
                />
              )}

              <h3>{course.title}</h3>
              <p style={{ minHeight: 60 }}>{course.description}</p>

              <p>
                <strong>Instructor:</strong> {course.instructor}
              </p>

              {/* WATCH BUTTON */}
              {course.youtube_link && (
                <a
                  href={course.youtube_link}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={styles.link}
                >
                  ▶ Watch Course
                </a>
              )}

              {/* PROGRESS */}
              <p style={{ marginTop: 10 }}>
                <strong>Progress:</strong>{" "}
                {course.progress >= 100 ? "Completed ✓" : `${course.progress}%`}
              </p>

              <input
                type="range"
                min="0"
                max="100"
                value={course.progress}
                onChange={(e) =>
                  updateProgress(course.course_id, e.target.value)
                }
                style={{ width: "100%" }}
              />

              {savingId === course.course_id && (
                <p style={{ fontSize: 12, color: "#aaa" }}>Saving…</p>
              )}

              <div style={styles.progressBg}>
                <div
                  style={{
                    ...styles.progressFill,
                    width: `${course.progress}%`,
                  }}
                />
              </div>

              {/* RATING (only after completion) */}
              {course.progress >= 100 && (
                <>
                  <p>Rate this course:</p>
                  <div style={{ display: "flex", gap: 5 }}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() =>
                          saveRating(course.course_id, star)
                        }
                        style={{
                          fontSize: 20,
                          background: "none",
                          border: "none",
                          cursor: "pointer",
                          color:
                            star <= (course.rating || 0)
                              ? "gold"
                              : "#777",
                        }}
                      >
                        ★
                      </button>
                    ))}
                  </div>

                  {ratingId === course.course_id && (
                    <p style={{ fontSize: 12 }}>Saving rating…</p>
                  )}

                  <button
                    style={styles.certificateBtn}
                    onClick={() => downloadCertificate(course.course_id)}
                  >
                    🎓 Download Certificate
                  </button>
                </>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* Styles */
const styles = {
  container: { padding: 20 },
  heading: { textAlign: "center", marginBottom: 20, color: "#007bff" },

  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
    gap: 20,
  },

  card: {
    background: "#111",
    color: "white",
    padding: 20,
    borderRadius: 10,
    boxShadow: "0 5px 15px rgba(0,0,0,0.4)",
  },

  image: {
    width: "100%",
    borderRadius: 10,
    marginBottom: 10,
  },

  link: {
    display: "inline-block",
    marginTop: 10,
    padding: "8px 12px",
    background: "#007bff",
    color: "white",
    borderRadius: 6,
    textDecoration: "none",
  },

  progressBg: {
    width: "100%",
    height: 8,
    background: "#333",
    borderRadius: 5,
    marginTop: 8,
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#28a745",
  },

  certificateBtn: {
    marginTop: 12,
    padding: "10px",
    background: "purple",
    color: "white",
    border: "none",
    borderRadius: 6,
    cursor: "pointer",
  },
};
