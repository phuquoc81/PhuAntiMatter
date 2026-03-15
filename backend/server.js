const fs = require('node:fs');
const path = require('node:path');
const http = require('node:http');

const auth = require('./auth');
const economy = require('./economy');
const leaderboard = require('./leaderboard');
const payment = require('./payment');

const frontendDir = path.join(__dirname, '..', 'frontend');
const contentTypes = {
  '.css': 'text/css; charset=utf-8',
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
};

function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(data));
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';

    req.on('data', (chunk) => {
      body += chunk;

      if (body.length > 1_000_000) {
        reject(new Error('request body too large'));
      }
    });

    req.on('end', () => {
      if (!body) {
        resolve({});
        return;
      }

      try {
        resolve(JSON.parse(body));
      } catch {
        reject(new Error('invalid json body'));
      }
    });

    req.on('error', reject);
  });
}

function serveStatic(req, res, pathname) {
  const requestedPath = pathname === '/' ? '/index.html' : pathname;
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, '');
  const filePath = path.join(frontendDir, safePath);

  if (!filePath.startsWith(frontendDir)) {
    sendJson(res, 403, { error: 'forbidden' });
    return true;
  }

  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    return false;
  }

  const ext = path.extname(filePath);
  res.writeHead(200, { 'Content-Type': contentTypes[ext] || 'text/plain; charset=utf-8' });
  fs.createReadStream(filePath).pipe(res);
  return true;
}

function handleEconomyResult(res, result) {
  sendJson(res, result.status, result.player || { error: result.error, payout: result.payout, currency: result.currency });
}

async function requestHandler(req, res) {
  const url = new URL(req.url, 'http://127.0.0.1');
  const { pathname } = url;

  if (req.method === 'GET' && pathname === '/api/health') {
    sendJson(res, 200, { status: 'ok' });
    return;
  }

  if (req.method === 'GET' && pathname === '/api/leaderboard') {
    sendJson(res, 200, leaderboard.getLeaderboard(economy.getPlayers()));
    return;
  }

  if (req.method === 'POST') {
    let body;

    try {
      body = await parseBody(req);
    } catch (error) {
      sendJson(res, 400, { error: error.message });
      return;
    }

    if (pathname === '/api/register') {
      const result = auth.register(body);
      sendJson(res, result.status, result.user || { error: result.error });
      return;
    }

    if (pathname === '/api/login') {
      const result = auth.login(body);
      sendJson(res, result.status, result.token ? { token: result.token, user: result.user } : { error: result.error });
      return;
    }

    if (pathname === '/api/mine') {
      handleEconomyResult(res, economy.generateAntimatter(body.user));
      return;
    }

    if (pathname === '/api/upgrade') {
      handleEconomyResult(res, economy.upgrade(body));
      return;
    }

    if (pathname === '/api/convert') {
      handleEconomyResult(res, economy.convertTokens(body.user));
      return;
    }

    if (pathname === '/api/payout') {
      const result = economy.payout(body.user);
      sendJson(res, result.status, result.payout ? { payout: result.payout, currency: result.currency, player: result.player } : { error: result.error, player: result.player });
      return;
    }

    if (pathname === '/api/buy-tokens') {
      payment.buyTokens({ body }, res);
      return;
    }
  }

  if (req.method === 'GET' && serveStatic(req, res, pathname)) {
    return;
  }

  sendJson(res, 404, { error: 'not found' });
}

function createServer() {
  return http.createServer((req, res) => {
    requestHandler(req, res).catch((error) => {
      sendJson(res, 500, { error: error.message });
    });
  });
}

if (require.main === module) {
  const port = Number(process.env.PORT) || 3000;
  createServer().listen(port, () => {
    console.log(`PhuAntimatter server running on port ${port}`);
  });
}

module.exports = {
  createServer,
};
