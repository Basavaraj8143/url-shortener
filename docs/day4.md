# Day 4 - Completed Phase 2 Core URL Shortener API

## Objective

Complete the remaining core URL shortener APIs from Phase 2.

---

## APIs Completed

### Redirect Short URL

Endpoint:

```http
GET /{shortCode}
```

Purpose:

Redirects the user to the original long URL.

Flow:

```text
Client
   ↓
RedirectController
   ↓
UrlService
   ↓
UrlRepository
   ↓
MySQL Database
   ↓
302 Redirect
```

Implementation details:

* Added `RedirectController`
* Added `UrlRepository.findByShortCode(String shortCode)`
* Added `UrlService.getLongUrl(String shortCode)`
* Returned HTTP `302 FOUND` with `Location` header

---

### Get All URLs

Endpoint:

```http
GET /api/urls
```

Purpose:

Returns all shortened URLs stored in the database.

Response fields:

```java
id
longUrl
shortCode
createdAt
```

Implementation details:

* Added `UrlResponse` DTO
* Added `UrlService.getAllUrls()`
* Added controller method in `UrlController`

---

### Delete URL

Endpoint:

```http
DELETE /api/urls/{id}
```

Purpose:

Deletes a shortened URL by database ID.

Success response:

```http
204 No Content
```

Implementation details:

* Added `UrlService.deleteUrl(Long id)`
* Checked if URL exists before deleting
* Returned `404 Not Found` if ID does not exist

---

## Validation Added

Added validation to `ShortenRequest`.

Rules:

```java
@NotBlank
@URL
```

Controller now uses:

```java
@Valid @RequestBody ShortenRequest request
```

Invalid requests return:

```http
400 Bad Request
```

---

## Exception Handling Added

Created:

```java
UrlNotFoundException
GlobalExceptionHandler
```

Handled cases:

* Short code not found
* URL ID not found during delete
* Invalid request body

Example error response:

```json
{
  "error": "Short URL not found"
}
```

---

## Current Phase 2 Status

```text
[x] POST /api/urls
[x] GET /{shortCode}
[x] GET /api/urls
[x] DELETE /api/urls/{id}
[x] Basic validation
[x] Custom exception handling
```

---

## Key Takeaways

Learned:

* How redirects work using HTTP `302 FOUND`
* How to query data using Spring Data JPA custom finder methods
* How to return clean API responses using DTOs
* How to delete data safely
* How to handle errors globally
* How to validate request bodies

Built:

* Complete Phase 2 URL shortener APIs
* Redirect flow
* URL listing API
* Delete API
* Basic validation and error handling

Next Step:

Start Phase 3 production features:

```text
Click Analytics
Expiry Links
Custom Alias
Analytics API
```

---

## Reflection After Completing Phase 2

### What I Actually Learned Today

Learned:

* How `GET /{shortCode}` works as the core feature of a URL shortener
* How Spring Data JPA creates custom queries from method names like `findByShortCode`
* How to return redirects using HTTP `302 FOUND` and the `Location` header
* How to return clean response data using a separate `UrlResponse` DTO
* How to handle missing data with a custom exception instead of returning `null`
* How request validation works using `@Valid`, `@NotBlank`, and `@URL`

---

### Spring Concepts Still Used But Not Fully Understood

Need deeper understanding of:

* `ResponseEntity` for controlling response status, headers, and body
* `@RestControllerAdvice` for global exception handling
* `MethodArgumentNotValidException` and Spring's validation flow
* Spring Data JPA derived query methods such as `findByShortCode`
* HTTP redirect behavior and how clients handle `302 FOUND`

---

### Interview Questions I Can Now Answer

Can now explain:

* What layered architecture means in a Spring Boot project
* Why DTOs are used instead of exposing entities directly
* How Spring Data JPA reduces repository boilerplate
* How to create REST APIs in Spring Boot
* How a URL shortener redirect works internally
* How to handle not-found cases in an API
* What request validation is and why it matters
* The difference between `200 OK`, `204 No Content`, `302 FOUND`, `400 Bad Request`, and `404 Not Found`

---

### Refactoring Opportunities

Possible improvements:

* Add a unique constraint on `shortCode` to prevent duplicate short URLs
* Add retry logic if a generated short code already exists
* Move entity-to-DTO conversion into a mapper if response logic grows
* Return the full short URL in `ShortenResponse`, not only the `shortCode`
* Move database credentials out of `application.properties` into environment variables
* Add service and controller tests before starting more advanced features
