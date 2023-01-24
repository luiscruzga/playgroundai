const PlaygroundAI = require('../src/');
const path = require('path');
const fs = require('fs');
const download = require('image-downloader');

const main = async () => {
  const playgroundAI = new PlaygroundAI({
    sessionToken: 'YOUR_SESSION_TOKEN',
    csrfToken: 'YOUR_CSRF_TOKEN'
  });
  const info = await playgroundAI.modify({
    prompt: 'add a hat and glasses',
    image: path.join(__dirname, '../images/brad_pitt.png')
  });
  console.log('INFO', info);

  if (!info.error) {
    download.image({
      url: info.url,
      dest: path.join(__dirname, '../images/brad_pitt_modify.png')
    });
  }
}

main();