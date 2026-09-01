# Day 6 - Completed Phase 3 Expiry Links and Custom Alias

## Objective

Complete the remaining Phase 3 production features.

---

## Features Completed

### Expiry Links

Added field:

```java
expiresAt
```

Purpose:

Controls how long a short URL remains usable.

Current rule:

```text
New links expire after 7 days
```

Behavior:

* `expiresAt` is set when a short URL is created
* Redirect checks expiry before increasing click count
* Expired links do not redirect
* Expired links return `410 Gone`

Error response:

```json
{
  "error": "Short URL has expired"
}
```

---

### Custom Alias

Added optional request field:

```java
customAlias
```

Example request:

```json
{
  "longUrl": "https://leetcode.com",
  "customAlias": "leetcode"
}
```

Expected response:

```json
{
  "shortCode": "leetcode",
  "expiresAt": "..."
}
```

Behavior:

* If `customAlias` is provided, it becomes the short code
* If `customAlias` is not provided, the app generates a random short code
* Duplicate aliases are rejected
* Invalid aliases are rejected by validation

---

## Alias Validation

Rules:

```text
Length: 3 to 30 characters
Allowed: letters, numbers, underscore, hyphen
```

Valid examples:

```text
myresume
leetcode_2026
spring-boot
```

Invalid examples:

```text
ab
my resume
resume!
```

---

## Duplicate Alias Handling

Added:

```java
DuplicateAliasException
```

Response:

```http
409 Conflict
```

Example:

```json
{
  "error": "Custom alias already exists"
}
```

---

## Updated API Responses

### Create URL

Endpoint:

```http
POST /api/urls
```

Response now includes expiry:

```json
{
  "shortCode": "abc123",
  "expiresAt": "..."
}
```

---

### Get All URLs

Endpoint:

```http
GET /api/urls
```

Response now includes:

```java
clickCount
expiresAt
```

---

### Stats API

Endpoint:

```http
GET /api/urls/{id}/stats
```

Response now includes:

```json
{
  "clicks": 1,
  "createdAt": "...",
  "expiresAt": "..."
}
```

---

## Complete Phase 3 Flow

### Create Short URL

```text
Receive longUrl and optional customAlias
Validate request
Check alias uniqueness if alias exists
Generate random code if alias is absent
Set createdAt
Set expiresAt = createdAt + 7 days
Set clickCount = 0
Save URL
Return shortCode and expiresAt
```

---

### Redirect Short URL

```text
Receive shortCode
Find URL by shortCode
Check expiry
Increase clickCount
Save URL
Return 302 redirect
```

---

## Current Phase 3 Status

```text
[x] Click Analytics
[x] Analytics API
[x] Expiry Links
[x] Custom Alias
[x] Duplicate alias handling
[x] Alias validation
[x] Expired link handling
```

Phase 3 is complete.

---

## What I Actually Learned Today

Learned:

* How to add expiry rules using `LocalDateTime`
* How business rules belong in the service layer
* How optional request fields work
* How to validate custom user input
* How to prevent duplicate short codes using repository checks
* How to return correct HTTP errors like `409 Conflict` and `410 Gone`

---

## Spring Concepts Used

Used:

* `@Size` and `@Pattern` validation
* Spring Data JPA `existsByShortCode`
* Custom exceptions
* Global exception handling using `@RestControllerAdvice`
* Entity changes with Hibernate auto update

Still needs deeper understanding:

* Database unique constraints
* Race conditions when two users request the same alias at the same time
* Transaction behavior when reading, updating, and saving entities

---

## Interview Questions I Can Now Answer

Can now explain:

* How do expiry links work in a URL shortener?
* How do you support custom aliases?
* How do you reject duplicate aliases?
* Why should expired links return `410 Gone`?
* How do you validate alias format?
* How do you track clicks and expose stats?
* What concurrency issue can happen with custom aliases?

---

## Next Step

Start Phase 4:

```text
Authentication with Spring Security and JWT
```
