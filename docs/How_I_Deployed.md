# Sniply — Deployment Documentation

## 1. Project Overview

Sniply is a full-stack URL Shortener application deployed using AWS EC2, Docker, Neon PostgreSQL, Redis, Caddy, and Vercel.

The deployment separates the frontend and backend:

- **Frontend:** React + Vite, hosted on Vercel.
- **Backend:** Java 17 + Spring Boot, hosted on AWS EC2.
- **Database:** PostgreSQL, hosted on Neon.
- **Cache:** Redis, running in Docker on EC2.
- **Reverse Proxy:** Caddy.
- **HTTPS:** Let's Encrypt.
- **Authentication:** Clerk JWT authentication.
- **DNS:** DuckDNS.

## 2. Deployment Architecture

```text
                 USER
                   |
                   v
          https://sniply.vercel.app
                   |
                   v
             VERCEL HOSTING
             React + Vite
                   |
                   | HTTPS API Requests
                   v
        https://sniply.duckdns.org
                   |
                   v
              AWS EC2
          Amazon Linux 2023
                   |
                   v
              CADDY
          Reverse Proxy
          HTTPS / TLS
                   |
                   v
          SPRING BOOT :8080
              Docker
              /    \
             /      \
            v        v
       PostgreSQL   Redis
         Neon       Docker
```

**Request flow:**

1. A user opens the frontend hosted on Vercel.
2. The frontend communicates with the backend using HTTPS.
3. DuckDNS resolves the backend hostname to the EC2 public IP.
4. Caddy receives the HTTPS request and forwards it to Spring Boot.
5. Spring Boot processes the request.
6. PostgreSQL stores application data, while Redis handles caching.

## 3. AWS EC2 Setup

### Instance configuration

| Property | Configuration |
|---|---|
| Cloud provider | AWS |
| Instance | EC2 |
| Instance type | t3.micro |
| Operating system | Amazon Linux 2023 |
| CPU architecture | x86_64 |
| Memory | 1 GB |
| Storage | 8 GB |
| Region | ap-southeast-2 |
| SSH username | ec2-user |

### Security Group configuration

The following inbound rules were configured:

| Port | Protocol | Source | Purpose |
|---|---|---|---|
| 22 | TCP | My IP | SSH access |
| 80 | TCP | 0.0.0.0/0 | HTTP |
| 443 | TCP | 0.0.0.0/0 | HTTPS |

Application port 8080, Redis port 6379, and PostgreSQL port 5432 were not exposed publicly.

### Connect to EC2

From Windows PowerShell:

```powershell
ssh -i .\spring-app-demo.pem ec2-user@YOUR_EC2_PUBLIC_IP
```

## 4. Install Deployment Dependencies

Docker and Git were installed on Amazon Linux 2023.

```bash
sudo dnf update -y
sudo dnf install docker git -y
```

Start Docker and enable it on boot:

```bash
sudo systemctl start docker
sudo systemctl enable docker
```

Allow the EC2 user to execute Docker commands:

```bash
sudo usermod -aG docker ec2-user
```

Reconnect to SSH for the group change to take effect.

Docker Compose was installed as a Docker CLI plugin, and Docker Buildx was upgraded to a compatible version for the Compose build process.

Verify:

```bash
docker --version
docker compose version
docker buildx version
```

### Configure swap memory

Because the instance has only 1 GB RAM, we configured 1 GB of swap to reduce the risk of out-of-memory failures during image builds.

The swap configuration was also persisted through `/etc/fstab`.

Verify:

```bash
free -h
```

## 5. Clone the Application

Clone the GitHub repository:

```bash
git clone https://github.com/Basavaraj8143/url-shortener.git
cd url-shortener
```

The project contains the Spring Boot backend, frontend, Dockerfile, and Docker Compose configuration.

## 6. Docker Deployment Configuration

We used a separate `docker-compose.aws.yml` rather than the local development Compose file.

This was important because the local configuration included development services and port mappings that were not appropriate for the EC2 deployment.

### Services

The AWS Compose configuration contains three services:

1. **app:** Builds and runs the Spring Boot application.
2. **redis:** Runs Redis with a memory limit.
3. **caddy:** Handles incoming HTTP/HTTPS traffic and reverse-proxies requests to Spring Boot.

### Redis configuration

