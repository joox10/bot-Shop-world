const urlPattern = /(https?|http):\/\/[^\s/$.?#].[^\\s]*/i;

module.exports = str => {
	if (str && typeof str === 'string' && urlPattern.test(str)) {
		try {
			const url = new URL(str);
			if (url.protocol === 'http:' || url.protocol === 'https:') {
				return true;
			}
		} catch (err) {
			console.error('Error parsing URL:', err);
		}
	}

	return false;
};