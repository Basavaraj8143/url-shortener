# Phase 3 - Production Features Plan

## Objective

Move the URL shortener from basic CRUD + redirect to a more production-like backend feature set.

Timeline:

```text
Days 5-7
```

---

## Features To Implement

### 1. Click Analytics

Goal:

Track how many times each short URL is used.

Entity change:

```java
clickCount
```

Expected behavior:

* Every successful redirect increases `clickCount` by `1`
* Newly created URLs start with `clickCount = 0`
* Analytics API returns the total number of clicks

Concepts learned:

* Updating existing database records
* Entity field changes
* Tracking usage metrics

---

### 2. Expiry Links

Goal:

Allow short URLs to expire after a fixed time.

Entity change:

```java
expiresAt
```

Expected behavior:

* Each URL has an expiry date
* Default expiry can be 7 days from creation
* Redirect should fail if the URL is expired
* Expired links should return a clear error response

Concepts learned:

* Date/time handling with `LocalDateTime`
* Business rule validation
* Preventing access based on state

---

### 3. Custom Alias

Goal:

Allow users to choose their own short code.

Example:

```text
GET /myresume
```

instead of:

```text
GET /x8s9kd
```

Request example:

```json
{
  "longUrl": "https://leetcode.com",
  "customAlias": "myresume"
}
```

Expected behavior:

* If `customAlias` is provided, use it as the short code
* If not provided, generate a random short code
* Reject duplicate aliases
* Validate alias format

Concepts learned:

* Optional request fields
* Uniqueness checks
* Validation beyond simple `@NotBlank`

---

### 4. Analytics API

Goal:

Expose statistics for a shortened URL.

Endpoint:

```http
GET /api/urls/{id}/stats
```

Response example:

```json
{
  "clicks": 120,
  "createdAt": "...",
  "expiresAt": "..."
}
```

Expected behavior:

* Return click count
* Return creation time
* Return expiry time
* Return `404 Not Found` if URL ID does not exist

Concepts learned:

* Read-only API design
* Stats DTOs
* Returning only required data

---

## Suggested Implementation Order

### Step 1 - Add Entity Fields

Update `Url` entity:

```java
private Long clickCount;
private LocalDateTime expiresAt;
```

Database should update automatically because:

```properties
spring.jpa.hibernate.ddl-auto=update
```

---

### Step 2 - Update Create URL Logic

When creating a URL:

```text
clickCount = 0
expiresAt = createdAt + 7 days
```

Also support optional custom alias.

---

### Step 3 - Update Redirect Logic

Before redirecting:

```text
Find URL by shortCode
Check if expired
Increase clickCount
Save URL
Redirect
```

---

### Step 4 - Add Stats DTO

Create:

```java
UrlStatsResponse
```

Fields:

```java
Long clicks
LocalDateTime createdAt
LocalDateTime expiresAt
```

---

### Step 5 - Add Analytics Endpoint

Add:

```http
GET /api/urls/{id}/stats
```

Return `UrlStatsResponse`.

---

## Exceptions Needed

Add or reuse exceptions for:

* URL not found
* Short URL expired
* Custom alias already exists
* Invalid custom alias

Possible classes:

```java
UrlNotFoundException
UrlExpiredException
DuplicateAliasException
```

---

## Validation Needed

Validate:

* `longUrl` must be valid
* `customAlias` should not contain spaces
* `customAlias` should contain only letters, numbers, `_`, or `-`
* `customAlias` should have a reasonable length

Example rule:

```text
3 to 30 characters
Allowed: a-z, A-Z, 0-9, _, -
```

---

## Phase 3 Completion Checklist

```text
[x] Add clickCount field
[x] Add expiresAt field
[x] Set clickCount during URL creation
[x] Set default expiry during URL creation
[x] Increment clickCount on redirect
[x] Block expired redirects
[x] Add optional customAlias request field
[x] Reject duplicate custom aliases
[x] Add GET /api/urls/{id}/stats
[x] Add required DTOs
[x] Add required exceptions
[ ] Test all endpoints in Postman
```

---

## Current Phase 3 Progress

Completed today:

```text
[x] Click Analytics
[x] Analytics API
[x] Expiry Links
[x] Custom Alias
```

Phase 3 implementation is complete.

Completed:

* Add expiry support using `expiresAt`
* Block redirect for expired short URLs
* Add optional `customAlias`
* Reject duplicate aliases
* Add alias validation

Remaining verification:

* Test all endpoints in Postman

---

## Postman Tests To Run

### Create Normal Short URL

```http
POST /api/urls
```

```json
{
  "longUrl": "https://leetcode.com"
}
```

Expected:

```text
200 OK
clickCount = 0
expiresAt is set
```

---

### Create Custom Alias

```http
POST /api/urls
```

```json
{
  "longUrl": "https://leetcode.com",
  "customAlias": "leetcode"
}
```

Expected:

```text
shortCode = leetcode
```

---

### Redirect And Increase Click Count

```http
GET /leetcode
```

Expected:

```text
302 FOUND
clickCount increases by 1
```

---

### Get Stats

```http
GET /api/urls/{id}/stats
```

Expected:

```json
{
  "clicks": 1,
  "createdAt": "...",
  "expiresAt": "..."
}
```

---

## Interview Questions After Phase 3

After completing Phase 3, you should be able to answer:

* How do you track clicks in a URL shortener?
* How do you prevent expired links from redirecting?
* How do you support custom aliases?
* How do you prevent duplicate short codes?
* Why should analytics response use a separate DTO?
* What happens if two users request the same alias?
* How would you improve short code generation?

---

## Deliverable

By the end of Phase 3, the project should support:

```text
Basic CRUD
Redirect
Click tracking
Expiry links
Custom aliases
Stats API
```
