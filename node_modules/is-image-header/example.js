const IsImage = require('./index.js');

(async () => {
	const image = await IsImage('https://cdn.sefinek.net');
	console.log(image);
})();