# URL Shortener: Deployment Plan (Vercel + AWS + Neon)

Goal: get the Java / Spring Boot URL shortener running as a **working live demo** at near-zero cost. Latency doesn't matter.

> Costs and limits below are rough estimates. Free tiers change, so check AWS and Neon pricing before deploying.

---

## 1. The Plan at a Glance

| Piece | Choice | Why |
|---|---|---|
| Frontend | Vercel (Vite static site) | Serves the React UI without using EC2 memory |
| API hosting | AWS EC2 (Ubuntu), Docker Compose | Runs the Spring Boot API, Redis, and Caddy |
| Database | Neon Postgres (free plan) | Managed Postgres with pooled connections and scale-to-zero |
| Cache | Redis in Docker on the same EC2 (capped at 64 MB) | Optional cache; the app falls back to Postgres if Redis fails |
| HTTPS / reverse proxy | Caddy (auto Let's Encrypt) | Zero-config certificates |
| Domain | Free DuckDNS subdomain | Free, scriptable IP updates |
| After AWS credits end | Move to GCP e2-micro (always free, US region) | Same Docker Compose setup |

### Why this combination

- **AWS free plan:** new accounts get $100 in credits plus up to $100 more by completing activities. The plan lasts 6 months or until credits run out, whichever comes first. `t3.micro` is an eligible instance type.
- **Neon instead of RDS:** Neon keeps the database managed and separate from EC2, with a free tier that suspends compute when idle. Expect a cold start after quiet periods and stay within the free compute quota.
- **Everything else on one VM:** app + Redis + Caddy can run on one small VM, but 1 GB RAM is tight. A 2 GB instance is safer if the AWS credits cover it.

### Architecture

```
Browser
  |-- frontend URL --> Vercel (React/Vite)
  |                       |
  |                       +--> API URL (HTTPS, Caddy on EC2)
  |                                      |
  |                                      v
  |                              Spring Boot API (:8080)
  |                                +--> Redis (64 MB, optional cache)
  |                                +--> Neon Postgres (pooled TLS connection)
```

### Rough monthly cost (24/7)

| Item | Approx. |
|---|---|
| EC2 t3.micro | ~$8 |
| 20 GB gp3 disk | ~$2 |
| Public IPv4 address | ~$3.60 |
| Neon | $0 within free limits |
| **Total** | **~$13-14/month** (~$80 over 6 months, inside the $100 credit) |

If you stop the instance when not in use, you only pay for the disk (~$2/month) while it is stopped.

---

## 2. Neon Setup

### 2.1 Create the project
1. Create a Neon project named `urlshortener`.
2. Choose a region close to the AWS EC2 API.
3. Save the database role password securely.

### 2.2 Get the connection string
1. Click **Connect** in Neon and select the production branch, database, and role.
2. Enable **Connection pooling** and copy the pooled URL. Use the exact hostname with the `-pooler` suffix, role, database name, and password from the dashboard.
3. Keep `sslmode=require` in the connection URL; Neon requires encrypted database connections.

### 2.3 Test the connection
```bash
psql "postgresql://<role>:<password>@<pooled-host>:5432/<database>?sslmode=require"
```
Run the Spring app locally against Neon before deploying to AWS.

### 2.4 Spring Boot configuration
```properties
spring.datasource.url=jdbc:postgresql://<pooled-host>:5432/<database>?sslmode=require
spring.datasource.username=<role-from-Neon-Connect>
spring.datasource.password=${DB_PASSWORD}
spring.datasource.hikari.maximum-pool-size=5
spring.datasource.hikari.minimum-idle=0
spring.datasource.hikari.idle-timeout=240000
spring.jpa.hibernate.ddl-auto=update
```
- The project already uses the PostgreSQL JDBC driver. Keep the Hikari pool small and allow idle connections to close so Neon can scale compute to zero when unused.
- Use the direct connection for dump/restore or other admin operations that require session features.
- Never commit the database password. Pass it through environment variables.

### 2.5 Secure the connection
- The browser talks to the Spring API, not directly to Neon. Store the database URL and password only in the backend environment.
- Keep the Neon role password and Clerk backend settings in the EC2 environment file, with restrictive file permissions.

### 2.6 Free plan limits
Neon's current Free plan includes 1 GB of Postgres storage and 100 compute-hours per project per month. Compute suspends after inactivity and resumes on a new request, so the first database request after a quiet period can be slower. Monitor usage in the Neon Console.

### 2.7 Existing data
This demo plan starts with an empty Neon database. If existing MySQL users and links must be retained, migrate and verify them before switching production traffic.

---

## 3. Code Changes: MySQL to Postgres

1. **Dependency:** remove `mysql-connector-j`, add `org.postgresql:postgresql` (runtime scope).
2. **Properties:** delete any explicit MySQL dialect (e.g. `MySQL8Dialect`) and the `com.mysql.cj.jdbc.Driver` setting.
3. **Entities:**
   - Keep `GenerationType.IDENTITY`.
   - Rename tables that clash with reserved words (`user` -> `users`, `order` -> `orders`) using `@Table(name = "...")`.
   - Remove MySQL-specific `columnDefinition` values (`LONGTEXT`, `TINYINT(1)`, `DATETIME`); use `TEXT`, `BOOLEAN`, `TIMESTAMP`, or let Hibernate choose.
4. **Native queries:** `IFNULL` -> `COALESCE`, `DATE_FORMAT` -> `to_char`, remove backticks, `ON DUPLICATE KEY UPDATE` -> `ON CONFLICT ... DO UPDATE`. JPQL and Spring Data derived queries need no changes.
5. **Case sensitivity:** MySQL string comparisons are case-insensitive by default; Postgres is case-sensitive. That is better for base62 short codes. Keep a unique index on the short code.
6. **Duplicate-key handling:** if you parse MySQL error code `1062`, switch to SQLState `23505`. Catching `DataIntegrityViolationException` needs no change.
7. **SQL scripts / Flyway:** `AUTO_INCREMENT` -> `BIGSERIAL` or `GENERATED BY DEFAULT AS IDENTITY`; remove `ENGINE=InnoDB` and backticks.
8. **Tests / compose:** switch Testcontainers or test config to PostgreSQL; remove the MySQL service from compose.
9. **Existing data:** for a demo, start fresh. To keep rows, export CSV and import, or use `pgloader`.

---

## 4. AWS Setup

### 4.1 Account and guardrails (do this first)
1. Create an AWS account (a card is normally required at signup, even on the free plan).
2. Check **Billing -> Credits** to confirm the $100 signup credit and note the end date (plan ends at 6 months or when credits run out; credits themselves expire after 12 months).
3. Complete the console activities that earn the extra $100 if you want it.
4. Create an **AWS Budget** (e.g. $5-10) with an email alert, and enable billing alerts.

### 4.2 Launch the EC2 instance
- **Region:** `ap-south-1` (Mumbai) or whichever is closest. Keep Neon in a nearby region if available.
- **AMI:** Ubuntu 24.04 LTS.
- **Instance type:** `t3.micro` (free-plan eligible, 1 GB RAM). `t3.small` (2 GB) is safer but about double the cost.
- **Key pair:** create one and keep the `.pem` file safe.
- **Storage:** 20 GB gp3.
- **Network:** auto-assign public IP **on**. Do **not** attach an Elastic IP (it stays billable when stopped).
- **Security group:**
  - 22 (SSH): your IP only
  - 80 (HTTP): anywhere
  - 443 (HTTPS): anywhere

### 4.3 Prepare the server
```bash
ssh -i your-key.pem ubuntu@<public-ip>

# Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
# log out and back in so the group applies

# Optional 1 GB swap (safety net for spikes)
sudo fallocate -l 1G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
```

### 4.4 Get the app onto the server
Building with Maven/Gradle on a 1 GB box is slow and RAM-hungry. Better:
- Build the jar or image on your laptop (or in GitHub Actions) and either push the image to Docker Hub / GHCR and `docker pull` it, or `scp` the jar to the server.

Example `Dockerfile` (adjust the Java version to match your project):
```dockerfile
FROM eclipse-temurin:17-jre
COPY target/*.jar app.jar
ENTRYPOINT ["java", "-jar", "/app.jar"]
```

### 4.5 Free domain (DuckDNS)
1. Sign in at duckdns.org and create an API subdomain, e.g. `snip-api.duckdns.org`.
2. Point it at the EC2 public IP.
3. Because the IP changes after every stop/start, add an update script on the server:
```bash
mkdir -p ~/duckdns
cat > ~/duckdns/update.sh <<'EOF'
#!/bin/bash
curl -s "https://www.duckdns.org/update?domains=yourname&token=YOUR_TOKEN&ip="
EOF
chmod +x ~/duckdns/update.sh
( crontab -l 2>/dev/null; echo "@reboot ~/duckdns/update.sh"; echo "*/10 * * * * ~/duckdns/update.sh" ) | crontab -
```
(An empty `ip=` makes DuckDNS use the caller's IP.)

### 4.6 Docker Compose
`docker-compose.yml`:
```yaml
services:
  app:
    image: urlshortener:latest      # or your registry image
    environment:
      SPRING_DATASOURCE_URL: jdbc:postgresql://${NEON_HOST}:5432/${NEON_DATABASE}?sslmode=require
      SPRING_DATASOURCE_USERNAME: ${NEON_USERNAME}
      SPRING_DATASOURCE_PASSWORD: ${DB_PASSWORD}
      SPRING_DATASOURCE_HIKARI_MAXIMUM_POOL_SIZE: 5
      SPRING_DATASOURCE_HIKARI_MINIMUM_IDLE: 0
      SPRING_DATASOURCE_HIKARI_IDLE_TIMEOUT: 240000
      SPRING_DATA_REDIS_HOST: redis
      SPRING_DATA_REDIS_PORT: 6379
      CLERK_ISSUER: ${CLERK_ISSUER}
      CLERK_JWKS_URL: ${CLERK_JWKS_URL}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS}
      JAVA_TOOL_OPTIONS: -Xmx256m
    depends_on:
      - redis
    restart: unless-stopped

  redis:
    image: redis:7-alpine
    command: redis-server --maxmemory 64mb --maxmemory-policy allkeys-lru
    restart: unless-stopped

  caddy:
    image: caddy:2
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile
      - caddy_data:/data
    restart: unless-stopped

volumes:
  caddy_data:
```

`Caddyfile` (serves the backend API and short-link redirects; Vercel serves the React UI):
```
snip-api.duckdns.org {
    reverse_proxy app:8080
}
```

`.env` (same folder, never committed):
```
NEON_HOST=<pooled-hostname-from-Neon-Connect>
NEON_DATABASE=<database-from-Neon-Connect>
NEON_USERNAME=<role-from-Neon-Connect>
DB_PASSWORD=<Neon-role-password>
CLERK_ISSUER=<Clerk-issuer-URL>
CLERK_JWKS_URL=<Clerk-JWKS-URL>
CORS_ALLOWED_ORIGINS=https://<your-project>.vercel.app
```

Start it:
```bash
docker compose up -d
docker compose logs -f app
```

### 4.7 Deploy the frontend to Vercel
1. Import the repository into Vercel and set the project root directory to `frontend`.
2. Set `VITE_API_BASE_URL=https://snip-api.duckdns.org` and `VITE_CLERK_PUBLISHABLE_KEY=<Clerk-publishable-key>` in Vercel.
3. Redeploy the frontend after adding the environment variables. Set `CORS_ALLOWED_ORIGINS` on EC2 to the exact Vercel origin (no trailing slash).

### 4.8 Verify
- Open the Vercel frontend, sign in through Clerk, and create a short link.
- Click the short link and confirm the redirect.
- Check rows appear in the Neon SQL Editor.

---

## 5. Operating Routine

### Stop when not using it
- Stop the instance from the EC2 console. Instance and data-transfer charges stop; the 20 GB disk still costs about $2/month.
- The auto-assigned public IP is released on stop. After the next start, the DuckDNS `@reboot` job updates the domain; if it hasn't, run `~/duckdns/update.sh` or update the IP in the DuckDNS dashboard.
- While stopped, your short links are dead. For a resume link you want recruiters to click anytime, keep it running during your job-hunt periods.

### Keep running costs in check
- Watch **Billing -> Credits** monthly.
- Keep the budget alert active.
- Don't add RDS, a NAT gateway, load balancers, or an Elastic IP.

### If something breaks

| Symptom | Likely cause | Fix |
|---|---|---|
| App container keeps restarting | Out of memory | Check `docker compose logs app`, confirm `-Xmx256m`, add swap |
| Can't connect to DB | Incorrect pooled host/role/password, or Neon is waking from idle | Copy the pooled connection details from Neon and retry after the cold start |
| HTTPS not issued | DNS not pointing at the instance yet, or ports 80/443 closed | Check DuckDNS IP and the security group |
| Domain dead after restart | IP changed | Run the DuckDNS update script |
| `prepared statement` errors | Client/session feature incompatible with Neon transaction pooling | Confirm JDBC uses the Neon pooled endpoint and review Neon PgBouncer limitations |

---

## 6. After the AWS Free Plan Ends (month 6)

Move to the **GCP e2-micro** (always free):
- One non-preemptible e2-micro in `us-west1`, `us-central1` or `us-east1` with a 30 GB standard disk.
- A card is required for GCP billing. Set a budget alert immediately.
- Don't pick a non-US region or an SSD disk; both bill.
- Same Docker Compose setup, so the move is: new VM -> install Docker -> copy compose + Caddyfile + `.env` -> update DuckDNS.

---

## 7. Step-by-Step Checklist

**Prep**
- [ ] Migrate code to Postgres (section 3)
- [ ] Run the app locally against Neon and confirm it works
- [ ] Build the Docker image and test it locally with compose

**Neon**
- [ ] Create the project, save the role password
- [ ] Copy the pooled connection details
- [ ] Check the free compute and storage usage in the Neon Console

**AWS**
- [ ] Create the account, check credits, set the budget alert
- [ ] Launch t3.micro Ubuntu, 20 GB gp3, correct security group, no Elastic IP
- [ ] Install Docker, add swap
- [ ] Create the DuckDNS domain and the update cron job
- [ ] Set Clerk issuer, JWKS, and Vercel origin in the EC2 environment

**Deploy**
- [ ] Copy compose, Caddyfile, `.env` and the image/jar to the server
- [ ] `docker compose up -d`
- [ ] Deploy the Vite frontend to Vercel with its API URL and Clerk publishable key
- [ ] Test shorten + redirect over HTTPS

**Polish for the resume**
- [ ] Add the live URL and an architecture diagram to the GitHub README
- [ ] Document the stack: React/Vite (Vercel), Spring Boot, Postgres (Neon), Redis, Docker Compose, Caddy, AWS EC2
- [ ] Note what you'd change for production (RDS, load balancer, CI/CD)

---

## 8. Open Decisions

- **Redis:** keep it in Docker with the 64 MB limit; the current app falls back to Postgres if Redis is unavailable.
- **t3.micro vs t3.small:** micro is enough for app + Redis + Caddy; choose small if you see memory pressure.
- **Always-on vs stop-when-idle:** stopping saves credits but breaks the live link.
