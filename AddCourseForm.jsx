// src/components/AddCourseForm.jsx
import React, { useState } from "react";
import axios from "axios";

export default function AddCourseForm() {
  const userString = localStorage.getItem("user");
  const user = userString ? JSON.parse(userString) : null;
  const userEmail = user?.email || "";

  const [form, setForm] = useState({
    title: "",
    description: "",
    instructor: "",
    youtube_link: "",
    category: "Programming",
  });

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const onFileChange = (e) => {
    setFile(e.target.files?.[0] || null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!userEmail) {
      alert("You must be logged in as admin to add a course.");
      return;
    }

    if (!form.title.trim()) {
      alert("Course title is required.");
      return;
    }

    setLoading(true);

    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("instructor", form.instructor);
      fd.append("youtube_link", form.youtube_link);
      fd.append("category", form.category);
      fd.append("user_email", userEmail); // send admin email

      if (file) fd.append("image", file);

      const res = await axios.post("http://localhost:5000/courses", fd);

      alert(res.data.message || "Course added successfully!");

      // Reset form
      setForm({
        title: "",
        description: "",
        instructor: "",
        youtube_link: "",
        category: "Programming",
      });
      setFile(null);
    } catch (err) {
      console.error("Add course error:", err);
      alert(
        err.response?.data?.error ||
          err.message ||
          "Error adding course. Check server log."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.wrap}>
      <form style={styles.form} onSubmit={handleSubmit}>
        <h2 style={{ textAlign: "center", marginBottom: 20 }}>Add Course</h2>

        <label style={styles.label}>Title</label>
        <input
          name="title"
          value={form.title}
          onChange={onChange}
          style={styles.input}
          placeholder="Course Title"
        />

        <label style={styles.label}>Description</label>
        <textarea
          name="description"
          value={form.description}
          onChange={onChange}
          style={{ ...styles.input, height: 120 }}
          placeholder="Course Description"
        />

        <label style={styles.label}>Instructor</label>
        <input
          name="instructor"
          value={form.instructor}
          onChange={onChange}
          style={styles.input}
          placeholder="Instructor Name"
        />

        <label style={styles.label}>YouTube Link</label>
        <input
          name="youtube_link"
          value={form.youtube_link}
          onChange={onChange}
          style={styles.input}
          placeholder="https://youtube.com/..."
        />

        <label style={styles.label}>Category</label>
        <select
          name="category"
          value={form.category}
          onChange={onChange}
          style={styles.input}
        >
          <option>Programming</option>
          <option>AI/ML</option>
          <option>Web development</option>
          <option>UI/UX</option>
          <option>General</option>
        </select>

        <label style={styles.label}>Course Image</label>
        <input type="file" accept="image/*" onChange={onFileChange} />

        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? "Adding..." : "Add Course"}
        </button>
      </form>
    </div>
  );
}

const styles = {
  wrap: {
    display: "flex",
    justifyContent: "center",
    paddingTop: 50,
  },
  form: {
    width: 500,
    background: "white",
    color: "#222",
    padding: 25,
    borderRadius: 10,
    boxShadow: "0 6px 18px rgba(0,0,0,0.15)",
  },
  label: {
    marginTop: 12,
    marginBottom: 6,
    display: "block",
    fontWeight: 600,
  },
  input: {
    width: "100%",
    padding: 10,
    borderRadius: 6,
    border: "1px solid #ccc",
    boxSizing: "border-box",
  },
  button: {
    marginTop: 18,
    width: "100%",
    padding: 12,
    background: "#007bff",
    borderRadius: 8,
    border: "none",
    color: "white",
    fontWeight: 700,
    cursor: "pointer",
  },
};
