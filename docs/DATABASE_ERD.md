# TaskFlow Database Entity-Relationship Diagram

This document contains the Entity-Relationship Diagram for the TaskFlow PostgreSQL database, designed with Prisma ORM.

## Entity-Relationship Diagram

```mermaid
erDiagram
    User ||--o{ Project : owns
    Project ||--o{ Task : contains

    User {
        String id PK "uuid"
        String full_name
        String email "unique"
        String password_hash
        DateTime created_at
        DateTime updated_at
    }

    Project {
        String id PK "uuid"
        String owner_id FK
        String name
        String description "nullable"
        ProjectStatus status "enum"
        DateTime start_date "nullable"
        DateTime end_date "nullable"
        DateTime created_at
        DateTime updated_at
    }

    Task {
        String id PK "uuid"
        String project_id FK
        String name
        String description "nullable"
        TaskPriority priority "enum"
        TaskStatus status "enum"
        DateTime due_date "nullable"
        DateTime created_at
        DateTime updated_at
    }
```

## Enumerations

**ProjectStatus**
- `NOT_STARTED`
- `IN_PROGRESS`
- `COMPLETED`

**TaskStatus**
- `PENDING`
- `IN_PROGRESS`
- `COMPLETED`

**TaskPriority**
- `LOW`
- `MEDIUM`
- `HIGH`
