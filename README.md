# Student Management System (EduAdmin)

## 📌 Project Overview
The **Student Management System (EduAdmin)** is a modern, full-stack web application designed to efficiently manage student records, courses, and administrative users. Built with a stunning, premium glassmorphic UI, it provides a seamless user experience for administrators to register, authenticate, and securely manage educational data. 

## 💻 Tech Stack
This project leverages a robust and scalable architecture:
- **Frontend**: [Next.js](https://nextjs.org/) (React), Tailwind CSS (for modern dark-mode glassmorphic styling).
- **Backend**: [Spring Boot](https://spring.io/projects/spring-boot) (Java), Spring Data JPA, Spring Web.
- **Database**: [Supabase](https://supabase.com/) (PostgreSQL) for secure and reliable relational data storage.

## ✨ Features
- **User Authentication**: Secure Registration and Login flow handling with simulated JWT architecture and beautifully designed glassmorphic UIs.
- **Premium Dashboard**: A real-world SaaS-like dashboard featuring live statistical overviews, quick actions, and dynamic SVG iconography.
- **Student CRUD**: Complete capability to Create, Read, Update, and Delete student records directly connected to the Spring Boot backend.
- **Course Management**: Interface to view and manage available curriculum courses.
- **Modern UI/UX**: State-of-the-art interface design featuring `backdrop-blur`, ambient glowing blobs, interactive hover states, and smooth animated feedback alerts.

## 🚀 Getting Started

Follow these step-by-step instructions to run the project locally on your machine.

### Prerequisites
- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [Java Development Kit (JDK)](https://www.oracle.com/java/technologies/downloads/) (v17 or higher)
- [Maven](https://maven.apache.org/) (or use the included Maven wrapper)
- A Supabase PostgreSQL database URL (configured in the backend properties).

---

### 1. Running the Backend (Spring Boot)

1. Open a terminal and navigate to the backend directory:
   ```bash
   cd student-backend
   ```
2. Ensure your `src/main/resources/application.properties` is correctly configured with your Supabase PostgreSQL credentials.
3. Build and run the application using Maven:
   ```bash
   # Windows
   mvnw.cmd spring-boot:run

   # Mac/Linux
   ./mvnw spring-boot:run
   ```
4. The backend server will start on `http://localhost:8081`.

---

### 2. Running the Frontend (Next.js)

1. Open a new terminal window and navigate to the frontend directory:
   ```bash
   cd student-frontend
   ```
2. Install the necessary Node dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Open your browser and navigate to `http://localhost:3000`. You will be greeted by the Login page!

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome! Feel free to check the issues page if you want to contribute.

## 📝 License
This project is open-source and available for educational purposes.
