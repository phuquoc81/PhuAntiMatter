function renderWallet(player) {
  const tokens = document.getElementById('tokens');

  if (tokens) {
    tokens.innerText = String(player.phu_tokens || 0);
  }
}

export { renderWallet };