```yaml
redis:
  image: redis:7-alpine
  restart: unless-stopped
  command:
    - redis-server
    - --maxmemory
    - 64mb
    - --maxmemory-policy
    - allkeys-lru
```

### Spring Boot configuration

The backend is built using the project's Dockerfile.

Important environment variables include:

- `DB_HOST`
- `DB_PORT`
- `DB_NAME`
- `DB_USERNAME`
- `DB_PASSWORD`
- `DB_SSL_MODE`
- `JWT_SECRET`
- `CLERK_ISSUER`
- `CLERK_JWKS_URL`
- `CORS_ALLOWED_ORIGINS`
- `REDIS_HOST`
- `REDIS_PORT`

The Java heap was limited to help the application run within the small EC2 instance:

```yaml
JAVA_TOOL_OPTIONS: "-Xms128m -Xmx384m"
```

Redis is accessed internally using the Docker service name `redis`.

### Caddy configuration

A `Caddyfile` was created:

```caddyfile
sniply.duckdns.org {
    encode gzip
    reverse_proxy app:8080
}
```

Caddy listens on ports 80 and 443 and forwards incoming application requests to the Spring Boot container on port 8080.

Persistent Docker volumes were configured for Caddy's data and configuration so that certificate information survives container recreation.

## 7. Environment Variables and Database Configuration

A `.env` file was created on EC2 to store deployment-specific configuration.

The application was connected to Neon PostgreSQL.

Important database settings:

```env
DB_HOST=YOUR_NEON_HOST
DB_PORT=5432
DB_NAME=neondb
DB_USERNAME=YOUR_NEON_USERNAME
DB_PASSWORD=YOUR_NEON_PASSWORD
DB_SSL_MODE=require
```

Additional settings:

```env
JWT_SECRET=YOUR_GENERATED_SECRET

CLERK_ISSUER=YOUR_CLERK_ISSUER
CLERK_JWKS_URL=YOUR_CLERK_JWKS_URL

CORS_ALLOWED_ORIGINS=YOUR_VERCEL_FRONTEND_ORIGIN
```

**Security precautions:**

- Never commit `.env` to GitHub.
- Never expose database passwords, JWT secrets, or Clerk credentials.
- Restrict access to the environment file:

```bash
chmod 600 .env
```

- Rotate credentials immediately if they are accidentally exposed.

## 8. Validate and Build Docker Images

Before starting the application, validate the Compose configuration:

```bash
docker compose -f docker-compose.aws.yml config --quiet
```

Build the Spring Boot application image:

```bash
docker compose -f docker-compose.aws.yml build app
```

This uses the project's multi-stage Dockerfile to build the Java application and package it into a runtime image.

## 9. Start the Application

Start all services:

```bash
docker compose -f docker-compose.aws.yml up -d
```

Check container status:

```bash
docker compose -f docker-compose.aws.yml ps
```

Expected services:

- url-shortener-app-1
- url-shortener-redis-1
- url-shortener-caddy-1

Check Spring Boot logs:

```bash
docker compose -f docker-compose.aws.yml logs --tail=100 app
```

The backend successfully started, connected to Neon PostgreSQL, initialized Hibernate, and started Tomcat on port 8080.

## 10. Configure DuckDNS

A free DuckDNS hostname was configured:

```text
sniply.duckdns.org
```

The hostname points to the EC2 public IPv4 address.

Check DNS resolution:

```bash
dig +short sniply.duckdns.org
```

The result should match the current EC2 public IPv4 address.

### Important: EC2 public IP changes

When an EC2 instance is stopped and started, its public IPv4 address can change.

If that happens:

1. Open the AWS EC2 console.
2. Find the new public IPv4 address.
3. Open DuckDNS.
4. Update the IP address for `sniply`.
5. Verify DNS resolution again.

The Vercel frontend does not need rebuilding just because the EC2 IP changes, provided it continues using the same backend hostname.

## 11. Configure HTTPS Using Caddy

Caddy automatically obtains and renews HTTPS certificates using Let's Encrypt.

The Caddy configuration uses:

```caddyfile
sniply.duckdns.org {
    encode gzip
    reverse_proxy app:8080
}
```

Caddy automatically handles:

- HTTP to HTTPS redirection.
- TLS certificate acquisition.
- HTTPS termination.
- Reverse proxying to Spring Boot.
- Certificate renewal.

Check Caddy logs:

