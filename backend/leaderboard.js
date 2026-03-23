function getLeaderboard(players) {
  return Object.values(players)
    .sort((left, right) => right.antimatter - left.antimatter || right.dimension - left.dimension)
    .slice(0, 10)
    .map((player, index) => ({
      rank: index + 1,
      user: player.user,
      antimatter: player.antimatter,
      dimension: player.dimension,
      multiplier: player.multiplier,
      phu_tokens: player.phu_tokens,
    }));
}

module.exports = {
  getLeaderboard,
};
