function renderAchievements(player) {
  const list = document.getElementById('achievements');

  if (!list) {
    return;
  }

  const achievements = player.achievements || [];
  list.innerHTML = achievements.length
    ? achievements.map((badge) => `<li>${badge}</li>`).join('')
    : '<li>No achievements unlocked yet.</li>';
}

export { renderAchievements };
