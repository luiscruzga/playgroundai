const PlaygroundAI = require('../src/');

const main = async () => {
  const playgroundAI = new PlaygroundAI('');
  const info = await playgroundAI.search('cyber cat');
  console.log('INFO', info);
}

main();