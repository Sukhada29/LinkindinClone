# LinkedIn Clone

A full-stack social networking application inspired by LinkedIn, built with **Next.js, React, Node.js, Express, MongoDB, and Redux Toolkit**.

The application allows users to create accounts, authenticate using JWT, create posts, upload images, like and comment on posts, manage profiles, discover users, and send/accept connection requests.

## 🚀 Live Demo

**Frontend:**
https://linkindinclone-frontend.onrender.com

**Backend API:**
https://linkindinclone.onrender.com

> The backend is deployed separately from the frontend.

## ✨ Features

* User registration and login
* JWT-based authentication
* User profiles
* Edit profile information
* Discover other users
* Search users
* Send connection requests
* Accept or withdraw connection requests
* View connections
* Create posts
* Upload images with posts
* Like posts
* Comment on posts
* Delete posts
* View other users' profiles
* Responsive social-network style interface

## 🛠️ Tech Stack

### Frontend

* Next.js
* React
* Redux Toolkit
* Axios
* JavaScript
* CSS Modules

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* JWT
* bcrypt
* Multer
* CORS

### Deployment

* GitHub
* Render

## 📁 Project Structure

```text
LinkedInClone/
│
├── backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── app/
│   │   ├── Components/
│   │   ├── config/
│   │   ├── dashboard/
│   │   ├── discover/
│   │   ├── login/
│   │   ├── profile/
│   │   ├── search/
│   │   └── ...
│   ├── public/
│   └── package.json
│
├── .gitignore
├── package.json
└── README.md
```

## 🔐 Authentication

The application uses **JWT (JSON Web Tokens)** for authentication.

After successful login:

1. The backend validates the user's credentials.
2. A JWT is generated.
3. The token is stored on the client.
4. Protected API requests send the token using the `Authorization` header.

```text
Authorization: Bearer <token>
```

The backend authentication middleware verifies the token and makes the authenticated user's information available to protected controllers.

## ⚙️ Running Locally

### 1. Clone the repository

```bash
git clone https://github.com/Sukhada29/LinkindinClone.git
cd LinkindinClone
```

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` folder:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

Start the backend:

```bash
npm run dev
```

The backend will run locally on:

```text
http://localhost:9090
```

### 3. Frontend Setup

Open another terminal:

```bash
cd frontend
npm install
```

Create a `.env.local` file inside the `frontend` folder:

```env
NEXT_PUBLIC_API_URL=http://localhost:9090
```

Start the frontend:

```bash
npm run dev
```

The frontend will run on:

```text
http://localhost:3000
```

## 🌐 Deployment

The project is deployed using **Render**.

The frontend and backend are deployed as separate services.

```text
User
  │
  ▼
Next.js Frontend
  │
  │ API Requests
  ▼
Express.js Backend
  │
  ▼
MongoDB
```

## 🔑 Environment Variables

### Backend

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
```

### Frontend

```env
NEXT_PUBLIC_API_URL=your_backend_url
```

Environment files containing secrets are excluded from Git using `.gitignore`.

## 📌 Future Improvements

* Real-time messaging
* Notifications
* Profile picture upload improvements
* Better mobile responsiveness
* Real-time connection updates
* Advanced user search
* Post sharing
* Production-level error handling

## 👩‍💻 Author

**Sukhada Harsulkar**

B.Tech — Electronics and Telecommunication Engineering

GitHub: https://github.com/Sukhada29

## ⭐ Support

If you found this project interesting, consider giving the repository a ⭐ on GitHub.
