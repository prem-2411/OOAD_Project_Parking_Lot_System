# 🚗 Full-Stack Parking Lot Management System

A comprehensive, full-stack Parking Lot Management System built with **Spring Boot** (Java backend), **React** (Vite frontend), and **MySQL** (Dockerized).

This application allows for efficient management of a parking lot, covering everything from parking a new vehicle, searching for it, unparking it, to a full-featured admin dashboard to oversee metrics and configurations.

## ✨ Features
* **Park Vehicle:** Quickly assign incoming vehicles to an optimal parking slot.
* **Unpark Vehicle:** Process vehicle exit, calculate time spent, and free up the slot.
* **Search Vehicle:** Look up any currently parked vehicle by its license plate.
* **Admin Dashboard:** Access real-time data on capacity, current occupancy, and slot assignments.
* **Full-stack Architecture:** Robust Spring Boot backend seamlessly integrated with a modern React SPA.

## 🛠 Tech Stack
* **Backend:** Java 17+, Spring Boot, Spring Data JPA, Maven
* **Frontend:** React 18, Vite, React Router
* **Database:** MySQL 8 
* **Infrastructure:** Docker & Docker Compose

---

## 🚀 Getting Started

To run this application locally, you will need 3 components running simultaneously: the Database, the Backend, and the Frontend.

### Prerequisites
* [Docker Desktop](https://www.docker.com/products/docker-desktop/) installed & running
* [Java 17](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html) or higher installed
* [Node.js](https://nodejs.org/) (v18+) installed

### 1. Start the Database (MySQL)
The database is containerized via Docker for easy setup.
Open a terminal in the root directory and run:
```bash
docker compose up -d
```
*This starts a MySQL instance mapped to port `3306` with the username `user` and password `password`.*

### 2. Start the Backend (Spring Boot)
In the root directory, use the Maven wrapper to start the backend server:
```bash
# On Mac/Linux
./mvnw spring-boot:run

# On Windows
mvnw.cmd spring-boot:run
```
*The backend server will start on `http://localhost:8080`.*

### 3. Start the Frontend (React / Vite)
Open a **new terminal window**, navigate to the `frontend` project folder, and start the Vite development server:
```bash
cd frontend
npm install
npm run dev
```
*The frontend application will start on `http://localhost:5173` (or the port specified by Vite).*

## 📖 API Integration 
The React frontend communicates with the backend via REST endpoints. All standard fetch logic is handled dynamically in `frontend/src/api.js`. Cross-Origin Resource Sharing (CORS) is enabled on the backend to accept requests from the frontend app.

## 🤝 Contributing
1. Fork the repo.
2. Create a new branch (`git checkout -b feature/NewFeature`).
3. Commit your changes (`git commit -m 'Add NewFeature'`).
4. Push to the branch (`git push origin feature/NewFeature`).
5. Open a Pull Request.
