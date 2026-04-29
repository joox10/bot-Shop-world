# 🌍 » What is that?
This module checks if the URL leads to a photo by analyzing the header.

## 🤔 » Installation
```bash
npm install is-image-header
````

## 📝 » Usage
### • Async/await example
```js
const isImage = require('is-image-header');

(async () => {
    const example1 = await isImage('https://cdn.sefinek.net/images/animals/cat/cat-story-25-1377426-min.jpg');
    console.log(example1); // { success: true, status: 200, error: false, isImage: true }

    const example2 = await isImage('https://sefinek.net');
    console.log(example2); // { success: true, status: 200, error: false, isImage: false }
})();
```

### • Promise example
```js
const isImage = require('is-image-header');

isImage('https://cdn.sefinek.net/images/animals/cat/cat-story-25-1377426-min.jpg').then(console.log); // { success: true, status: 200, error: false, isImage: true }
isImage('https://sefinek.net').then(console.log); // { success: true, status: 200, error: false, isImage: false }
```

## 🤝 » Help
Open new [Issue](https://github.com/sefinek24/is-image-header/issues/new/choose) on GitHub.

## ⭐ » Star
If you like this module, please star [the repository](https://github.com/sefinek24/random-cat-img).

## 📜 » License MIT
<div align="center">
    Copyright 2023-2024 © by <a href="https://sefinek.net">Sefinek</a>. All Rights Reserved.
</div>