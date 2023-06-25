// initial page load's url
function url() {
  return 'http://localhost:3000/';
}

const IMG_PATH_DIR = '.memlab/img';

// action where you suspect the memory leak might be happening
async function action(page) {
  await page.screenshot({ path: `${IMG_PATH_DIR}/img.png` });
}

// how to go back to the state before action
async function back(page) {}

module.exports = { action, back, url };

// docker コンテナ内だと --chromium-binary で指定してあげないと動かなかった
// npx memlab run --scenario .memlab/memlab.js --chromium-binary /usr/bin/chromium
