const crypto = require('node:crypto');

const users = [];

function hashPassword(password, salt = crypto.randomUUID()) {
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

function verifyPassword(password, passwordHash) {
  const [salt, storedHash] = passwordHash.split(':');
  const computedHash = crypto.scryptSync(password, salt, 64).toString('hex');
  return crypto.timingSafeEqual(Buffer.from(storedHash, 'hex'), Buffer.from(computedHash, 'hex'));
}

function sanitizeUser(user) {
  return {
    id: user.id,
    email: user.email,
    username: user.username,
    phu_tokens: user.phu_tokens,
    gold_coins: user.gold_coins,
    points: user.points,
    dimension: user.dimension,
    created_at: user.created_at,
  };
}

function register({ email, username, password }) {
  if (!email || !username || !password) {
    return { error: 'email, username, and password are required', status: 400 };
  }

  if (users.some((user) => user.email === email)) {
    return { error: 'email already registered', status: 409 };
  }

  const user = {
    id: users.length + 1,
    email,
    username,
    password_hash: hashPassword(password),
    phu_tokens: 0,
    gold_coins: 0,
    points: 0,
    dimension: 1,
    created_at: new Date().toISOString(),
  };

  users.push(user);

  return { user: sanitizeUser(user), status: 201 };
}

function login({ email, password }) {
  const user = users.find((entry) => entry.email === email);

  if (!user || !verifyPassword(password, user.password_hash)) {
    return { error: 'invalid login', status: 401 };
  }

  return {
    status: 200,
    token: crypto.createHash('sha256').update(`${user.id}:${user.email}`).digest('hex'),
    user: sanitizeUser(user),
  };
}

module.exports = {
  login,
  register,
};
