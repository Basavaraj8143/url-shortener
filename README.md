<div align="center">

# 🔗 URL Shortener

### Turn long links into short, shareable URLs.

A full-stack URL shortener built with Java, Spring Boot, React, MySQL, and Redis-compatible Valkey.

<p>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Valkey-9933CC?style=for-the-badge&logo=redis&logoColor=white" alt="Valkey"/>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
</p>

<p>
  <img src="https://img.shields.io/badge/Authentication-JWT-black?style=flat-square&logo=jsonwebtokens" alt="JWT Authentication"/>
  <img src="https://img.shields.io/badge/Architecture-Layered-blue?style=flat-square" alt="Layered Architecture"/>
  <img src="https://img.shields.io/badge/Status-Deployed-success?style=flat-square" alt="Deployment Status"/>
</p>

[Live Demo](https://frontend-wine-ten-8j0jpa0z.vercel.app) · [Backend API](https://url-shortener-n3st.onrender.com) · [Report an Issue](https://github.com/Basavaraj8143/url-shortener/issues)

</div>

---

## 📌 Overview

URL Shortener is a full-stack application that converts long URLs into compact, shareable links.

The project was built to explore Java backend development, Spring Boot's layered architecture, relational persistence, authentication, caching, and cloud deployment.

It combines a React frontend with a Spring Boot REST API, MySQL for persistent storage, and Redis-compatible Valkey for caching.

> **Note:** A custom domain has not been configured yet, so generated short links currently use the deployed service URL.

## ✨ Features

- 🔗 **URL Shortening** — Generate compact links from long URLs.
- 🎯 **Custom Aliases** — Create memorable short codes.
- 🔐 **JWT Authentication** — User registration, login, and protected endpoints.
- 📊 **Click Analytics** — Track usage of shortened URLs.
- ⏳ **URL Expiration** — Configure links to expire.
- 🗂️ **URL Management** — View and manage shortened links.
- ⚡ **Redis/Valkey Caching** — Reduce repeated database lookups.
- 🚦 **Rate Limiting** — Restrict repeated requests to help prevent abuse.
- ✅ **Input Validation** — Validate incoming requests.
- 🛡️ **Global Exception Handling** — Return consistent API errors.
- 🐳 **Docker Support** — Containerize the backend application.

## 🛠️ Tech Stack

### Backend

<p>
  <img src="https://img.shields.io/badge/Java-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white" alt="Java"/>
  <img src="https://img.shields.io/badge/Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white" alt="Spring Boot"/>
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white" alt="Spring Security"/>
  <img src="https://img.shields.io/badge/Hibernate-59666C?style=for-the-badge&logo=hibernate&logoColor=white" alt="Hibernate"/>
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
</p>

### Frontend

<p>
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React"/>
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite"/>
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios"/>
</p>

### Database & Caching

<p>
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white" alt="MySQL"/>
  <img src="https://img.shields.io/badge/Valkey-9933CC?style=for-the-badge&logo=redis&logoColor=white" alt="Valkey"/>
  <img src="https://img.shields.io/badge/Spring_Data_JPA-6DB33F?style=for-the-badge&logo=spring&logoColor=white" alt="Spring Data JPA"/>
</p>

### DevOps & Deployment

<p>
  <img src="https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker"/>
  <img src="https://img.shields.io/badge/Render-000000?style=for-the-badge&logo=render&logoColor=white" alt="Render"/>
  <img src="https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white" alt="Vercel"/>
  <img src="https://img.shields.io/badge/Aiven-FF5A1F?style=for-the-badge&logo=aiven&logoColor=white" alt="Aiven"/>
</p>

## 🏗️ Architecture

```mermaid
flowchart TB
    U["👤 User / Browser"]

    subgraph FRONTEND["Frontend — Vercel"]
        FE["React + Vite"]
    end

    subgraph BACKEND["Backend — Render"]
        API["Spring Boot REST API"]
        SEC["Spring Security + JWT"]
        C["Controller Layer"]
        S["Service Layer"]
        R["Repository Layer — Spring Data JPA"]
    end

    subgraph DATA["Data Layer"]
        DB[("MySQL — Aiven")]
        CACHE[("Redis-compatible Valkey — Render")]
    end

    U <--> FE
    FE -->|"HTTPS / REST API"| API
    API --> SEC
    SEC --> C
    C --> S
    S --> R
    R <--> DB
    S <--> CACHE
```

### 🔄 How It Works

**1. Create a Short URL**

1. The frontend submits a long URL and an optional custom alias.
2. The controller receives the request and validates its input.
3. The service generates or processes the short code.
4. The repository saves the URL mapping in MySQL.
5. The API returns the shortened URL to the frontend.

**2. Redirect to the Original URL**

1. A browser requests `/{shortCode}`.
2. The backend checks Redis/Valkey for the mapping.
3. If the mapping is not cached, the application retrieves it from MySQL.
4. The mapping can be cached for future requests.
5. The backend responds with an HTTP redirect to the original URL.

**3. Authentication**

1. A user registers or logs in.
2. The backend validates the credentials.
3. The application issues a JWT after successful authentication.
4. The frontend sends the token in the `Authorization` header for protected requests.
5. Spring Security validates the token before allowing access.

## 🖼️ Screenshots

Add screenshots of your application to the `frontend/images/` directory.

Suggested screenshots:

| Login | Dashboard |
|---|---|
| `images/login.png` | `images/dashboard.png` |

| Create Short URL | Analytics |
|---|---|
| `images/create-url.png` | `images/analytics.png` |

When the screenshots are available, display them using:

```html
<p align="center">
  <img src="frontend/images/login.png" width="48%" alt="Login page"/>
  <img src="frontend/images/dashboard.png" width="48%" alt="Dashboard"/>
</p>

<p align="center">
  <img src="frontend/images/create-url.png" width="48%" alt="Create short URL"/>
  <img src="frontend/images/analytics.png" width="48%" alt="URL analytics"/>
</p>
```

## 🚀 Run Locally

### Prerequisites

- Java 17 or the version configured by the project
- Maven or the included Maven Wrapper
- Node.js and npm
- MySQL
- Redis/Valkey
- Docker (optional)

### 1. Clone the Repository

```bash
git clone https://github.com/Basavaraj8143/url-shortener.git
cd url-shortener
```

### 2. Create the Database

Open MySQL and execute:

```sql
CREATE DATABASE url_shortener;
```

### 3. Configure the Backend

Configure the environment variables supported by the application.

Example local configuration:

```properties
DB_HOST=localhost
DB_PORT=3306
DB_NAME=url_shortener
DB_USERNAME=root
DB_PASSWORD=your_local_password

JWT_SECRET=replace_with_a_long_random_secret

REDIS_HOST=localhost
REDIS_PORT=6379

CORS_ALLOWED_ORIGINS=http://localhost:5173
```

These are environment-variable examples. Set them in your IDE's run configuration or your local environment.

**Never commit production passwords, database credentials, or JWT secrets.**

Start the backend from the directory containing `pom.xml`.

**Windows PowerShell:**

```powershell
.\mvnw.cmd spring-boot:run
```

**macOS/Linux:**

```bash
./mvnw spring-boot:run
```

Alternatively, if Maven is installed:

```bash
mvn spring-boot:run
```

The backend normally runs at:

`http://localhost:8080`

### 4. Configure the Frontend

```bash
cd frontend
npm install
```

Create `frontend/.env`:

```env
VITE_API_BASE_URL=http://localhost:8080
```

Make sure the environment variable name matches the one used in the frontend API client.

Start the frontend:

```bash
npm run dev
```

The Vite development server normally runs at:

`http://localhost:5173`

### 5. Run with Docker (Optional)

If your Docker Compose configuration defines the required services, run:

```bash
docker compose up --build
```

Stop the containers:

```bash
docker compose down
```

Check your existing Docker Compose configuration to confirm which services it starts.

## 📡 API Overview

The following table describes the intended API surface. Verify the exact paths and request formats against the current backend implementation.

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/register` | Register a user |
| `POST` | `/login` | Authenticate and obtain a JWT |
| `POST` | `/api/urls` | Create a shortened URL |
| `GET` | `/api/urls` | List the authenticated user's URLs |
| `GET` | `/api/urls/{id}/stats` | Retrieve URL analytics |
| `DELETE` | `/api/urls/{id}` | Delete a URL |
| `GET` | `/{shortCode}` | Redirect to the original URL |

Authentication routes may differ depending on your controller mappings.

### Example: Create a Short URL

```http
POST /api/urls
Content-Type: application/json
Authorization: Bearer <JWT>
```

Example request:

```json
{
  "longUrl": "https://example.com/a/very/long/path",
  "customAlias": "my-link",
  "expiryDays": 30
}
```

The `customAlias` and `expiryDays` fields are illustrative. Use the exact field names supported by your request DTO.

## 🔐 Security

- JWT-based authentication.
- Password hashing through the configured Spring Security password encoder.
- Authorization for protected endpoints.
- CORS configuration for permitted frontend origins.
- Server-side input validation.
- Centralized exception handling.
- Environment variables for sensitive configuration.

## ⚡ Performance & Reliability

- **Caching:** Redis/Valkey can reduce repeated database lookups for frequently accessed URLs.
- **Rate Limiting:** Helps restrict excessive requests.
- **Persistence:** MySQL stores URL mappings and metadata.
- **Database Access:** Spring Data JPA and Hibernate simplify relational persistence.
- **Containerization:** Docker provides a consistent backend build and runtime environment.

## 🌐 Deployment

| Component | Platform |
|---|---|
| Frontend | Vercel |
| Backend API | Render |
| MySQL Database | Aiven |
| Cache / Key-Value Store | Render Key Value (Valkey) |

### Production Configuration

Configure the following variable in Vercel:

```env
VITE_API_BASE_URL=https://YOUR-RENDER-SERVICE.onrender.com
```

Replace the placeholder with the actual backend URL.

The backend must allow the deployed frontend origin through its CORS configuration.

> Never put database passwords, private API keys, or JWT secrets in frontend environment variables.

### 🔗 Project Links

<p>
  <a href="https://github.com/Basavaraj8143/url-shortener">
    <img src="https://img.shields.io/badge/GitHub-Repository-181717?style=for-the-badge&logo=github" alt="GitHub Repository"/>
  </a>
  <a href="https://url-shortener-n3st.onrender.com">
    <img src="https://img.shields.io/badge/Backend-Render-46E3B7?style=for-the-badge&logo=render&logoColor=black" alt="Render Backend"/>
  </a>
  <a href="https://frontend-wine-ten-8j0jpa0z.vercel.app">
    <img src="https://img.shields.io/badge/Frontend-Vercel-000000?style=for-the-badge&logo=vercel" alt="Vercel Frontend"/>
  </a>
</p>

## 📁 Project Structure

The structure below is representative. Adjust it to match the actual repository.

```text
url-shortener/
├── src/
│   └── main/
│       ├── java/
│       │   └── .../
│       │       ├── config/
│       │       ├── controller/
│       │       ├── service/
│       │       ├── repository/
│       │       ├── entity/
│       │       ├── dto/
│       │       ├── exception/
│       │       └── security/
│       └── resources/
│           └── application.properties
├── frontend/
├── Dockerfile
├── docker-compose.yml
├── pom.xml
└── README.md
```

## 📚 What I Learned

- Structuring Spring Boot applications using Controller → Service → Repository layers.
- Using Spring Data JPA and Hibernate for relational persistence.
- Designing and testing REST APIs.
- Implementing JWT authentication and Spring Security.
- Working with MySQL and Redis-compatible caching.
- Connecting a React frontend to a Spring Boot backend.
- Configuring CORS and environment variables.
- Containerizing and deploying an application using Docker and cloud platforms.

## 👨‍💻 Author

**Basavaraj**

- GitHub: [Basavaraj8143](https://github.com/Basavaraj8143)
- Portfolio: [basavaraj.tech](https://basavaraj.tech)

If you find this project useful, feel free to ⭐ the repository or open an issue.

---

<div align="center">

**Built to learn by building. 🚀**

</div>