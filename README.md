
# PlaygroundAI

Search, create and modify images using artificial intelligence. It is an unofficial implementation of the [PlaygoundAI](https://playgroundai.com) site to be able to use easily and quickly


## Installation

Install this project with npm

```bash
  npm install --save playgroundai
```

## Before running

You need to obtain the sessionToken and csrfToken data, which are obtained by entering the [PlaygoundAI](https://playgroundai.com) site, logging in, accessing the site's cookies and obtaining the values ​​of:

- __Secure-next-auth.session-token
- __Host-next-auth.csrf-token
## Demo

Example of an image search

```js
const PlaygroundAI = require('playgoundai');

const main = async () => {
  const playgroundAI = new PlaygroundAI();
  const info = await playgroundAI.search('cyber cat');
  console.log('INFO', info);
}

main();
```

Example of creating an image

```js
const PlaygroundAI = require('playgoundai');

const main = async () => {
  const playgroundAI = new PlaygroundAI({
    sessionToken: 'YOUR_SESSION_TOKEN',
    csrfToken: 'YOUR_CSRF_TOKEN'
  });
  const info = await playgroundAI.create('super mario cyberpunk style driving a car on a rainbow track');
  console.log('INFO', info);
}

main();
```

Example of modifying an image

```js
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
```


## Authors

- [@luiscruzga](https://www.github.com/luiscruzga)

