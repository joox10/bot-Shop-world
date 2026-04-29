const isImage = require('../index.js');

describe('isImage', () => {
	it('should return the correct object for a valid image URL', async () => {
		const result = await isImage('https://cdn.sefinek.net/images/animals/cat/cat-story-25-1377426-min.jpg');
		expect(result).toEqual({
			success: true,
			status: 200,
			error: false,
			isImage: true
		});
	});

	it('should return the correct object for a valid non-image URL', async () => {
		const result = await isImage('https://sefinek.net');
		expect(result).toEqual({
			success: true,
			status: 200,
			error: false,
			isImage: false
		});
	});

	it('should return the correct object for an invalid URL', async () => {
		const result = await isImage('not-a-valid-url');
		expect(result).toEqual({
			success: false,
			status: 1,
			error: false,
			isImage: false,
			message: 'Invalid URL'
		});
	});

	it('should return the correct object for a failed resource fetch', async () => {
		const result = await isImage('https://sefinek.net/non-existing-image.jpg');
		expect(result).toEqual({
			success: false,
			status: 404,
			error: false,
			isImage: false,
			message: 'Not Found'
		});
	});

	it('should return the correct object for a request error', async () => {
		const result = await isImage('https://invalid-host/non-existing-image.jpg');
		expect(result).toEqual({
			success: false,
			status: 3,
			error: true,
			isImage: null,
			message: expect.stringContaining('Error while fetching the resource')
		});
	});
});
