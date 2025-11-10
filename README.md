# CPDLC System

A web-based simulation of a Controller-Pilot Data Link Communications (CPDLC) system. This application allows users to register as pilots or air traffic controllers and communicate with each other through a simple messaging interface.

## Features

-   User registration and authentication (Pilot or Air Traffic Controller).
-   Real-time messaging between pilots and controllers.
-   Message history tracking.
-   Responsive user interface with light and dark themes.

## Technologies Used

-   **Backend:**
    -   Python
    -   Flask
    -   MongoDB
    -   Flask-JWT-Extended for authentication
    -   Flask-Cors
    -   Bcrypt for password hashing
-   **Frontend:**
    -   HTML5
    -   CSS3
    -   JavaScript (ES6)
    -   Webpack for asset bundling
    -   Babel for JavaScript transpiling
-   **Database:**
    -   MongoDB

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

-   Python 3.x
-   Node.js and npm
-   MongoDB

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
    Create a `.env` file in the `src/backend` directory and add the following variables. Replace the placeholder values with your own.
    ```
    MONGODB_URI=mongodb://localhost:27017/cpdlc
    SECRET_KEY=your-super-secret-key
    JWT_SECRET_KEY=your-super-secret-jwt-key
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

**Note:** The backend and frontend servers must be running concurrently for the application to work correctly.

## Usage

1.  Open your web browser and navigate to `http://localhost:8081`.
2.  Register a new account as either a "Pilot" or "Controller".
3.  Log in with your new account.
4.  You will be redirected to the main application page where you can send and receive messages.
5.  Use the settings panel to switch between light and dark themes or to log out.

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
    -   **Success Response (201):**
        ```json
        {
            "message": "User created successfully"
        }
        ```
    -   **Error Response (400):**
        ```json
        {
            "error": "Username or email already exists"
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
    -   **Success Response (200):**
        ```json
        {
            "token": "your-jwt-token",
            "user": {
                "username": "testuser",
                "role": "pilot"
            }
        }
        ```
    -   **Error Response (401):**
        ```json
        {
            "error": "Invalid credentials"
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
            "message_type": "clearance"
        }
        ```
    -   **Success Response (201):**
        ```json
        {
            "message": "Message sent successfully"
        }
        ```
    -   **Error Response (404):**
        ```json
        {
            "error": "Recipient not found"
        }
        ```

-   **`GET /api/messages/history`**
    -   Retrieves the message history for the authenticated user.
    -   Requires a valid JWT token in the `Authorization` header.
    -   **Success Response (200):**
        ```json
        [
            {
                "sender": "testuser",
                "receiver": "atc",
                "content": "Requesting clearance to land.",
                "timestamp": "2023-10-27T10:00:00Z",
                "type": "request",
                "status": "sent"
            }
        ]
        ```

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue for any bugs or feature requests.
