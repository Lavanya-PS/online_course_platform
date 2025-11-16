import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminEnrollments() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;

  useEffect(() => {
    if (user && user.role === "admin") {
      loadData();
    }
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://localhost:5000/admin/enrollments");
      setData(res.data);
    } catch (err) {
      console.error("Admin enrollment error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (!user || user.role !== "admin") {
    return <h3 style={{ textAlign: "center" }}>Access Denied</h3>;
  }

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin — All Enrollments</h2>

      {loading ? (
        <p>Loading...</p>
      ) : data.length === 0 ? (
        <p>No enrollments yet.</p>
      ) : (
        <table style={styles.table}>
          <thead>
            <tr>
              <th>Student</th>
              <th>Email</th>
              <th>Course</th>
              <th>Instructor</th>
              <th>Category</th>
              <th>Progress</th>
              <th>Rating</th>
              <th>Enrolled On</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.enrollment_id}>
                <td>{row.student_name}</td>
                <td>{row.student_email}</td>
                <td>{row.course_title}</td>
                <td>{row.instructor}</td>
                <td>{row.category}</td>
                <td>{row.progress}%</td>
                <td>{row.rating ? `${row.rating}⭐` : "—"}</td>
                <td>{new Date(row.created_at).toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  container: { padding: 20 },
  heading: { textAlign: "center", marginBottom: 20, color: "#007bff" },

  table: {
    width: "100%",
    borderCollapse: "collapse",
    background: "#1b1a1aff",
    borderRadius: 10,
    overflow: "hidden",
  },

  th: {
    background: "#007bff",
    color: "white",
    padding: 10,
  },
};
