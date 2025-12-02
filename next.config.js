/**
 * Next.js Configuration
 * =====================
 * 
 * Key settings:
 * - output: 'standalone' - Creates a minimal production bundle for Docker/PM2
 * - images.unoptimized - Disable image optimization (simpler for self-hosting)
 * - allowedDevOrigins - Whitelist for ngrok and local network testing
 * 
 * For production deployment, the standalone output is used with PM2.
 * See ecosystem.config.js for PM2 configuration.
 */

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',
  images: {
    unoptimized: true,
  },
  // Add your ngrok domain and local network IPs for mobile testing
  allowedDevOrigins: [
    '*.ngrok.dev',
    '*.ngrok-free.app',
    '192.168.*.*',
  ],
}

module.exports = nextConfig

