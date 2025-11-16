// backend/server.js
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import db from "./db.js";
import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import nodemailer from "nodemailer";
import multer from "multer";
import path from "path";
import fs from "fs";
import PDFDocument from "pdfkit";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// ================= EMAIL SETUP ==================
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ================= MULTER UPLOAD ==================
const UPLOADS_DIR = "uploads";
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR);

const storage = multer.diskStorage({
  destination: UPLOADS_DIR,
  filename: (req, file, cb) => {
    cb(
      null,
      Date.now() +
        "-" +
        Math.round(Math.random() * 1e9) +
        path.extname(file.originalname)
    );
  },
});
const upload = multer({ storage });

app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));

// ------------------ CHECK ADMIN ------------------
const checkAdmin = (email) =>
  new Promise((resolve) => {
    db.query(
      "SELECT role FROM users WHERE LOWER(email)=?",
      [email.toLowerCase()],
      (err, rows) => {
        if (err || !rows.length) return resolve(false);
        resolve(rows[0].role === "admin");
      }
    );
  });

// ================= SIGNUP =================
app.post("/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password)
    return res.status(400).json({ error: "All fields required" });

  const strongPw = /^(?=.*[A-Z])(?=.*\d).{6,}$/;
  if (!strongPw.test(password))
    return res.status(400).json({
      error: "Password must contain uppercase + number",
    });

  db.query("SELECT id FROM users WHERE email=?", [email], async (err, rows) => {
    if (rows.length)
      return res.status(400).json({ error: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const role = email === "admin09@gmail.com" ? "admin" : "user";
    const is_verified = role === "admin";

    db.query(
      "INSERT INTO users (name,email,password,verification_code,is_verified,role) VALUES (?,?,?,?,?,?)",
      [name, email, hashed, code, is_verified, role],
      () => {
        if (role === "user") {
          transporter.sendMail({
            from: process.env.EMAIL_USER,
            to: email,
            subject: "Verify Email",
            text: `Your verification code is ${code}`,
          });
        }

        res.json({
          message:
            role === "admin"
              ? "Admin created. Login directly."
              : "Signup successful. Verify your email.",
        });
      }
    );
  });
});

// ================= VERIFY ACCOUNT =================
app.post("/verify-account", (req, res) => {
  let { email, code } = req.body;

  email = email.trim().toLowerCase();
  code = code.trim();

  db.query(
    "SELECT verification_code, role FROM users WHERE LOWER(email)=?",
    [email],
    (err, rows) => {
      if (!rows.length)
        return res.status(400).json({ error: "User not found" });

      if (rows[0].role === "admin")
        return res.json({ message: "Admin auto-verified" });

      if (rows[0].verification_code.trim() !== code)
        return res.status(400).json({ error: "Invalid code" });

      db.query(
        "UPDATE users SET is_verified=1 WHERE LOWER(email)=?",
        [email],
        () => res.json({ message: "Email verified successfully" })
      );
    }
  );
});

// ================= LOGIN =================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email=?", [email], async (err, rows) => {
    if (!rows.length)
      return res.status(400).json({ error: "Invalid credentials" });

    const user = rows[0];

    if (user.role !== "admin" && !user.is_verified)
      return res.status(403).json({ error: "Verify your email first" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ error: "Invalid credentials" });

    delete user.password;
    delete user.verification_code;

    res.json({ message: "Login successful", user });
  });
});

// ================= FORGOT PASSWORD =================
app.post("/forgot-password", (req, res) => {
  const { email } = req.body;
  const code = Math.floor(100000 + Math.random() * 900000).toString();

  db.query("UPDATE users SET reset_code=? WHERE email=?", [code, email], () => {
    transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset Code",
      text: `Use this code to reset your password: ${code}`,
    });

    res.json({ message: "Reset code sent" });
  });
});

// ================= RESET PASSWORD =================
app.post("/reset-password", async (req, res) => {
  const { email, code, newPassword } = req.body;

  db.query(
    "SELECT reset_code FROM users WHERE email=?",
    [email],
    async (err, rows) => {
      if (!rows.length)
        return res.status(400).json({ error: "User not found" });

      if (rows[0].reset_code !== code)
        return res.status(400).json({ error: "Wrong reset code" });

      const hashed = await bcrypt.hash(newPassword, 10);

      db.query(
        "UPDATE users SET password=?, reset_code=NULL WHERE email=?",
        [hashed, email],
        () => res.json({ message: "Password changed successfully" })
      );
    }
  );
});

// ================= ADD COURSE =================
app.post("/courses", upload.single("image"), async (req, res) => {
  try {
    const {
      title,
      description,
      instructor,
      youtube_link,
      category,
      user_email,
    } = req.body;

    if (!user_email)
      return res.status(400).json({ error: "Missing admin email" });

    const isAdmin = await checkAdmin(user_email);
    if (!isAdmin)
      return res.status(403).json({ error: "Only admin can add courses" });

    if (!title || !description || !instructor)
      return res.status(400).json({ error: "All fields required" });

    const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

    const sql =
      "INSERT INTO courses (title, description, instructor, youtube_link, category, image) VALUES (?,?,?,?,?,?)";

    db.query(
      sql,
      [title, description, instructor, youtube_link, category, imagePath],
      (err, result) => {
        if (err)
          return res.status(500).json({ error: "Database insert failed" });

        res.json({ message: "Course added successfully", id: result.insertId });
      }
    );
  } catch (err) {
    res.status(500).json({ error: "Server error adding course" });
  }
});