```bash
docker compose -f docker-compose.aws.yml logs --tail=100 caddy
```

Successful certificate issuance was confirmed by:

```text
certificate obtained successfully
```

## 12. Deploy the Frontend on Vercel

The React + Vite frontend was deployed on Vercel.

The frontend reads its API URL from:

```javascript
export const API_BASE_URL =
  (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/$/, '');
```

The production environment variable was configured in Vercel:

```env
VITE_API_BASE_URL=https://sniply.duckdns.org
```

After saving the environment variable, the frontend was redeployed because Vite embeds environment variables during the build.

The frontend continues to use Clerk for authentication.

## 13. API Security Configuration

The application uses Spring Security with OAuth2 Resource Server JWT validation.

The deployed security configuration includes:

```java
.requestMatchers("/register", "/login").denyAll()
.requestMatchers(HttpMethod.GET, "/{shortCode}").permitAll()
.requestMatchers("/error").permitAll()
.anyRequest().authenticated()
```

This means:

- `/register` and `/login` are blocked.
- Public short-link redirection is permitted.
- Other API endpoints require authentication.
- Clerk JWT validation is used for protected API access.

The frontend successfully authenticated users through Clerk and created URLs using the deployed backend.

## 14. Deployment Verification

The following checks were performed.

### HTTPS connectivity

```bash
curl -I https://sniply.duckdns.org
```

The backend responded through Caddy using HTTP/2.

An initial `401 Unauthorized` response at the root endpoint was expected because the root route is protected.

### Public redirect route

```bash
curl -i https://sniply.duckdns.org/test123
```

The application returned:

```json
{"error":"Short URL not found"}
```

This confirmed that the public redirect endpoint was reached without requiring authentication.

### End-to-end verification

The following operations were tested through the deployed frontend:

- Opened the Vercel application.
- Signed in successfully using Clerk.
- Created a short URL.
- Successfully redirected using the generated short URL.

This confirmed that the frontend, backend, authentication, database integration, and URL redirection were working together.

## 15. Useful Maintenance Commands

All commands should be executed from the application directory on EC2.

### Check containers

```bash
docker compose -f docker-compose.aws.yml ps
```

### View backend logs

```bash
docker compose -f docker-compose.aws.yml logs -f app
```

### View Caddy logs

```bash
docker compose -f docker-compose.aws.yml logs -f caddy
```

### Restart all services

```bash
docker compose -f docker-compose.aws.yml restart
```

### Stop all services

```bash
docker compose -f docker-compose.aws.yml down
```

This stops and removes the containers and Compose network, but does not remove named volumes by default.

### Start services again

```bash
docker compose -f docker-compose.aws.yml up -d
```

### Rebuild after backend code changes

```bash
git pull
docker compose -f docker-compose.aws.yml build app
docker compose -f docker-compose.aws.yml up -d
```

Avoid using `docker compose down -v` unless you intentionally want to remove persistent volumes.

## 16. Current Deployment Limitations

This deployment is suitable for a demonstration and small-scale project, but it is not a highly available production architecture.

Known limitations:

- Single EC2 instance; no high availability.
- Small instance size: 1 GB RAM.
- Small root disk: 8 GB.
- Redis is configured with an in-memory cache policy; cache data is not guaranteed to survive container recreation.
- No automated application deployment pipeline was configured.
- DuckDNS IP updates may be required after stopping and starting EC2.
- Monitoring and automated alerting still need to be added.
- Database backup and restore procedures should be tested.

## 17. Final Architecture Summary

| Component | Technology | Hosting |
|---|---|---|
| Frontend | React + Vite | Vercel |
| Backend | Java 17 + Spring Boot | AWS EC2 |
| Containerization | Docker | AWS EC2 |
| Container orchestration | Docker Compose | AWS EC2 |
| Database | PostgreSQL | Neon |
| Caching | Redis | Docker on EC2 |
| Reverse proxy | Caddy | Docker on EC2 |
| SSL/TLS | Let's Encrypt | Caddy |
| Authentication | Clerk | Clerk platform |
| DNS | DuckDNS | DuckDNS |

**Final result:** Sniply was successfully deployed as a full-stack application. The frontend is hosted on Vercel, the Spring Boot backend runs on AWS EC2, PostgreSQL is hosted on Neon, Redis runs in Docker, and Caddy provides HTTPS with automatic certificate management.
