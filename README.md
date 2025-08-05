# 📅 Ementora Calendar & Notification System

This is a full-stack calendar application developed for the **Ementora Internship Project**. It includes:

- A **Node.js backend** to manage and serve event data
- A **vanilla JavaScript frontend** to display a calendar interface

---

## 🗂 Project Structure

```
EMENTORA-CALENDAR/
├── backend/
│   ├── events.json        # JSON file acting as local data storage
│   └── server.js          # Backend API and server logic (Node.js + Express)
├── public/
│   ├── index.html         # Main web page
│   ├── script.js          # Frontend logic (UI interactions, fetch calls)
│   └── styles.css         # App styling
├── package.json           # Project metadata and dependencies
├── package-lock.json      # Locked versions of dependencies
└── README.md              # Project documentation
```

---

## 🚀 How to Run the Project

### 1. Clone the repository

```bash
git clone https://github.com/palrajdeep02/Calendar-App-.git
cd Calendar-App-
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start the backend server

```bash
node backend/server.js
```

By default, the backend runs at:  
📍 `http://localhost:3000`

This server serves both the frontend and the backend API.

### 4. Open the App

Once the server is running, visit:  
🌐 `http://localhost:3000`  
in your browser to view the calendar UI.

---

## 🔧 Backend API

The backend uses a JSON file (`events.json`) to simulate a database.

Endpoints might include:

- `GET /api/events` – fetch all events
- `POST /api/events` – add a new event
- `DELETE /api/events/:id` – delete an event

*(Adjust depending on your server.js setup.)*

---

## 📌 Features

- View events in a calendar layout
- Add, remove, or filter events
- Backend stores event data in JSON format
- Easy to extend with notifications or authentication

---

## 📦 Technologies Used

- **Frontend**: HTML, CSS, JavaScript
- **Backend**: Node.js, Express
- **Storage**: Local JSON file

---

## 🧠 Developed For

🎓 **Ementora Internship Assignment** – Calendar & Notification System

---

## 📅 Last Updated

August 05, 2025