// ================= GET ALL COURSES =================
app.get("/courses", (req, res) => {
  db.query("SELECT * FROM courses", (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ error: "Database error fetching courses" });
    }
    res.json(rows);
  });
});

// ================= DELETE COURSE =================
app.delete("/courses/:id", async (req, res) => {
  const adminEmail = req.query.admin;
  const id = req.params.id;

  if (!adminEmail)
    return res.status(400).json({ error: "Missing admin email" });

  const isAdmin = await checkAdmin(adminEmail);
  if (!isAdmin)
    return res.status(403).json({ error: "Unauthorized" });

  db.query("SELECT image FROM courses WHERE id=?", [id], (err, rows) => {
    if (!rows.length) return res.status(404).json({ error: "Not found" });

    const image = rows[0].image;

    db.query("DELETE FROM courses WHERE id=?", [id], () => {
      if (image) {
        const full = path.join(process.cwd(), image);
        fs.unlink(full, () => {});
      }
      res.json({ message: "Course deleted" });
    });
  });
});


// ================= ENROLL =================
app.post("/enroll", (req, res) => {
  const { user_id, course_id } = req.body;

  db.query(
    "INSERT INTO enrollments (user_id, course_id) VALUES (?,?)",
    [user_id, course_id],
    (err) => {
      if (err) return res.status(400).json({ error: "Already enrolled" });

      res.json({ message: "Enrolled" });
    }
  );
});

// ================= FETCH ENROLLED COURSES =================
app.get("/enrollments/user/:userId", (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT e.course_id, e.progress, e.rating,
           c.title, c.description, c.instructor, c.youtube_link, c.image
    FROM enrollments e 
    JOIN courses c ON e.course_id = c.id
    WHERE e.user_id = ?
  `;

  db.query(sql, [userId], (err, rows) => {
    if (err) return res.status(500).json({ error: "Database error" });
    res.json(rows);
  });
});
// ================= UPDATE PROGRESS =================
app.patch("/enrollments/progress", (req, res) => {
  const { user_id, course_id, progress } = req.body;

  const prog = Math.max(0, Math.min(100, parseInt(progress)));

  db.query(
    "UPDATE enrollments SET progress=? WHERE user_id=? AND course_id=?",
    [prog, user_id, course_id],
    () => {
      res.json({ message: "Progress updated", progress: prog });
    }
  );
});
// ================= UPDATE RATING =================
app.patch("/enrollments/rating", (req, res) => {
  const { user_id, course_id, rating } = req.body;

  db.query(
    "UPDATE enrollments SET rating=? WHERE user_id=? AND course_id=?",
    [rating, user_id, course_id],
    () => {
      res.json({ message: "Rating saved" });
    }
  );
});
// ================= CERTIFICATE PDF =================
app.get("/enrollments/:userId/:courseId/certificate", (req, res) => {
  const { userId, courseId } = req.params;

  const query = `
    SELECT u.name AS user, c.title AS course, e.progress 
    FROM enrollments e
    JOIN users u ON e.user_id=u.id
    JOIN courses c ON e.course_id=c.id
    WHERE e.user_id=? AND e.course_id=?
  `;

  db.query(query, [userId, courseId], (err, rows) => {
    if (!rows.length)
      return res.status(404).json({ error: "Enrollment not found" });

    if (rows[0].progress < 100)
      return res.status(400).json({ error: "Course not completed yet" });

    const doc = new PDFDocument();
    const filename = `certificate_${Date.now()}.pdf`;

    res.setHeader("Content-disposition", `attachment; filename=${filename}`);
    res.setHeader("Content-type", "application/pdf");

    doc.fontSize(24).text("Certificate of Completion", { align: "center" });
    doc.moveDown();

    doc.fontSize(16).text(`This certifies that ${rows[0].user}`);
    doc.moveDown();

    doc.fontSize(16).text(
      `has successfully completed the course "${rows[0].course}".`
    );

    doc.end();
    doc.pipe(res);
  });
});
// ================= GET ALL COURSES =================
app.get("/courses", (req, res) => {
  const sql = "SELECT * FROM courses";

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching courses:", err);
      return res.status(500).json({ error: "Database error fetching courses" });
    }

    res.json(rows);
  });
});
// ================= ADMIN VIEW ALL ENROLLMENTS =================
app.get("/admin/enrollments", (req, res) => {
  const sql = `
    SELECT 
      e.id AS enrollment_id,
      u.id AS user_id,
      u.name AS student_name,
      u.email AS student_email,
      c.id AS course_id,
      c.title AS course_title,
      c.instructor,
      c.category,
      e.progress,
      e.rating,
      e.created_at
    FROM enrollments e
    JOIN users u ON e.user_id = u.id
    JOIN courses c ON e.course_id = c.id
    ORDER BY e.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Admin enrollment fetch error:", err);
      return res.status(500).json({ error: "DB error fetching enrollments" });
    }

    res.json(rows);
  });
});


// ================= SERVER START =================
app.listen(5000, () =>
  console.log("🚀 Backend running at http://localhost:5000")
);
