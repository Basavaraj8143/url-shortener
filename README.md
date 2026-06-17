# URL Shortener — Placement-Focused Java Project Roadmap

## Goal

Build a production-ready URL Shortener using:

* Java
* Spring Boot
* MySQL
* JPA
* JWT
* Redis
* Docker

while learning industry backend practices.

**Estimated Duration:** 12–14 Days

---

# Phase 0 — Foundation Check (1 Day)

Before starting, make sure you know:

## Java

* Classes & Objects
* Constructors
* Inheritance
* Interfaces
* Exception Handling
* Collections (ArrayList, HashMap)

## Database

* CREATE
* INSERT
* SELECT
* UPDATE

## Tools

* Git
* Maven

**Deliverable:** Small Java program using OOP + HashMap pushed to GitHub.

---

# Phase 1 — Spring Boot Setup (Day 1)

Create project from Spring Initializr.

## Dependencies

* Spring Web
* Spring Data JPA
* MySQL Driver
* Lombok
* Validation

## Project Structure

```text
src/main/java

controller/
service/
repository/
entity/
dto/
exception/
config/
```

## Goal

* Spring Boot application starts successfully
* Connected to MySQL database
* Basic project structure created

---

# Phase 2 — Core URL Shortener API (Days 2–4)

## Entity

### Url

```java
id
longUrl
shortCode
createdAt
```

## APIs

### Create Short URL

```http
POST /api/urls
```

Request:

```json
{
  "longUrl":"https://leetcode.com"
}
```

Response:

```json
{
  "shortCode":"abc123"
}
```

---

### Redirect

```http
GET /{shortCode}
```

Returns original URL.

---

### Get All URLs

```http
GET /api/urls
```

---

### Delete URL

```http
DELETE /api/urls/{id}
```

## Concepts Learned

* REST API
* DTO
* JPA Repository
* Validation
* Layered Architecture

## Deliverable

Working URL shortener with database persistence.

---

# Phase 3 — Production Features (Days 5–7)

## Click Analytics

Add field:

```java
clickCount
```

Increase count on every redirect.

---

## Expiry Links

Example:

```text
Expires after 7 days
```

Prevent access after expiry.

---

## Custom Alias

User can create:

```text
/myresume
```

instead of:

```text
/x8s9kd
```

---

## Analytics API

```http
GET /api/urls/{id}/stats
```

Response:

```json
{
  "clicks":120,
  "createdAt":"...",
  "expiresAt":"..."
}
```

## Deliverable

Feature-rich URL Shortener.

---

# Phase 4 — Authentication (Days 8–9)

## Dependencies

* Spring Security
* JWT

## APIs

### Register

```http
POST /register
```

### Login

```http
POST /login
```

## Features

Users can:

* Create URLs
* View their URLs
* Delete only their URLs

## Concepts Learned

* Spring Security
* JWT Authentication
* BCrypt Password Hashing
* Authorization

## Deliverable

Secure multi-user URL shortener.

---

# Phase 5 — Redis Caching (Days 10–11)

## Problem

Every redirect currently hits MySQL.

## Solution

Redis Cache.

### Cache Flow

```text
Client
 ↓
Redis
 ↓
MySQL
```

### Logic

```text
Check Redis

If found
    Return

Else
    Fetch MySQL
    Store in Redis
    Return
```

## Deliverable

Faster redirects and reduced database load.

---

# Phase 6 — Docker + Deployment (Days 12–13)

## Docker

Create:

```text
Dockerfile
docker-compose.yml
```

## Services

```text
Spring Boot
MySQL
Redis
```

Run:

```bash
docker compose up
```

---

## Deployment

Deploy on:

* Railway
* Render

Configure environment variables:

```text
DB_URL
DB_USERNAME
DB_PASSWORD
JWT_SECRET
REDIS_HOST
```

## Deliverable

Live public URL Shortener.

---

# Phase 7 — Interview Preparation (Day 14)

## Prepare Answers For

### How are short codes generated?

Version 1:

```text
UUID
```

Version 2:

```text
Base62 Encoding
```

---

### Why Redis?

```text
Reduce database load
Improve redirect speed
```

---

### How would you scale to millions of URLs?

Topics:

* Caching
* Load Balancer
* Database Replication
* Sharding
* CDN

---

### How do you prevent duplicate short codes?

* Unique database constraint
* Retry with a new generated code

---

# Final Architecture

```text
Client
   |
   v
Spring Boot API
   |
   +---- Redis Cache
   |
   +---- MySQL Database
```

---

# GitHub Milestones

## Milestone 1

```text
Basic CRUD + Redirect
```

## Milestone 2

```text
Analytics + Expiry + Alias
```

## Milestone 3

```text
JWT Authentication
```

## Milestone 4

```text
Redis + Docker
```

## Milestone 5

```text
Live Deployment
```

---

# Resume Bullet

Built a URL Shortener using Java, Spring Boot, MySQL, Redis, and Docker.

Implemented custom aliases, click analytics, expiration-based URLs, and JWT authentication.

Optimized redirect performance using Redis cache-aside strategy and deployed the application to a cloud platform.

Designed a scalable architecture supporting efficient URL lookup and future horizontal scaling.
