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
