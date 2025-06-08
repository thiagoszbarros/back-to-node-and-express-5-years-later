# API Node Express

This is a RESTful API built with Node.js and Express. It provides authentication and CRUD operations for managing users and places. The API is structured with modular routes and middleware for authentication, role-based access, and global exception handling.

## Purpose

The main purpose of this application is to provide a backend API for user authentication, user management (with roles), and management of places, with secure access to protected resources.

## Getting Started

1. **Install dependencies:**
   ```sh
   npm install
   ```
2. **Set environment variables:**
   Create a `.env` file and set the `PORT`, `MONGO_URI`, and `JWT_SECRET` variables.
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
  - Returns: `{ message: 'Api base route' }`

### Authentication
- `POST /api/register`
  - Registers a new user (role defaults to USER).
  - Body: `{ username, password }`
  - Returns: Success message or error.

- `POST /api/login`
  - Authenticates a user.
  - Body: `{ username, password }`
  - Returns: Auth token (JWT with userId, username, and role) or error.

### Users (Protected, ADMIN only)
- `GET /api/users`
  - Returns a list of all users (excluding passwords).
  - Requires: Auth token (ADMIN role)

- `GET /api/users/:id`
  - Returns details of a specific user by ID (excluding password).
  - Requires: Auth token (ADMIN role)

- `POST /api/users`
  - Creates a new user.
  - Body: `{ username, password, role }`
  - Requires: Auth token (ADMIN role)
  - Validates role and required fields.

- `PUT /api/users/:id`
  - Updates an existing user's username and/or role by ID.
  - Body: `{ username?, role? }`
  - Requires: Auth token (ADMIN role)
  - Password cannot be updated here.
  - Validates role if provided.

- `DELETE /api/users/:id`
  - Deletes a user by ID.
  - Requires: Auth token (ADMIN role)

### Places (Protected, requires authentication)
- `GET /api/places`
  - Returns a list of places.
  - Requires: Auth token

- `GET /api/places/:id`
  - Returns details of a specific place by ID.
  - Requires: Auth token

- `POST /api/places`
  - Creates a new place.
  - Body: `{ name, address }`
  - Requires: Auth token

- `PUT /api/places/:id`
  - Updates an existing place by ID.
  - Body: `{ name, address }`
  - Requires: Auth token

- `DELETE /api/places/:id`
  - Deletes a place by ID.
  - Requires: Auth token

### Password Reset
- `POST /api/password/reset/request`
  - Request a password reset token for a user.
  - Body: `{ username }`
  - Returns: Success message (token is returned in response for testing; in production, it should be emailed).

- `POST /api/password/reset`
  - Reset a user's password using a valid reset token.
  - Body: `{ token, newPassword }`
  - Returns: Success message or error if token is invalid/expired.

## Middleware
- **Authentication Middleware:** Protects the `/api/places` and `/api/users` routes. Sets `req.user` with user info and role from JWT.
- **Admin Middleware:** Restricts `/api/users` routes to users with the `ADMIN` role.
- **Request Validation Middleware:** Validates user creation and update requests for required fields and valid roles.
- **Global Exception Handler:** Handles errors and exceptions globally.

## Project Structure
```
server.js
app/
  middlewares/
    admin.midleware.js
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
      create-user.request.js
      roles.js
      update-user.request.js
      users.routes.js
      users.schema.js
      users.service.js
  routes/
    api.js
```

## Roles
- `ADMIN`: Can manage users and places.
- `USER`: Can access places endpoints only.

## License
MIT
