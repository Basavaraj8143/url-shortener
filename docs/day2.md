## Day 2

Created UrlRepository using JpaRepository.

Learned:

- Repository Pattern
- Spring Data JPA
- JpaRepository

Understanding:

Spring automatically provides CRUD methods such as:

save()
findAll()
findById()
deleteById()

without manually implementing them.

Created DTO layer:

- ShortenRequest
- ShortenResponse

Learned:

DTOs separate API request/response structures from database entities.
``
``
# Day 2 - Service Layer and DTOs

## Objective

Implement the business logic layer responsible for generating short URLs and saving them to the database.

---

## DTO Layer Created

### ShortenRequest

Purpose:

Represents data received from the client when creating a short URL.

Fields:

```java
String longUrl
```

Example Request:

```json
{
  "longUrl": "https://leetcode.com"
}
```

---

### ShortenResponse

Purpose:

Represents data returned to the client after URL shortening.

Fields:

```java
String shortCode
```

Example Response:

```json
{
  "shortCode": "abc123"
}
```

---

## Concepts Learned

### DTO (Data Transfer Object)

DTOs are used to transfer data between client and server.

Benefits:

* Separates API models from database entities
* Improves security
* Makes API changes easier
* Follows clean architecture principles

Flow:

```text
Client
 ↓
DTO
 ↓
Service
 ↓
Entity
 ↓
Database
```

---

## UrlService Created

Created:

```java
UrlService
```

Annotated with:

```java
@Service
```

Purpose:

Contains the application's business logic.

Responsibilities:

* Generate short codes
* Create Url objects
* Save URLs to database
* Return API responses

---

## Dependency Injection

Used constructor injection:

```java
public UrlService(UrlRepository urlRepository)
```

Spring automatically provides the UrlRepository object.

Benefits:

* Loose coupling
* Easier testing
* Recommended Spring practice

---

## UUID Based Short Code Generation

Implemented:

```java
UUID.randomUUID()
```

Example:

```text
8d7f2c
a3b9k1
x7d1ab
```

Current approach:

```java
UUID.randomUUID()
      .toString()
      .substring(0, 6)
```

Purpose:

Generate a temporary unique short code.

Note:

This is acceptable for the initial version.

Future improvements:

* Base62 Encoding
* Collision Detection
* Counter-Based Encoding

---

## Lombok Introduction

Added:

```java
@Getter
@Setter
```

Benefits:

Avoid manually writing:

```java
getLongUrl()
setLongUrl()
getShortCode()
setShortCode()
```

Lombok generates them automatically during compilation.

---

## Architecture Understanding

Current Flow:

```text
Client
   ↓
Controller (To Be Created)
   ↓
Service
   ↓
Repository
   ↓
MySQL Database
```

Current Progress:

```text
[✓] Spring Boot Setup
[✓] Package Structure
[✓] Url Entity
[✓] MySQL Connection
[✓] Automatic Table Creation
[✓] UrlRepository
[✓] DTO Layer
[✓] UrlService

[ ] UrlController
[ ] POST /api/urls
[ ] Save URL via API
[ ] Redirect API
```

---

## Key Takeaways

Learned:

* DTO Pattern
* Service Layer
* Dependency Injection
* UUID Generation
* Lombok
* Business Logic Separation

Built:

* Request DTO
* Response DTO
* Service Layer

Next Step:

Create UrlController and expose the first REST API:

```http
POST /api/urls
```
