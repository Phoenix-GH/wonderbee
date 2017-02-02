import app from '../src';

export function generateEmojis() {
  const emojis = [
    { url: 'https://emoji.beeimg.com/😃/200', name: 'smile' },
    { url: 'https://emoji.beeimg.com/🍔/200', name: 'hamburger' },
    { url: 'https://emoji.beeimg.com/😬/200', name: 'grin' },
    { url: 'https://emoji.beeimg.com/🍿/200', name: 'popcorn' },
    { url: 'https://emoji.beeimg.com/😂/200', name: 'cry' },
    { url: 'https://emoji.beeimg.com/⛄/200', name: 'snow' },
    { url: 'https://emoji.beeimg.com/🗺/200', name: 'map' },
  ];
  const promises = emojis.map(emoji => app.service('emojis').create({ height: 200, width: 200, ...emoji }));
  return Promise.all(promises);
}
