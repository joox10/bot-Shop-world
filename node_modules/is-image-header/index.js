const axios = require('axios');
const isUrl = require('./is-url.js');
const { name, version, devDependencies } = require('./package.json');

const defaultHeaders = {
	'User-Agent': `${name}/${version} (+https://github.com/sefinek24/is-image-header)${process.env.JEST_WORKER_ID ? ` jest/${devDependencies.jest.replace(/^[^0-9]*/, '')}` : ''}`,
	'Connection': 'keep-alive',
	'DNT': '1'
};

module.exports = async url => {
	if (!isUrl(url)) return { success: false, status: 1, message: 'Invalid URL', error: false, isImage: false };

	try {
		const res = await axios.head(url, {
			headers: { ...defaultHeaders },
			timeout: 10000, // Request timeout
			validateStatus: status => status >= 200 && status < 511 // Accept all status codes
		});

		if (res.status === 404) {
			return { success: false, status: res.status, error: false, message: res.statusText, isImage: false };
		}

		if (res.status !== 200) {
			return { success: false, status: res.status, error: true, message: res.statusText, isImage: null };
		}

		const contentType = res.headers['content-type'];
		if (contentType?.startsWith('image/')) {
			return { success: true, status: res.status, error: false, isImage: true };
		} else {
			return { success: true, status: res.status, error: false, isImage: false };
		}
	} catch (err) {
		return {
			success: false,
			status: 3,
			error: true,
			isImage: null,
			message: `Error while fetching the resource: ${err.message}`
		};
	}
};