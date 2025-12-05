const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  console.log('🔧 Setting up proxy middleware...');
  
  // Proxy for external LLM API to bypass CORS
  app.use(
    '/api/ai',
    createProxyMiddleware({
      target: 'http://jvision.s2x.kr:8030',
      changeOrigin: true,
      secure: false,
      logLevel: 'debug',
      onProxyReq: (proxyReq, req, res) => {
        console.log('→ Proxying request:', req.method, req.url);
        console.log('→ Target:', 'http://jvision.s2x.kr:8030' + req.url);
      },
      onProxyRes: (proxyRes, req, res) => {
        console.log('← Response status:', proxyRes.statusCode, 'for', req.url);
      },
      onError: (err, req, res) => {
        console.error('❌ Proxy Error:', err.message);
        res.status(500).json({ 
          error: 'Proxy error', 
          message: err.message 
        });
      }
    })
  );
  
  console.log('✅ Proxy middleware configured for /api/ai/* -> http://jvision.s2x.kr:8030');
};

