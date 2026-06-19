## Day 2 - Package Structure

### Step 1: Create Package Structure

Inside:

```
com.buss.url_shortener
```

Create:

```
controller
service
repository
entity
dto
exception
config
```

### Result

```
com.buss.url_shortener

├── controller
├── service
├── repository
├── entity
├── dto
├── exception
├── config
└── UrlShortenerApplication
```

---

### Why These Packages?

#### `entity`
Stores database objects.

Example:
```
Url.java
```

Represents:
```
id
longUrl
shortCode
createdAt
```

---

#### `repository`
Talks to the database.

Example:
```
UrlRepository.java
```

Responsibilities:
- Save URL
- Find URL
- Delete URL

---

#### `service`
Business logic.

Example:
```
UrlService.java
```

Responsibilities:
- Generate short code
- Validate URL
- Handle redirects

---

#### `controller`
Receives API requests.

Example:
```
UrlController.java
```

Handles:
```
POST /api/urls
GET /abc123
```

---

#### `dto`
Data Transfer Objects.

Example:
```
ShortenRequest
ShortenResponse
```

Used for API requests/responses.

---

#### `exception`
Custom exceptions.

Example:
```
UrlNotFoundException
```

---

#### `config`
Configuration classes.

Later will include:
```
SecurityConfig
RedisConfig
```
```