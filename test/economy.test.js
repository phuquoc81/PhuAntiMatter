const test = require('node:test');
const assert = require('node:assert/strict');

const economy = require('../backend/economy');

test('generateAntimatter initializes and increments a player', () => {
  const result = economy.generateAntimatter('tester');

  assert.equal(result.status, 200);
  assert.equal(result.player.antimatter, 1);
  assert.equal(result.player.dimension, 1);
  assert.equal(result.player.multiplier, 1);
});

test('upgrade increases reactor multiplier and dimension', () => {
  economy.upgrade({ user: 'upgrade-user', type: 'reactor' });
  const result = economy.upgrade({ user: 'upgrade-user', type: 'dimension' });

  assert.equal(result.status, 200);
  assert.equal(result.player.multiplier, 2);
  assert.equal(result.player.dimension, 2);
});

test('convertTokens requires at least 1000 antimatter', () => {
  const result = economy.convertTokens('convert-user');

  assert.equal(result.status, 400);
  assert.equal(result.error, 'not enough antimatter');
});
