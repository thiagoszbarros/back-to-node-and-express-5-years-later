# API Node Express

This is a RESTful API built with Node.js and Express. It provides authentication and CRUD operations for managing places. The API is structured with modular routes and middleware for authentication and global exception handling.

## Purpose

The main purpose of this application is to provide a backend API for user authentication and management of places, with secure access to protected resources.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set environment variables:**
   Create a `.env` file and set the `PORT` variable if you want to use a custom port.
3. **Run the server:**
   ```sh
   npm start
   ```
   The server will run on `http://localhost:3000` by default.

## Routes

### Base Route
- `GET /`
  - Returns: `hello world`

### API Base Route
- `GET /api`
  - Returns: `api base route`

### Authentication
- `POST /api/register`
  - Registers a new user.
  - Body: `{ username, password, ... }`
  - Returns: User data or error.

- `POST /api/login`
  - Authenticates a user.
  - Body: `{ username, password }`
  - Returns: Auth token or error.

### Places (Protected, requires authentication)
- `GET /api/places`
  - Returns a list of places.

- `GET /api/places/:id`
  - Returns details of a specific place by ID.

- `POST /api/places`
  - Creates a new place.
  - Body: Place data.

- `PUT /api/places/:id`
  - Updates an existing place by ID.
  - Body: Updated place data.

- `DELETE /api/places/:id`
  - Deletes a place by ID.

## Middleware
- **Authentication Middleware:** Protects the `/api/places` routes.
- **Global Exception Handler:** Handles errors and exceptions globally.

## Project Structure
```
server.js
app/
  middlewares/
    auth.midleware.js
    global-exception-handler.midleware.js
  modules/
    auth/
      auth.routes.js
      auth.service.js
    mongodb/
      mongodb.service.js
    places/
      places.routes.js
      places.schema.js
      places.service.js
    users/
      users.schema.js
  routes/
    api.js
```

## License
MIT
