import path from 'node:path';
import { pathToFileURL } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

function localVercelApiPlugin() {
  return {
    name: 'local-vercel-api',
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), '');
      for (const [k, v] of Object.entries(env)) {
        if (process.env[k] === undefined) {
          process.env[k] = v;
        }
      }

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || !req.url.startsWith('/api/')) return next();

        const pathname = req.url.split('?')[0];
        let handlerFile = null;
        if (pathname === '/api/config') handlerFile = 'config.js';
        else if (pathname === '/api/ai') handlerFile = 'ai.js';
        else if (pathname === '/api/submissions') handlerFile = 'submissions.js';

        if (!handlerFile) {
          res.statusCode = 404;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: 'API route not found' }));
          return;
        }

        try {
          if (req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH') {
            const chunks = [];
            for await (const chunk of req) chunks.push(chunk);
            const raw = Buffer.concat(chunks).toString('utf8');
            try {
              req.body = raw ? JSON.parse(raw) : {};
            } catch {
              req.body = raw;
            }
          }

          const wrappedRes = {
            setHeader: (name, val) => res.setHeader(name, val),
            status(code) {
              res.statusCode = code;
              return this;
            },
            json(payload) {
              if (!res.getHeader('Content-Type')) {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
              }
              res.end(JSON.stringify(payload));
              return this;
            },
          };

          const absFile = path.resolve(process.cwd(), 'api', handlerFile);
          const fileUrl = `${pathToFileURL(absFile).href}?t=${Date.now()}`;
          const mod = await import(fileUrl);
          await mod.default(req, wrappedRes);
        } catch (err) {
          res.statusCode = 500;
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify({ ok: false, error: err.message || 'Internal server error' }));
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [react(), localVercelApiPlugin()],
  build: {
    target: 'esnext',
  },
});
