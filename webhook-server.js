#!/usr/bin/env node

/**
 * Simple webhook server to receive GitHub push notifications
 * and trigger deployments
 */

const http = require('http');
const crypto = require('crypto');
const { spawn } = require('child_process');
const fs = require('fs');

// Configuration
const PORT = process.env.WEBHOOK_PORT || 3001;
const SECRET = process.env.WEBHOOK_SECRET || 'your-webhook-secret-change-this';
const PROJECT_DIR = '/home/igor/personal-site';
const LOG_FILE = '/var/log/webhook-server.log';

// Logging function
function log(message) {
    const timestamp = new Date().toISOString();
    const logMessage = `${timestamp} - ${message}\n`;
    console.log(logMessage.trim());

    // Append to log file
    fs.appendFileSync(LOG_FILE, logMessage);
}

// Verify GitHub webhook signature
function verifySignature(body, signature) {
    const expectedSignature = `sha256=${crypto
        .createHmac('sha256', SECRET)
        .update(body)
        .digest('hex')}`;

    return crypto.timingSafeEqual(
        Buffer.from(signature),
        Buffer.from(expectedSignature)
    );
}

// Execute deployment
function deploy(callback) {
    log('Starting deployment...');

    const deployScript = spawn('./webhook-deploy.sh', [], {
        cwd: PROJECT_DIR,
        stdio: 'pipe'
    });

    let output = '';

    deployScript.stdout.on('data', (data) => {
        output += data.toString();
    });

    deployScript.stderr.on('data', (data) => {
        output += data.toString();
    });

    deployScript.on('close', (code) => {
        if (code === 0) {
            log('✅ Deployment completed successfully');
            callback(null, 'Deployment successful');
        } else {
            log(`❌ Deployment failed with exit code ${code}`);
            log(`Output: ${output}`);
            callback(new Error(`Deployment failed with exit code ${code}`));
        }
    });
}

// Create HTTP server
const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Hub-Signature-256');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }

    // Health check endpoint
    if (req.method === 'GET' && req.url === '/health') {
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ status: 'healthy', timestamp: new Date().toISOString() }));
        return;
    }

    // Webhook endpoint
    if (req.method === 'POST' && req.url === '/deploy') {
        let body = '';

        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            try {
                // Verify signature if provided (GitHub webhook)
                const signature = req.headers['x-hub-signature-256'];
                if (signature && !verifySignature(body, signature)) {
                    log('❌ Invalid webhook signature');
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid signature' }));
                    return;
                }

                // Parse webhook payload
                let payload;
                try {
                    payload = JSON.parse(body);
                } catch (e) {
                    // If it's not JSON, treat as manual trigger
                    payload = { manual: true };
                }

                log(`📨 Webhook received: ${payload.manual ? 'Manual trigger' : `Push to ${payload.ref || 'unknown'}`}`);

                // Only deploy on pushes to main branch (or manual triggers)
                if (payload.manual || (payload.ref === 'refs/heads/main')) {
                    deploy((error, result) => {
                        if (error) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: error.message }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: result }));
                        }
                    });
                } else {
                    log(`ℹ️  Ignoring push to ${payload.ref} (only main branch triggers deployment)`);
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Push ignored (not main branch)' }));
                }
            } catch (error) {
                log(`❌ Error processing webhook: ${error.message}`);
                res.writeHead(500, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: 'Internal server error' }));
            }
        });

        return;
    }

    // 404 for all other routes
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not found' }));
});

// Start server
server.listen(PORT, () => {
    log(`🚀 Webhook server listening on port ${PORT}`);
    log(`📝 Logs will be written to ${LOG_FILE}`);
    log(`🔗 Health check: http://localhost:${PORT}/health`);
    log(`📨 Webhook endpoint: http://localhost:${PORT}/deploy`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
    log('📴 Shutting down webhook server...');
    server.close(() => {
        log('✅ Webhook server stopped');
        process.exit(0);
    });
});

process.on('SIGINT', () => {
    log('📴 Shutting down webhook server...');
    server.close(() => {
        log('✅ Webhook server stopped');
        process.exit(0);
    });
});