# API Node Express

This is a RESTful API built with Node.js and Express. It provides authentication and CRUD operations for managing users and places. The API is structured with modular routes and middleware for authentication, role-based access, and global exception handling.

## Purpose

The main purpose of this application is to provide a backend API for user authentication, user management (with roles), and management of places, with secure access to protected resources.

## Test Coverage

```
--------------------|---------|----------|---------|---------|------------------
File                | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------|---------|----------|---------|---------|------------------
All files           |     100 |      100 |     100 |     100 |                  
 app/auth           |     100 |      100 |     100 |     100 |                  
  auth.service.js   |     100 |      100 |     100 |     100 |                  
 app/places         |     100 |      100 |     100 |     100 |                  
  places.service.js |     100 |      100 |     100 |     100 |                  
 app/users          |     100 |      100 |     100 |     100 |                  
  users.service.js  |     100 |      100 |     100 |     100 |                  
 domain/users       |     100 |      100 |     100 |     100 |                  
  roles.js          |     100 |      100 |     100 |     100 |                  
--------------------|---------|----------|---------|---------|------------------
Test Suites: 4 passed, 4 total
Tests:       29 passed, 29 total
Snapshots:   0 total
Time:        ~1 s
Ran all test suites.
```

The project is fully covered by automated tests. Coverage is generated using Jest and can be viewed in detail in the `coverage/lcov-report/index.html` file after running:

```sh
npm run coverage
```

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

## Logging Module

The project includes a flexible logging module that supports logging to both a file and MongoDB. You can configure the logging output using the `LOG_STACK` environment variable.

### Configuration

- **Environment Variable:**
  - `LOG_STACK`: Comma-separated values to select log outputs. Supported values: `file`, `mongodb`.
    - Example: `LOG_STACK=file,mongodb` (logs to both file and MongoDB)
    - Default: `file`

- **File Logging:**
  - Logs are written to `src/infraestructure/logs/app.log`.

- **MongoDB Logging:**
  - Logs are stored in the `Log` collection using the schema in `src/infraestructure/schemas/logs.schema.js`.
  - Requires MongoDB to be configured and running.

### Usage

You can log messages manually or use the built-in middlewares:

#### Manual Logging

Import and use the `logMessage` function:

```js
import { logMessage } from './src/infraestructure/logs/logger.js';

// Log an info message
logMessage(200, 'This is an info message');

// Log an error with metadata
logMessage(500, 'Something went wrong', { userId: '123', action: 'update' });
```

#### Automatic Logging

- **Request/Response Logging:**
  - The `requestResponseLogger` middleware logs all incoming requests and outgoing responses.
  - File: `src/infraestructure/middlewares/log-request-response.middeware.js`

- **Global Exception Logging:**
  - The `globalExceptionHandler` middleware logs all unhandled errors.
  - File: `src/infraestructure/middlewares/global-exception-handler.midleware.js`

### Log Levels

Supported log levels (see `src/infraestructure/logs/levels.js`):
- EMERGENCY, ALERT, CRITICAL, ERROR, WARNING, NOTICE, INFO, DEBUG

Log level is determined automatically based on HTTP status code, but you can specify it manually if needed.

## License
MIT
