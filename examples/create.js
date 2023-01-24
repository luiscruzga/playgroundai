const PlaygroundAI = require('../src/');

const main = async () => {
  const playgroundAI = new PlaygroundAI({
    sessionToken: 'YOUR_SESSION_TOKEN',
    csrfToken: 'YOUR_CSRF_TOKEN'
  });
  const info = await playgroundAI.create('super mario cyberpunk style driving a car on a rainbow track');
  console.log('INFO', info);
}

main();