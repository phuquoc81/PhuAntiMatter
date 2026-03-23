import { renderAchievements } from './achievements.js';
import { bindButton } from './buttons.js';
import { getMultiplayerStatus } from './multiplayer.js';
import { renderWallet } from './wallet.js';

const player = 'phu-player';

function updatePlayer(state) {
  document.getElementById('antimatter').innerText = state.antimatter;
  document.getElementById('dimension').innerText = state.dimension;
  document.getElementById('multiplier').innerText = state.multiplier;
  renderWallet(state);
  renderAchievements(state);
}

async function callApi(path, payload = {}) {
  const response = await fetch(path, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }

  return data;
}

async function mine() {
  const state = await callApi('/api/mine', { user: player });
  updatePlayer(state);
}

async function upgrade(type) {
  const state = await callApi('/api/upgrade', { user: player, type });
  updatePlayer(state);
}

async function convert() {
  const state = await callApi('/api/convert', { user: player });
  updatePlayer(state);
}

async function buyTokens(event) {
  event.preventDefault();

  const paymentResult = document.getElementById('payment-result');
  const amount = Number(document.getElementById('payment-amount').value);
  const paymentMethod = document.getElementById('payment-method').value;

  try {
    const data = await callApi('/api/buy-tokens', {
      amount,
      payment_method: paymentMethod,
    });

    paymentResult.innerText = data.checkoutUrl
      ? `Stripe checkout ready: ${data.checkoutUrl}`
      : data.instructions;
  } catch (error) {
    paymentResult.innerText = error.message;
  }
}

document.getElementById('multiplayer-status').innerText = `Multiplayer: ${getMultiplayerStatus()}`;

bindButton('mine-button', () => {
  mine().catch((error) => {
    document.getElementById('payment-result').innerText = error.message;
  });
});

bindButton('reactor-button', () => {
  upgrade('reactor').catch((error) => {
    document.getElementById('payment-result').innerText = error.message;
  });
});

bindButton('dimension-button', () => {
  upgrade('dimension').catch((error) => {
    document.getElementById('payment-result').innerText = error.message;
  });
});

bindButton('convert-button', () => {
  convert().catch((error) => {
    document.getElementById('payment-result').innerText = error.message;
  });
});

document.getElementById('payment-form').addEventListener('submit', (event) => {
  buyTokens(event);
});

mine().catch(() => {});
