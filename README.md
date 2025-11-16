
# 🎓 Online Course Platform

A full-stack web application that allows **admins** to create courses and **students** to browse, enroll, and view their enrolled courses.
Built using **React.js (Frontend)** + **Node.js + Express.js (Backend)** + **MySQL (Database)**.

---

## 🚀 Features

### 👨‍🏫 **Admin Features**

* Add new courses
* Manage all courses
* Secure login with admin role
* (Optional) View all user enrollments (if enabled later)

### 🎓 **Student Features**

* Browse all available courses
* Enroll into any course
* View **My Enrolled Courses**
* Secure registration and login

### 🌐 General Features

* Fully responsive UI
* Protected routes
* Clean dashboard for students & admin
* Fixed top navigation bar
* MySQL relational database with foreign keys

---

## 🛠️ Tech Stack

### **Frontend**

* React.js
* Axios
* React Router
* CSS-in-JS (Inline Styling)

### **Backend**

* Node.js
* Express.js
* MySQL2
* dotenv
* CORS enabled

### **Database**

* MySQL
* Tables:

  * `users`
  * `courses`
  * `enrollments`

---

## 📂 Project Structure

```
online-course-platform/
│── backend/
│   ├── server.js
│   ├── db.js
│   ├── package.json
│   └── .env
│
│── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Home.jsx
    │   │   ├── Login.jsx
    │   │   ├── Signup.jsx
    │   │   ├── CourseList.jsx
    │   │   ├── EnrolledCourses.jsx
    │   │   └── AddCourseForm.jsx
    │   ├── App.js
    │   ├── api.js
    │   └── index.js
    └── package.json
```

---

## 🧰 Installation & Setup

### ➤ 1. Clone the Repository

```sh
git clone https://github.com/your-username/online-course-platform.git
cd online-course-platform
```

---

## ⚙️ Backend Setup

### ➤ 2. Go to backend

```sh
cd backend
```

### ➤ 3. Install dependencies

```sh
npm install
```

### ➤ 4. Configure `.env`

Create `.env` file:

```
DB_HOST=localhost
DB_USER=root
DB_PASS=yourpassword
DB_NAME=online_course_platform
PORT=5000
```

### ➤ 5. Run SQL script

Import the SQL provided in `database.sql`:

```sql
CREATE DATABASE online_course_platform;
USE online_course_platform;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100),
  email VARCHAR(100) UNIQUE,
  password VARCHAR(255),
  role ENUM('admin', 'user') DEFAULT 'user'
);

CREATE TABLE courses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(200),
  description TEXT,
  instructor VARCHAR(100),
  youtube_link VARCHAR(255)
);

CREATE TABLE enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT,
  course_id INT,
  FOREIGN KEY (user_id) REFERENCES users(id),
  FOREIGN KEY (course_id) REFERENCES courses(id)
);

INSERT INTO users (name, email, password, role)
VALUES ('Admin', 'admin09@gmail.com', 'adminpass', 'admin');
```

### ➤ 6. Start backend server

```sh
npm start
```

---

## 🎨 Frontend Setup

### ➤ 7. Open another terminal → Go to frontend

```sh
cd frontend
```

### ➤ 8. Install dependencies

```sh
npm install
```

### ➤ 9. Start the frontend

```sh
npm start
```

---

## 🔌 API Endpoints

### 🔐 Authentication

| Method | Endpoint  | Description   |
| ------ | --------- | ------------- |
| POST   | `/signup` | Register user |
| POST   | `/login`  | Login user    |

### 📚 Courses

| Method | Endpoint   | Description                 |
| ------ | ---------- | --------------------------- |
| GET    | `/courses` | Get all courses             |
| POST   | `/courses` | Add new course (Admin only) |

### 🎯 Enrollments

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| POST   | `/enroll`           | Enroll user in a course        |
| GET    | `/enrolled/:userId` | Get student’s enrolled courses |

## 🤝 Contributing

Pull requests are welcome!
For major changes, please open an issue first.


## 📝 License

This project is licensed under the MIT License.

---



Just tell me!
# online_course_platform
