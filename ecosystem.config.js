/**
 * PM2 Ecosystem Configuration
 * ===========================
 * 
 * Tells PM2 how to run your Next.js app in production:
 * - Where the app is located (cwd)
 * - What command to run (node .next/standalone/server.js)
 * - What port to use (PORT env var)
 * - Memory limits and restart policies
 * 
 * Setup on server:
 *   1. Clone repo to /var/www/app
 *   2. Build: npm run build:prod
 *   3. Start: pm2 start ecosystem.config.js
 *   4. Save: pm2 save
 *   5. Auto-start: pm2 startup
 * 
 * Useful commands:
 *   pm2 start ecosystem.config.js  - Start the app
 *   pm2 restart app-prod           - Restart production
 *   pm2 logs app-prod              - View logs
 *   pm2 monit                      - Real-time monitoring
 *   pm2 save                       - Save current process list
 */

module.exports = {
  apps: [
    {
      name: 'app-prod',
      cwd: '/var/www/app',
      script: 'node',
      args: '.next/standalone/server.js',
      env: {
        PORT: 3000,
        NODE_ENV: 'production'
      },
      // Restart if memory exceeds 500MB
      max_memory_restart: '500M',
      // Exponential backoff restart delay
      exp_backoff_restart_delay: 100,
      // Merge logs into single file
      merge_logs: true,
      // Log date format
      log_date_format: 'YYYY-MM-DD HH:mm:ss Z'
    }
  ]
}

