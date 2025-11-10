# CPDLC System

A web-based simulation of a Controller-Pilot Data Link Communications (CPDLC) system. This application allows users to register as pilots or air traffic controllers and communicate with each other through a simple messaging interface.

## Technologies Used

- **Backend:**
  - Python
  - Flask
  - MongoDB
  - Flask-JWT-Extended for authentication
- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6)
  - webpack

## Project Structure

```
CPDLC/
├── src/
│   ├── backend/
│   │   ├── app/
│   │   │   ├── __init__.py
│   │   │   ├── models/
│   │   │   ├── routes/
│   │   │   └── ...
│   │   ├── run.py
│   │   └── requirements.txt
│   └── frontend/
│       ├── src/
│       │   ├── components/
│       │   ├── services/
│       │   ├── index.js
│       │   ├── login.js
│       │   └── register.js
│       ├── index.html
│       ├── login.html
│       ├── register.html
│       ├── webpack.config.js
│       └── package.json
└── README.md
```

## Setup and Running the Project

### Prerequisites

- Python 3.x
- Node.js and npm
- MongoDB

### Backend Setup

1.  **Navigate to the backend directory:**
    ```bash
    cd src/backend
    ```
2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```
3.  **Set up environment variables:**
    Create a `.env` file in the `src/backend` directory and add the following variables:
    ```
    MONGODB_URI=mongodb://localhost:27017/cpdlc
    SECRET_KEY=your-secret-key
    JWT_SECRET_KEY=your-jwt-secret-key
    ```
4.  **Run the backend server:**
    ```bash
    python run.py
    ```
    The backend server will be running on `http://localhost:3000`.

### Frontend Setup

1.  **Navigate to the frontend directory:**
    ```bash
    cd src/frontend
    ```
2.  **Install Node.js dependencies:**
    ```bash
    npm install
    ```
3.  **Run the frontend development server:**
    ```bash
    npm start
    ```
    The frontend application will be accessible at `http://localhost:8081`.

## API Documentation

### Authentication

-   **`POST /api/auth/register`**
    -   Registers a new user.
    -   **Request Body:**
        ```json
        {
            "username": "testuser",
            "email": "test@example.com",
            "password": "password",
            "role": "pilot"
        }
        ```
-   **`POST /api/auth/login`**
    -   Logs in a user and returns a JWT token.
    -   **Request Body:**
        ```json
        {
            "username": "testuser",
            "password": "password"
        }
        ```

### Messaging

-   **`POST /api/messages/send`**
    -   Sends a message to another user.
    -   Requires a valid JWT token in the `Authorization` header.
    -   **Request Body:**
        ```json
        {
            "recipient": "recipient_username",
            "content": "This is a test message.",
            "type": "clearance"
        }
        ```
-   **`GET /api/messages/history`**
    -   Retrieves the message history for the authenticated user.
    -   Requires a valid JWT token in the `Authorization` header.