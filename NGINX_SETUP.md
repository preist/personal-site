# Nginx Setup Guide for DigitalOcean (Fedora)

This guide covers setting up nginx on a Fedora server for hosting igorputina.com and admin.igorputina.com (Strapi).

## Prerequisites

- Fresh Fedora droplet on DigitalOcean
- Domain names (igorputina.com and admin.igorputina.com) pointing to your server's IP
- Root or sudo access

## Step 1: Update System and Install Nginx

```bash
# Update system packages
sudo dnf update -y

# Install nginx
sudo dnf install -y nginx

# Enable and start nginx
sudo systemctl enable nginx
sudo systemctl start nginx

# Check nginx status
sudo systemctl status nginx
```

## Step 2: Configure Firewall

```bash
# Install firewalld if not already installed
sudo dnf install -y firewalld
sudo systemctl enable firewalld
sudo systemctl start firewalld

# Allow HTTP and HTTPS traffic
sudo firewall-cmd --permanent --add-service=http
sudo firewall-cmd --permanent --add-service=https
sudo firewall-cmd --reload

# Verify firewall rules
sudo firewall-cmd --list-all
```

## Step 3: Create Directory Structure

```bash
# Create document root for main site
sudo mkdir -p /var/www/igorputina.com

# Set proper ownership and permissions
sudo chown -R nginx:nginx /var/www/igorputina.com
sudo chmod -R 755 /var/www

# Create a simple index.html for testing
sudo tee /var/www/igorputina.com/index.html > /dev/null <<EOF
<!DOCTYPE html>
<html>
<head>
    <title>Igor Putina</title>
</head>
<body>
    <h1>Welcome to igorputina.com</h1>
    <p>Site is under construction.</p>
</body>
</html>
EOF
```

## Step 4: Install SSL Certificates (Let's Encrypt)

```bash
# Install certbot for Let's Encrypt
sudo dnf install -y certbot python3-certbot-nginx

# Obtain SSL certificates for both domains
sudo certbot certonly --nginx -d igorputina.com -d www.igorputina.com
sudo certbot certonly --nginx -d admin.igorputina.com

# Set up automatic renewal (certificates renew every 60 days, recommended to run twice daily)
sudo systemctl enable certbot-renew.timer
sudo systemctl start certbot-renew.timer

# Check renewal timer status
sudo systemctl status certbot-renew.timer

# Test automatic renewal (dry run)
sudo certbot renew --dry-run

# View renewal timer details
sudo systemctl list-timers certbot-renew
```

### Let's Encrypt Certificate Management

Let's Encrypt certificates expire every 90 days. The automatic renewal setup above ensures certificates are renewed automatically:

- **Automatic Renewal**: The `certbot-renew.timer` runs twice daily
- **Renewal Threshold**: Certificates are renewed when they have 30 days or less remaining
- **Post-Renewal Hook**: Nginx automatically reloads when certificates are renewed

```bash
# Manual renewal (if needed)
sudo certbot renew

# Force renewal (for testing)
sudo certbot renew --force-renewal

# Check certificate expiration dates
sudo certbot certificates

# Set up custom renewal hook (optional)
sudo tee /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh > /dev/null <<EOF
#!/bin/bash
systemctl reload nginx
EOF

sudo chmod +x /etc/letsencrypt/renewal-hooks/deploy/nginx-reload.sh
```

## Step 5: Deploy Nginx Configuration

```bash
# Backup original nginx config
sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.backup

# Copy your custom nginx configuration
sudo cp nginx.conf /etc/nginx/sites-available/igorputina.com

# Create sites-available and sites-enabled directories if they don't exist
sudo mkdir -p /etc/nginx/sites-available
sudo mkdir -p /etc/nginx/sites-enabled

# Enable the site
sudo ln -s /etc/nginx/sites-available/igorputina.com /etc/nginx/sites-enabled/

# Update main nginx.conf to include sites-enabled
sudo tee -a /etc/nginx/nginx.conf > /dev/null <<EOF

# Include site configurations
include /etc/nginx/sites-enabled/*;
EOF
```

## Step 6: Test and Restart Nginx

```bash
# Test nginx configuration
sudo nginx -t

# Restart nginx to apply changes
sudo systemctl restart nginx

# Check nginx status
sudo systemctl status nginx
```

## Step 7: Set Up Strapi (Backend for admin.igorputina.com)

```bash
# Install Node.js (required for Strapi)
sudo dnf install -y nodejs npm

# Install PM2 for process management
sudo npm install -g pm2

# Create strapi user (optional but recommended)
sudo useradd -m -s /bin/bash strapi
sudo su - strapi

# Clone or upload your Strapi project to /home/strapi/strapi-app
# Then install dependencies and build
cd /home/strapi/strapi-app
npm install
npm run build

# Start Strapi with PM2
pm2 start ecosystem.config.js --name strapi
pm2 save
pm2 startup

# Exit back to root/sudo user
exit

# Configure PM2 startup for strapi user
sudo env PATH=$PATH:/usr/bin pm2 startup systemd -u strapi --hp /home/strapi
```

## Step 8: Configure SELinux (if enabled)

```bash
# Check if SELinux is enforcing
getenforce

# If SELinux is enforcing, allow nginx to connect to network
sudo setsebool -P httpd_can_network_connect 1

# Allow nginx to read files in /var/www
sudo restorecon -Rv /var/www/
```

## Step 9: Monitoring and Logs

```bash
# View nginx access logs
sudo tail -f /var/log/nginx/access.log

# View nginx error logs
sudo tail -f /var/log/nginx/error.log

# Check Strapi logs (if using PM2)
pm2 logs strapi
```

## Step 10: Final Verification

1. Visit https://igorputina.com to verify main site
2. Visit https://admin.igorputina.com to verify Strapi admin
3. Check SSL certificates are working properly
4. Verify redirects from HTTP to HTTPS work

## Maintenance Commands

```bash
# Restart nginx
sudo systemctl restart nginx

# Reload nginx (for config changes without downtime)
sudo systemctl reload nginx

# Check nginx syntax
sudo nginx -t

# Renew SSL certificates manually
sudo certbot renew --dry-run

# Update Strapi
sudo su - strapi
cd /home/strapi/strapi-app
npm update
npm run build
pm2 restart strapi
```

## Security Hardening (Optional)

```bash
# Install fail2ban to protect against brute force attacks
sudo dnf install -y fail2ban

# Create jail configuration for nginx
sudo tee /etc/fail2ban/jail.d/nginx.conf > /dev/null <<EOF
[nginx-http-auth]
enabled = true
port = http,https
logpath = /var/log/nginx/error.log

[nginx-noscript]
enabled = true
port = http,https
logpath = /var/log/nginx/access.log
maxretry = 6
EOF

# Start and enable fail2ban
sudo systemctl enable fail2ban
sudo systemctl start fail2ban
```

## Troubleshooting

- **502 Bad Gateway**: Check if Strapi is running on port 1337
- **Permission Denied**: Verify nginx user has access to web directories
- **SSL Issues**: Check certificate paths in nginx config
- **Firewall Issues**: Ensure ports 80 and 443 are open

For additional help, check:
- Nginx logs: `/var/log/nginx/`
- System logs: `journalctl -u nginx`
- Strapi logs: `pm2 logs strapi`