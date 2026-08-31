# SkillSwap ML (MERN Stack Application)

## Overview
SkillSwap is a platform designed to connect individuals looking to exchange their skills. Built with the MERN stack (MongoDB, Express, React, Node.js), this application integrates machine learning recommendations to suggest ideal skill-swap matches. It features real-time chat, video calling, and a robust backend designed for scalability and performance.

## 🚀 Technical Architecture

### Frontend (Client-Side)
The frontend is a modern Single Page Application (SPA) built with React and Vite for blazing-fast development and build times.

*   **Core Framework**: React (v18)
*   **Build Tool**: Vite
*   **Styling**: Tailwind CSS for utility-first responsive design, Framer Motion for smooth animations, and FontAwesome/Lucide for icons.
*   **State Management**: Redux Toolkit for global state and predictable state transitions.
*   **Routing**: React Router DOM (v7).
*   **Real-time Communication**: 
    *   Socket.IO Client for real-time messaging and notifications.
    *   PeerJS for WebRTC-based peer-to-peer video/audio connections.
*   **Data Fetching**: Axios for REST API consumption.

### Backend (Server-Side)
The backend is a robust RESTful API built with Node.js and Express, designed to handle user authentication, matchmaking, and real-time communication.

*   **Core Framework**: Node.js with Express.js.
*   **Database**: MongoDB (via Mongoose ODM) for flexible schema design and data persistence.
*   **Authentication & Security**: JWT (JSON Web Tokens) for stateless authentication and bcryptjs for password hashing.
*   **Real-time Engine**: Socket.IO for real-time bi-directional event-based communication.
*   **Caching**: Redis for caching frequent queries and improving response times.
*   **File Storage**: Cloudinary (via multer-storage-cloudinary) for efficient media and image storage.
*   **Machine Learning Integration**: Built-in ML scripts (e.g., `trainRecommendationModel.js`) to generate and train user recommendation data.
*   **Background Jobs**: node-cron for scheduling periodic tasks.
*   **Email Services**: Nodemailer and Resend for transactional emails.
*   **Validation**: Zod and express-validator for robust data validation.

## 📂 Project Structure

```text
skillswap-ml/
├── backend/                  # Node.js / Express Server
│   ├── controllers/          # Request handlers and business logic
│   ├── middleware/           # Custom Express middlewares (Auth, Error handling)
│   ├── ml/                   # Machine learning models and training scripts
│   ├── models/               # Mongoose schemas and models
│   ├── routes/               # API endpoint definitions
│   ├── scripts/              # Utility scripts
│   ├── services/             # Third-party service integrations (Email, etc.)
│   ├── sockets/              # Socket.IO event handlers
│   ├── tests/                # Backend unit tests
│   ├── utils/                # Helper functions
│   ├── validators/           # Zod and express-validator schemas
│   ├── server.js             # Application entry point
│   └── package.json          # Backend dependencies and scripts
│
├── frontend/                 # React / Vite Client
│   ├── public/               # Static assets
│   ├── src/                  # React source code (Components, Pages, Services, Store)
│   ├── index.html            # Entry HTML file
│   ├── vite.config.js        # Vite configuration
│   └── package.json          # Frontend dependencies and scripts
│
└── README.md                 # Project documentation (this file)
```

## 🛠️ Setup and Installation

### Prerequisites
*   Node.js (v18 or higher recommended)
*   MongoDB instance (local or Atlas)
*   Redis server (local or cloud)

### Environment Variables
You will need to configure environment variables for both the frontend and backend.

**Backend (`backend/.env`)**
Create a `.env` file in the `backend` directory and add the necessary keys (e.g., `MONGO_URI`, `JWT_SECRET`, `CLOUDINARY_URL`, `REDIS_URL`, etc.).

**Frontend (`frontend/.env`)**
Create a `.env` file in the `frontend` directory and add the necessary keys (e.g., `VITE_API_BASE_URL`).

### Installation Steps

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd skillswap-ml
    ```

2.  **Install Backend Dependencies:**
    ```bash
    cd backend
    npm install
    ```

3.  **Install Frontend Dependencies:**
    ```bash
    cd ../frontend
    npm install
    ```

## 🚀 Running the Application

### Development Mode

**Start the Backend Server:**
```bash
cd backend
npm run dev
```
The server will start (default port `10000`) and connect to MongoDB.

**Start the Frontend Client:**
```bash
cd frontend
npm run dev
```
The frontend will be available at `http://localhost:5173`.

### Training the Machine Learning Model
To run the recommendation model training script:
```bash
cd backend
npm run ml:train
```

## 🧪 Testing
The backend includes a test suite. To run the tests:
```bash
cd backend
npm run test
```

## 📄 License
This project is licensed under the ISC License.
