# Day 3 - First End-to-End REST API

## Objective

Build the first complete backend feature that accepts an HTTP request, processes business logic, and stores data in MySQL.

---

# Controller Layer Created

Created:

```java
UrlController
```

Purpose:

Acts as the entry point for client requests.

Responsibilities:

* Receive HTTP requests
* Validate and parse request data
* Delegate business logic to the Service layer
* Return API responses

---

# Spring MVC Annotations Learned

## @RestController

```java
@RestController
```

Purpose:

Marks the class as a REST API controller.

Effect:

* Handles HTTP requests
* Returns JSON responses automatically

---

## @RequestMapping

```java
@RequestMapping("/api/urls")
```

Purpose:

Defines the base URL for all endpoints inside the controller.

Example:

```text
/api/urls
```

---

## @PostMapping

```java
@PostMapping
```

Purpose:

Maps HTTP POST requests to a controller method.

Endpoint:

```http
POST /api/urls
```

---

## @RequestBody

```java
@RequestBody ShortenRequest request
```

Purpose:

Automatically converts incoming JSON into a Java object.

Example:

Input JSON

```json
{
  "longUrl":"https://leetcode.com"
}
```

Converted Into:

```java
ShortenRequest request
```

---

# Dependency Injection in Controller

Used constructor injection:

```java
public UrlController(UrlService urlService)
```

Purpose:

Spring automatically provides the UrlService object.

Benefits:

* Loose coupling
* Better testing support
* Recommended Spring practice

---

# First Working API

## Endpoint

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

(Note: actual short code is randomly generated.)

---

# Complete Request Flow

Successfully implemented the first full backend request cycle.

```text
Client (Postman)
        ↓
UrlController
        ↓
UrlService
        ↓
UrlRepository
        ↓
MySQL Database
```

---

# Database Verification

Verified that records are successfully inserted into MySQL.

Executed:

```sql
SELECT * FROM urls;
```

Observed:

* id generated automatically
* long_url stored correctly
* short_code generated and saved
* created_at stored successfully

---

# Concepts Learned

## Spring MVC

Understanding:

Spring MVC handles routing HTTP requests to controller methods.

---

## Controller Layer

Purpose:

Separates request handling from business logic.

---

## Dependency Injection

Understanding:

Objects are provided by Spring instead of being manually created.

---

## JSON Serialization / Deserialization

Spring automatically converts:

```text
JSON ↔ Java Objects
```

using Jackson.

---

## End-to-End Backend Flow

Understanding:

```text
Request
 ↓
Controller
 ↓
Service
 ↓
Repository
 ↓
Database
 ↓
Response
```

This architecture is used in most Spring Boot applications.

---

# Current Project Status

```text
[✓] Spring Boot Setup
[✓] Package Structure
[✓] MySQL Configuration
[✓] Url Entity
[✓] Automatic Table Creation
[✓] UrlRepository
[✓] DTO Layer
[✓] UrlService
[✓] UrlController
[✓] POST /api/urls API
[✓] Database Insert Working

[ ] GET /{shortCode}
[ ] Redirect Logic
[ ] Custom Exception Handling
[ ] Validation
[ ] Click Analytics
[ ] Expiry Links
[ ] JWT Authentication
[ ] Redis Cache
[ ] Docker
[ ] Deployment
```

---

# Biggest Achievement Today

Built the first complete backend feature.

A user can now:

1. Send an HTTP request.
2. Trigger Spring Controller logic.
3. Execute business logic.
4. Save data into MySQL.
5. Receive a JSON response.

This is the first fully functional feature of the URL Shortener project.
