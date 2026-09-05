# Day 7 - Completed Phase 5 Redis Caching

## Objective

Improve redirect performance by caching short URL lookups in Redis and reducing repeated database reads.

---

## Features Completed

### Redis Dependency

Added Spring Data Redis to `pom.xml`:

```xml
<artifactId>spring-boot-starter-data-redis</artifactId>
```

This provides `StringRedisTemplate` for storing and reading redirect data.

---

### Redis Configuration

Added Redis settings to `application.properties`:

```properties
spring.data.redis.host=${REDIS_HOST:localhost}
spring.data.redis.port=${REDIS_PORT:6379}
```

The application uses localhost by default and supports environment variables for deployment.

---

### Cache-Aside Redirect Flow

The redirect service now follows this flow:

```text
Receive short code
        |
        v
Check Redis cache
        |
   +----+----+
   |         |
 Found     Not found
   |         |
Check      Fetch from MySQL
expiry     Store in Redis
   |         |
   +----+----+
        |
        v
Update click count and redirect
```

Cache keys use this format:

```text
url:redirect:{shortCode}
```

When a redirect is found in MySQL, its long URL is stored in Redis for later requests.

---

### Cache Expiry

Redis entries use a time-to-live based on the URL's `expiresAt` value.

This keeps the cache from serving links after their application expiry date. Expired links still return:

```http
410 Gone
```

with the response:

```json
{
  "error": "Short URL has expired"
}
```

---

### Redis Failure Fallback

Redis is treated as a performance optimization. If Redis is unavailable or a Redis operation fails:

```text
Continue using MySQL
Complete the redirect normally
```

The application does not fail just because the cache is unavailable.

---

### Cache Eviction

When a URL is deleted, its Redis cache entry is also removed:

```text
DELETE /api/urls/{id}
        |
        +-- Delete URL from MySQL
        +-- Delete url:redirect:{shortCode} from Redis
```

This prevents deleted URLs from remaining available through stale cache data.

---

## Files Updated

```text
pom.xml
src/main/resources/application.properties
src/main/java/com/buss/url_shortener/service/UrlService.java
README.md
```

---

## Validation

The project was checked with:

```bash
mvnw.cmd -DskipTests compile
mvnw.cmd test
```

Both commands completed successfully.

---

## Current Phase 5 Status

```text
[x] Spring Data Redis dependency
[x] Redis host and port configuration
[x] Cache-aside redirect lookup
[x] Cache entries expire with short URLs
[x] Redis fallback to MySQL
[x] Cache eviction when URLs are deleted
[x] Existing click analytics preserved
```

Phase 5 is complete.

---

## What I Learned Today

* How Spring Boot connects to Redis
* How to use `StringRedisTemplate`
* How cache-aside loading works
* How to set Redis key expiration with `Duration`
* Why cache failures should not break the main application flow
* Why cached data must be evicted when the source record is deleted

---

## Next Phase

Phase 6 will package the application and its dependencies with Docker:

```text
Spring Boot + MySQL + Redis
```
