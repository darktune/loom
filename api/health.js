export default function handler(req, res) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');

  res.status(200).json({
    status: 'online',
    app: 'LOOM Virtual Atelier Serverless Gateway',
    environment: process.env.VERCEL_ENV || 'production',
    region: process.env.VERCEL_REGION || 'iad1',
    timestamp: new Date().toISOString()
  });
}
