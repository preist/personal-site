# Production Deployment Guide

This guide covers deploying your personal website to production with domain routing.

## Domain Configuration

Your site is configured to run on:
- **Frontend**: `www.igorputina.com` (redirects from `igorputina.com`)
- **Strapi Admin**: `admin.igorputina.com`

## Initial Setup

### 1. DNS Configuration
Configure your DNS records with your domain provider:

```
A    igorputina.com        -> YOUR_DROPLET_IP
A    www.igorputina.com    -> YOUR_DROPLET_IP
A    admin.igorputina.com  -> YOUR_DROPLET_IP
```

### 2. Environment Setup
The `.env` file has been created with production domains. Update the security keys:

```bash
# Generate secure keys
openssl rand -base64 32

# Edit .env with your secure keys
vim .env
```

### 3. SSL Directory (for future SSL setup)
```bash
mkdir -p /home/igor/personal-site/ssl
```

## Manual Deployment

### Direct Deployment

1. **Clone or pull the repository:**
   ```bash
   git pull origin main
   ```

2. **Deploy using Make:**
   ```bash
   # For production deployment
   make prod

   # Or for development
   make dev
   ```

## Production Commands

### Start/Stop Services
```bash
# Start production
make prod

# Stop all services
make stop

# View status
make status

# View logs
make logs
```

### Health Checks
```bash
# Check if sites are accessible
curl -I http://www.igorputina.com
curl -I http://admin.igorputina.com

# Check container status
docker-compose --profile prod ps
```

## SSL Setup (Future)

When you're ready to add SSL certificates:

1. Place your certificate files in `/home/igor/personal-site/ssl/`:
   - `cert.pem` - Your certificate
   - `key.pem` - Your private key
   - `chain.pem` - Certificate chain (if applicable)

2. Update `nginx.conf` to use HTTPS (port 443)

3. Restart services: `make stop && make prod`

## Troubleshooting

### Common Issues

1. **Containers won't start:**
   ```bash
   make logs  # Check for errors
   make clean && make prod  # Clean restart
   ```

2. **Domain not resolving:**
   - Check DNS records
   - Verify firewall allows ports 80/443
   - Check nginx configuration: `docker exec -it <nginx_container> nginx -t`

3. **Permission issues:**
   ```bash
   sudo chown -R igor:igor /home/igor/personal-site
   chmod +x deploy.sh webhook-deploy.sh webhook-server.js
   ```

4. **Webhook server issues:**
   ```bash
   sudo systemctl status webhook-server
   sudo journalctl -u webhook-server -f
   ```

### Log Locations
- Container logs: `make logs`
- Webhook server: `/var/log/webhook-server.log`
- Deployment logs: `/var/log/webhook-deploy.log`

## Security Notes

1. **Change default secrets** in `.env` for production
2. **Update webhook secret** in service file
3. **Configure firewall** to allow only necessary ports
4. **Regular updates**: Keep Docker images and system packages updated
5. **Backup data**: The SQLite database is in `admin/data/`

## Monitoring

### Check Service Health
```bash
# Website health
curl -s -o /dev/null -w "%{http_code}" http://www.igorputina.com

# Admin health
curl -s -o /dev/null -w "%{http_code}" http://admin.igorputina.com

# Container health
docker-compose --profile prod ps --format "table {{.Name}}\t{{.Status}}"
```

### Resource Monitoring
```bash
# Docker resource usage
docker stats

# System resources
htop
df -h
```