# Text Editor App

A simple full-stack text editor application with a React frontend and an Express + MySQL backend.

## Features

- User signup and login
- Session persistence in local storage
- Create, edit, save, and delete documents
- Rich text editing with basic formatting controls
- Document list per user
- Export as HTML or TXT
- Account deletion

## Project Structure

- backend/ - Express server and MySQL integration
- frontend/ - React + Vite frontend
- README.md - project overview and setup instructions

## Tech Stack

Frontend:
- React
- Vite
- JavaScript

Backend:
- Node.js
- Express
- MySQL
- bcrypt

## Requirements

- Node.js installed
- MySQL server running
- A MySQL database created or configured

## Backend Setup

1. Open the backend folder:

```bash
cd backend
```

2. Create a .env file in the backend folder with your MySQL connection details, for example:
```
   HOST=localhost
   USER=root
   PASSWORD=your_mysql_password
   DATABASE=text_editor
```

3. Install dependencies:
```bash
npm install
```

4. Start the backend server:
```bash
node server.js
```

The backend runs on:

- http://localhost:3000

## Frontend Setup

1. Open the frontend folder:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend usually runs on:

- http://localhost:5173

## Database Notes

The backend creates tables automatically if they do not exist. The app expects a MySQL database configured in the backend .env file.

## Notes

- The frontend stores the logged-in user in browser local storage.
