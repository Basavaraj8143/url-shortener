# Minimal AWS Deployment Plan

This guide deploys the **Spring Boot API, Redis, and HTTPS proxy** on one AWS EC2 instance. Neon hosts PostgreSQL, and the React/Vite frontend stays on Vercel.

```text
Browser -> Vercel frontend -> HTTPS -> Caddy on EC2 -> Spring Boot API -> Neon PostgreSQL
                                                                 -> Redis (cache)
```

The app already uses PostgreSQL and has a Java 17 Dockerfile. The Neon connection details visible in the supplied screenshot are filled into the configuration below; the database password is not visible and must be entered privately in `.env`. This plan does not require a MySQL-to-PostgreSQL migration, RDS, a load balancer, or a code change. The API and cache are on one VM, so this is appropriate for a demo or small personal app—not a high-availability production service.

> **Commands:** Commands marked **EC2** run in the Ubuntu shell on the server. Commands marked **Vercel** are entered in Vercel settings. Check current AWS pricing and free-tier/credit eligibility before creating resources; prices and offers change.

## 1. Prepare AWS and DNS

1. In AWS Billing, create a monthly budget alert before launching anything. Check your account's current credits and the estimated cost for your selected region and instance.
2. Launch one Ubuntu 24.04 LTS EC2 instance. Choose at least **2 GB RAM** for Java, Redis, and Docker. Use a small gp3 disk (20 GB is a reasonable starting point).
3. Create a security group with only these inbound rules:
   - SSH (TCP 22) from **your current IP only**.
   - HTTP (TCP 80) from anywhere.
   - HTTPS (TCP 443) from anywhere.
   - Do **not** add public rules for 5432 (PostgreSQL), 6379 (Redis), or 8080 (the app).
4. Create a DNS name such as `api.example.com` or a DuckDNS hostname. Point its A record at the instance's public IPv4 address. If the address changes after stopping/starting EC2, update DNS; a static address may cost extra, so check current pricing.
5. Wait for DNS to resolve to the EC2 public IP before starting Caddy. Caddy needs the hostname and reachable ports 80 and 443 to issue HTTPS certificates.

## 2. Install Docker and get the project onto EC2

From **Windows PowerShell**, connect using the key pair you downloaded. Replace the key path and address:

```powershell
ssh -i .\your-key.pem ubuntu@<EC2-public-ip>
```

Run the following on **EC2**:

```bash
sudo apt update
sudo apt install -y ca-certificates curl git
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker ubuntu
```

Log out and reconnect so the Docker group change takes effect, then check:

```bash
docker --version
docker compose version
```

Clone the repository (or use your own deployment method if it is private):

```bash
git clone https://github.com/Basavaraj8143/url-shortener.git
cd url-shortener
```

## 3. Create a production Compose file

Keep the repository's existing `docker-compose.yml` for local development. On EC2, create a separate file named `docker-compose.aws.yml` in the repository root and use this configuration. It does not publish the database, Redis, or app ports to the internet.

```yaml
services:
  redis:
    image: redis:7-alpine
    restart: unless-stopped
    command: ["redis-server", "--maxmemory", "64mb", "--maxmemory-policy", "allkeys-lru"]

  app:
    build:
      context: .
      dockerfile: Dockerfile
    restart: unless-stopped
    environment:
      DB_HOST: ${DB_HOST:?Set DB_HOST in .env}
      DB_PORT: ${DB_PORT:-5432}
      DB_NAME: ${DB_NAME:?Set DB_NAME in .env}
      DB_USERNAME: ${DB_USERNAME:?Set DB_USERNAME in .env}
      DB_PASSWORD: ${DB_PASSWORD:?Set DB_PASSWORD in .env}
      DB_SSL_MODE: ${DB_SSL_MODE:-require}
      DB_POOL_MAX: 5
      REDIS_HOST: redis
      REDIS_PORT: 6379
      CLERK_ISSUER: ${CLERK_ISSUER:?Set CLERK_ISSUER in .env}
      CLERK_JWKS_URL: ${CLERK_JWKS_URL:?Set CLERK_JWKS_URL in .env}
      CORS_ALLOWED_ORIGINS: ${CORS_ALLOWED_ORIGINS:?Set CORS_ALLOWED_ORIGINS in .env}
      JWT_SECRET: ${JWT_SECRET:?Set JWT_SECRET in .env}
      JAVA_TOOL_OPTIONS: "-Xms128m -Xmx512m"
      SPRING_JPA_SHOW_SQL: "false"

  caddy:
    image: caddy:2
    restart: unless-stopped
    ports:
      - "80:80"
      - "443:443"
      - "443:443/udp"
    volumes:
      - ./Caddyfile:/etc/caddy/Caddyfile:ro
      - caddy_data:/data
      - caddy_config:/config
    depends_on:
      - app

volumes:
  caddy_data:
  caddy_config:
```

Create `Caddyfile` beside the Compose file. Replace the hostname with the DNS name from step 1:

```caddyfile
api.example.com {
    reverse_proxy app:8080
}
```

Because the frontend uses its configured API base URL to construct short links, generated links will use this API hostname too.

## 4. Set secrets and service configuration

On **EC2**, create `.env` in the repository root. Do not commit this file; `.env` is ignored by the repository's `.gitignore`. Generate random values on EC2:

```bash
openssl rand -hex 32
```

Use the generated value for `JWT_SECRET`. Do **not** generate a new database password here: use the password for the Neon role shown in your Neon dashboard. Then create `.env`:

