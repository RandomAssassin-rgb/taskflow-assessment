# TaskFlow API Documentation

This document describes the REST API endpoints provided by the TaskFlow Node.js/Express backend. 

All endpoints (except `register` and `login`) require authentication via a JSON Web Token (JWT). Send the token in the Authorization header:
`Authorization: Bearer <your_jwt_token>`

## Global Response Format

The API standardizes its responses as follows:

**Success Response:**
```json
{
  "success": true,
  "data": { ... } // or an array
}
```

**Error Response:**
```json
{
  "success": false,
  "message": "Error description",
  "errors": [] // Optional array of specific validation errors
}
```

---

## Authentication

### 1. Register
- **Method:** `POST`
- **URL:** `/api/auth/register`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "full_name": "John Doe",
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response:** `201 Created`
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "john@example.com", "full_name": "John Doe" },
      "token": "jwt_token_string"
    }
  }
  ```

### 2. Login
- **Method:** `POST`
- **URL:** `/api/auth/login`
- **Auth Required:** No
- **Request Body:**
  ```json
  {
    "email": "john@example.com",
    "password": "securepassword123"
  }
  ```
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "user": { "id": "uuid", "email": "john@example.com", "full_name": "John Doe" },
      "token": "jwt_token_string"
    }
  }
  ```

### 3. Get Current User
- **Method:** `GET`
- **URL:** `/api/auth/me`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": { "id": "uuid", "email": "john@example.com", "full_name": "John Doe" }
  }
  ```

### 4. Logout
- **Method:** `POST`
- **URL:** `/api/auth/logout`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": { "message": "Logged out successfully" }
  }
  ```

---

## Projects

### 1. Get All Projects
- **Method:** `GET`
- **URL:** `/api/projects`
- **Auth Required:** Yes
- **Query Parameters:**
  - `search` (string): Search by project name.
  - `status` (string): Filter by status (`NOT_STARTED`, `IN_PROGRESS`, `COMPLETED`).
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": [
      {
        "id": "uuid",
        "name": "Project Name",
        "description": "Project Description",
        "status": "IN_PROGRESS",
        "start_date": "2023-10-01T00:00:00.000Z",
        "end_date": "2023-10-31T00:00:00.000Z",
        "_count": { "tasks": 5 }
      }
    ]
  }
  ```

### 2. Get Project by ID
- **Method:** `GET`
- **URL:** `/api/projects/:id`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "id": "uuid",
      "name": "Project Name",
      "tasks": [ ... ] 
    }
  }
  ```

### 3. Create Project
- **Method:** `POST`
- **URL:** `/api/projects`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "name": "New Project",
    "description": "Optional description",
    "status": "NOT_STARTED",
    "start_date": "2023-10-01T00:00:00.000Z",
    "end_date": "2023-10-31T00:00:00.000Z"
  }
  ```
- **Success Response:** `201 Created`

### 4. Update Project
- **Method:** `PUT`
- **URL:** `/api/projects/:id`
- **Auth Required:** Yes
- **Request Body:** Any valid project fields.
- **Success Response:** `200 OK`

### 5. Delete Project
- **Method:** `DELETE`
- **URL:** `/api/projects/:id`
- **Auth Required:** Yes
- **Success Response:** `200 OK`

---

## Tasks

### 1. Get All Tasks
- **Method:** `GET`
- **URL:** `/api/tasks`
- **Auth Required:** Yes
- **Query Parameters:**
  - `projectId` (string): Filter by project ID.
  - `search` (string): Search by task name.
  - `status` (string): Filter by task status.
  - `priority` (string): Filter by task priority.
- **Success Response:** `200 OK`

### 2. Get Task by ID
- **Method:** `GET`
- **URL:** `/api/tasks/:id`
- **Auth Required:** Yes
- **Success Response:** `200 OK`

### 3. Create Task
- **Method:** `POST`
- **URL:** `/api/tasks`
- **Auth Required:** Yes
- **Request Body:**
  ```json
  {
    "project_id": "uuid",
    "name": "Task Name",
    "description": "Task description",
    "priority": "HIGH",
    "status": "PENDING",
    "due_date": "2023-10-15T00:00:00.000Z"
  }
  ```
- **Success Response:** `201 Created`

### 4. Update Task
- **Method:** `PUT`
- **URL:** `/api/tasks/:id`
- **Auth Required:** Yes
- **Request Body:** Any valid task fields.
- **Success Response:** `200 OK`

### 5. Delete Task
- **Method:** `DELETE`
- **URL:** `/api/tasks/:id`
- **Auth Required:** Yes
- **Success Response:** `200 OK`

---

## Dashboard

### 1. Get Dashboard Metrics
- **Method:** `GET`
- **URL:** `/api/dashboard`
- **Auth Required:** Yes
- **Success Response:** `200 OK`
  ```json
  {
    "success": true,
    "data": {
      "totalProjects": 5,
      "totalTasks": 25,
      "completedTasks": 10,
      "pendingTasks": 10,
      "projectsInProgress": 3
    }
  }
  ```
