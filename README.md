# DDD-Forum

A forum application built using Domain-Driven Design principles. This project is an assignment
for [The Software Essentialist](https://www.essentialist.dev/products/the-software-essentialist/categories/2154344011/posts/2176645473)
course.

## Project Structure

The project consists of two main components:

- **Backend**: A Node.js application with Express, TypeScript, and Prisma ORM
- **Frontend**: A React application with TypeScript

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Docker and Docker Compose (for running the database)

### Backend

The backend is located in the `backend` directory.

#### Database Setup

Before starting the backend, you need to start the PostgreSQL database using Docker Compose:

```bash
cd backend
docker-compose up -d
```

This will start a PostgreSQL database in a Docker container. The database will be accessible on port 5432.

#### Development Mode

To start the backend in development mode:

```bash
cd backend
npm install
npm run start:dev
```

This will start the server using nodemon, which will automatically restart the server when changes are detected.

The server will run on port 3030 by default. You can change this by setting the `PORT` environment variable.

#### Production Mode

To start the backend in production mode:

```bash
cd backend
npm install
npm run build
npm start
```

This will compile the TypeScript code to JavaScript and then start the server.

### Frontend

The frontend is located in the `frontend` directory.

#### Development Mode

To start the frontend in development mode:

```bash
cd frontend
npm install
npm start
```

This will start the React development server, which will automatically open a browser window with the application.

The development server will run on port 3000 by default.

#### Production Mode

To build the frontend for production:

```bash
cd frontend
npm install
npm run build
```

This will create a production-ready build in the `build` directory, which can be served using any static file server.

## Running the Complete Application

To run the complete application, you need to start the database, backend, and frontend:

1. Start the PostgreSQL database using Docker Compose (as described in the Database Setup section)
2. Start the backend in either development or production mode
3. Start the frontend in either development or production mode

The frontend will communicate with the backend API running on port 3030.

## Course Assignment

This project is an assignment
for [The Software Essentialist](https://www.essentialist.dev/products/the-software-essentialist/categories/2154344011/posts/2176645473)
course.