```bash
nano .env
```

Put these values in it, replacing every placeholder:

```dotenv
DB_HOST=ep-delicate-paper-beagcq2x-pooler.c-9.us-east-2.aws.neon.tech
DB_PORT=5432
DB_NAME=neondb
DB_USERNAME=neondb_owner
DB_PASSWORD=<Neon role password; enter privately on EC2>
DB_SSL_MODE=require
JWT_SECRET=<different-random-secret>
CLERK_ISSUER=<issuer-url-from-your-Clerk-instance>
CLERK_JWKS_URL=<JWKS-url-from-your-Clerk-instance>
CORS_ALLOWED_ORIGINS=https://<your-vercel-frontend-origin>
```

The Neon hostname, database, and role above come from the supplied screenshot. The screenshot masks the password; copy it from Neon into the EC2 `.env` file. Do not put the password in Java source, Compose YAML, `.env.example`, or Git. `DB_SSL_MODE=require` makes the app use TLS to connect to Neon. Use the exact Clerk issuer and JWKS URL from your Clerk configuration. `CORS_ALLOWED_ORIGINS` must be the frontend's origin only—scheme and hostname, with no path or trailing slash. If you have a Vercel preview URL, add it only if you intend to use it.

Restrict access to the secrets file and validate the Compose configuration without printing resolved secrets:

```bash
chmod 600 .env
docker compose -f docker-compose.aws.yml --env-file .env config --quiet
```

The app connects to Neon over TLS using the pooled hostname shown in your screenshot. Redis remains private to the Compose network. Do not expose Redis or the app port through the EC2 security group.

## 5. Start and check the backend

Run on **EC2**:

```bash
docker compose -f docker-compose.aws.yml --env-file .env up -d --build
docker compose -f docker-compose.aws.yml --env-file .env ps
docker compose -f docker-compose.aws.yml --env-file .env logs --tail=100 app
docker compose -f docker-compose.aws.yml --env-file .env logs --tail=100 caddy
```

The first build may take a few minutes. The included Dockerfile builds with Java 17. If the build runs out of memory, build the image on your computer or in CI and publish it to a container registry, then change the Compose `app` service from `build:` to that image.

Check the API through HTTPS from your computer:

```text
https://<your-api-hostname>
```

The root path may redirect or return an application response depending on the route; the key checks are that DNS resolves, HTTPS loads without a certificate warning, and the app container stays running. If Caddy returns 502, inspect the app logs and check that it started successfully.

## 6. Deploy the frontend to Vercel

In Vercel:

1. Import the repository and set the project root to `frontend`.
2. Set `VITE_API_BASE_URL` to `https://<your-api-hostname>`.
3. Set `VITE_CLERK_PUBLISHABLE_KEY` to the publishable key for the same Clerk instance configured on the backend.
4. Redeploy after setting the variables.

Do not put the database password, JWT secret, or Clerk secret key in Vercel frontend variables. The publishable key is intended for frontend use.

## 7. Verify the complete app

From the deployed Vercel URL:

- Sign in or sign up through Clerk.
- Create a short URL and confirm the API request succeeds.
- Open the generated short URL; it should use the API hostname and redirect to the original URL.
- Refresh the page and confirm the saved link is still present.
- On EC2, check `docker compose -f docker-compose.aws.yml --env-file .env logs --tail=100 app` if a request fails.

The app uses Hibernate `ddl-auto=update` to create/update tables on startup, which is convenient for this demo. Neon persists the database independently of the EC2 instance. Before storing important production data, use an explicit schema migration strategy and take tested backups.

## 8. Basic maintenance and recovery

- Check your AWS budget and instance status regularly. EC2, disk, public IPv4, and data-transfer pricing depend on region and current AWS terms.
- Back up PostgreSQL before making changes. Use Neon backups/restore features or `pg_dump` from a machine that can connect to Neon; do not rely on the EC2 disk as the only copy.
- Example database backup (run on EC2; install the PostgreSQL client once with `sudo apt install -y postgresql-client`; writes `backup.sql` in the current directory and prompts for the Neon password):

  ```bash
  pg_dump \
    --host=ep-delicate-paper-beagcq2x-pooler.c-9.us-east-2.aws.neon.tech \
    --port=5432 --username=neondb_owner --dbname=neondb \
    --sslmode=require --file=backup.sql
  ```

- To restart services after changing the Compose file:

  ```bash
  docker compose -f docker-compose.aws.yml --env-file .env up -d
  ```

- To update the app after pushing code:

  ```bash
  git pull
  docker compose -f docker-compose.aws.yml --env-file .env up -d --build
  ```

### Common problems

| Symptom | Check |
|---|---|
| Caddy cannot get a certificate | DNS points to the EC2 public IP; security group allows 80/443; hostname in `Caddyfile` matches DNS. |
| Caddy shows 502 | App container is running and listening on 8080; inspect app logs. |
| Sign-in or API calls fail in the browser | `CORS_ALLOWED_ORIGINS`, Clerk issuer/JWKS, and Vercel publishable key all match the same production configuration. |
| App cannot connect to Neon | `.env` hostname, database, role, and password match Neon; `DB_SSL_MODE=require`; Neon compute is available. |
| App restarts or EC2 becomes unresponsive | Check memory and Docker logs. Use at least 2 GB RAM; reduce other services or resize if needed. |
| Site stops resolving after an EC2 stop/start | The public IP changed; update the DNS A record or use a static address after checking its cost. |
