const jwt = require('jsonwebtoken');

module.exports = function handler(req, res) {
  const origin = req.headers.origin;
  if (origin && origin !== process.env.ALLOWED_ORIGIN) {
    return res.status(403).json({ error: 'Access denied: Invalid Origin' });
  }

  res.setHeader('Access-Control-Allow-Origin', process.env.ALLOWED_ORIGIN || '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  res.setHeader('Content-Type', 'application/json');

  if (req.method === 'OPTIONS') { res.status(200).end(); return; }
  if (req.method !== 'GET') { res.status(405).json({ error: 'Méthode non autorisée.' }); return; }

  const secret = process.env.JWT_SECRET;
  if (!secret) { return res.status(500).json({ error: 'Serveur mal configuré.' }); }

  const token = jwt.sign({ client: 'iptv-web' }, secret, { expiresIn: '1h' });
  res.status(200).json({ token });
};
