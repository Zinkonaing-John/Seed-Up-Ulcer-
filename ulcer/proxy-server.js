const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3002;

// Enable CORS for all origins
app.use(cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 Incoming: ${req.method} ${req.url}`);
  next();
});

// Proxy middleware - forward everything starting with /api/ai to external server
app.use('/api/ai', createProxyMiddleware({
  target: 'http://jvision.s2x.kr:8030',
  changeOrigin: true,
  logLevel: 'debug',
  onProxyReq: (proxyReq, req, res) => {
    const fullUrl = 'http://jvision.s2x.kr:8030' + req.originalUrl;
    console.log('→ Proxying to:', fullUrl);
  },
  onProxyRes: (proxyRes, req, res) => {
    console.log('← Response:', proxyRes.statusCode, 'from external API');
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy Error:', err.message);
    res.status(500).json({ error: 'Proxy error', message: err.message });
  }
}));

app.listen(PORT, () => {
  console.log(`\n✅ Proxy server running on http://localhost:${PORT}`);
  console.log(`📡 Forwarding /api/ai/* requests to http://jvision.s2x.kr:8030`);
  console.log(`\nTest with: http://localhost:${PORT}/api/ai/pressure-ulcer/predict/latest/3\n`);
});

