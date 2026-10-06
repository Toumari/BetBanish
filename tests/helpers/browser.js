const fs = require('fs');
const path = require('path');

function storageArea(initial = {}) {
  const values = { ...initial };
  return {
    values,
    get: jest.fn((defaults, callback) => {
      const result = { ...defaults, ...values };
      if (callback) callback(result);
      return Promise.resolve(result);
    }),
    set: jest.fn((updated, callback) => {
      Object.assign(values, updated);
      if (callback) callback();
      return Promise.resolve();
    })
  };
}

function loadPage(name) {
  document.documentElement.innerHTML = fs.readFileSync(path.join(__dirname, '../../', name), 'utf8');
}

function runScript(...names) {
  window.eval(names.map(name => fs.readFileSync(path.join(__dirname, '../../', name), 'utf8')).join('\n'));
}

async function settle() {
  for (let i = 0; i < 10; i++) await Promise.resolve();
}

module.exports = { storageArea, loadPage, runScript, settle };
