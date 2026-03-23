const players = {};

function ensurePlayer(user) {
  if (!user) {
    return null;
  }

  if (!players[user]) {
    players[user] = {
      user,
      antimatter: 0,
      dimension: 1,
      multiplier: 1,
      points: 0,
      phu_tokens: 0,
      achievements: [],
    };
  }

  return players[user];
}

function unlockAchievement(player, badge) {
  if (!player.achievements.includes(badge)) {
    player.achievements.push(badge);
  }
}

function generateAntimatter(user) {
  const player = ensurePlayer(user);

  if (!player) {
    return { error: 'user is required', status: 400 };
  }

  player.antimatter += player.dimension * player.multiplier;
  player.points += player.dimension;

  if (player.antimatter >= 100) {
    unlockAchievement(player, 'Century Reactor');
  }

  return { player, status: 200 };
}

function upgrade({ user, type }) {
  const player = ensurePlayer(user);

  if (!player) {
    return { error: 'user is required', status: 400 };
  }

  if (type === 'reactor') {
    player.multiplier += 1;
  } else if (type === 'dimension') {
    player.dimension += 1;
  } else {
    return { error: 'invalid upgrade type', status: 400 };
  }

  if (player.dimension >= 5) {
    unlockAchievement(player, 'Dimension Climber');
  }

  return { player, status: 200 };
}

function convertTokens(user) {
  const player = ensurePlayer(user);

  if (!player) {
    return { error: 'user is required', status: 400 };
  }

  if (player.antimatter < 1000) {
    return { error: 'not enough antimatter', status: 400, player };
  }

  player.antimatter -= 1000;
  player.phu_tokens += 1;
  unlockAchievement(player, 'First Token');

  return { player, status: 200 };
}

function payout(user) {
  const player = ensurePlayer(user);

  if (!player) {
    return { error: 'user is required', status: 400 };
  }

  if (player.points < 10000) {
    return { error: 'not enough points', status: 400, player };
  }

  player.points -= 10000;

  return {
    payout: 1,
    currency: 'USD',
    player,
    status: 200,
  };
}

function getPlayers() {
  return players;
}

module.exports = {
  convertTokens,
  ensurePlayer,
  generateAntimatter,
  getPlayers,
  payout,
  upgrade,
};
