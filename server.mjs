import http from 'node:http';
import { readFile, appendFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
const root = path.resolve(fileURLToPath(new URL('./public/', import.meta.url)));
const data = process.env.RSVP_FILE || fileURLToPath(new URL('./data/responses.jsonl', import.meta.url));
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.png': 'image/png', '.svg': 'image/svg+xml', '.ttf': 'font/ttf', '.txt': 'text/plain; charset=utf-8' };
export const server = http.createServer(async (req, res) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  try {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/rsvp' && req.method === 'POST') {
      let body = '';
      for await (const chunk of req) { body += chunk; if (Buffer.byteLength(body) > 4096) { res.writeHead(413).end(); return; } }
      let value;
      try { value = JSON.parse(body); } catch { res.writeHead(400).end('Invalid JSON'); return; }
      const { name, attending, note = '', website = '' } = value || {};
      if (website || typeof name !== 'string' || !name.trim() || name.length > 100 || !['yes','no'].includes(attending) || typeof note !== 'string' || note.length > 500) {
        res.writeHead(400).end('Invalid response'); return;
      }
      await mkdir(path.dirname(data), { recursive: true });
      await appendFile(data, JSON.stringify({ name: name.trim(), attending, note: note.trim(), receivedAt: new Date().toISOString() }) + '\n', { mode: 0o600 });
      res.writeHead(201, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' }).end(JSON.stringify({ ok: true })); return;
    }
    if (!['GET','HEAD'].includes(req.method)) { res.writeHead(405).end(); return; }
    const file = path.resolve(root, '.' + decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname));
    if (!file.startsWith(root + path.sep)) { res.writeHead(403).end(); return; }
    const content = await readFile(file);
    res.writeHead(200, { 'Content-Type': types[path.extname(file)] || 'application/octet-stream' });
    res.end(req.method === 'HEAD' ? undefined : content);
  } catch (error) { res.writeHead(error.code === 'ENOENT' || error.code === 'EISDIR' ? 404 : 500).end('Request failed'); }
});
if (process.argv[1] === fileURLToPath(import.meta.url)) server.listen(Number(process.env.PORT || 3000), '0.0.0.0', () => console.log('Birthday invitation running on port ' + (process.env.PORT || 3000)));
