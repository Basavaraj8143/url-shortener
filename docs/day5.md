# Day 5 - Phase 3A Click Analytics and Stats API

## Objective

Complete the first half of Phase 3 by adding click tracking and an analytics endpoint.

---

## Features Completed

### Click Analytics

Added field:

```java
clickCount
```

Purpose:

Tracks how many times a short URL has been used.

Behavior:

* New URLs start with `clickCount = 0`
* Every successful redirect increases `clickCount` by `1`
* Existing database rows with `null` click count are treated as `0`

---

### Updated Redirect Flow

New redirect flow:

```text
Client
   ↓
GET /{shortCode}
   ↓
Find URL by shortCode
   ↓
Increase clickCount
   ↓
Save updated URL
   ↓
Return 302 redirect
```

Concept learned:

Redirect is not only a read operation anymore. It now also updates analytics data.

---

### Analytics API

Added endpoint:

```http
GET /api/urls/{id}/stats
```

Response example:

```json
{
  "clicks": 3,
  "createdAt": "2026-08-31T10:30:00"
}
```

Purpose:

Returns analytics data for one shortened URL.

---

## DTO Added

Created:

```java
UrlStatsResponse
```

Fields:

```java
Long clicks
LocalDateTime createdAt
```

Reason:

Stats API should not expose the full database entity. It should return only the data needed by the client.

---

## Updated Existing DTO

Updated:

```java
UrlResponse
```

Added:

```java
clickCount
```

Reason:

`GET /api/urls` can now show how many times each short URL was used.

---

## Postman Tests

### 1. Create URL

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
New URL is created with clickCount = 0
```

---

### 2. Redirect URL

```http
GET /{shortCode}
```

Expected:

```text
302 FOUND
clickCount increases by 1
```

---

### 3. Get All URLs

```http
GET /api/urls
```

Expected:

```json
[
  {
    "id": 1,
    "longUrl": "https://leetcode.com",
    "shortCode": "abc123",
    "createdAt": "...",
    "clickCount": 1
  }
]
```

---

### 4. Get Stats

```http
GET /api/urls/{id}/stats
```

Expected:

```json
{
  "clicks": 1,
  "createdAt": "..."
}
```

---

## What I Actually Learned Today

Learned:

* How to update an existing database record during a request
* How analytics can be tracked using a simple counter
* Why redirect can involve both read and write database operations
* How to expose stats using a dedicated response DTO
* How to handle old database rows where the new field may be `null`

---

## Spring Concepts Used

Used:

* JPA entity field update
* Repository `save()` for updating existing rows
* Service-layer business logic
* DTO-based API response
* Path variable endpoint: `GET /api/urls/{id}/stats`

Still needs deeper understanding:

* Transaction behavior during update operations
* Concurrent click updates if many users open the same short URL at once
* Difference between read APIs and write APIs when one request does both

---

## Interview Questions I Can Now Answer

Can now explain:

* How do you track clicks in a URL shortener?
* Where should click increment logic live?
* Why should analytics use a separate DTO?
* What happens during a redirect request?
* How do you update an existing JPA entity?
* What problem can happen if many users click the same short URL at the same time?

---

## Phase 3 Status

Completed:

```text
[x] Click Analytics
[x] Analytics API
```

Completed later:

```text
[x] Expiry Links
[x] Custom Alias
```

Next Step:

Phase 3 is complete. Next roadmap phase:

```text
Phase 4 - Authentication
```
