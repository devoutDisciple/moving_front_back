const logMiddleware = (req, res, next) => {
	const { method, originalUrl } = req;
	let params = '';
	if (method === 'GET') {
		params = JSON.stringify(req.query);
	}
	if (method === 'POST') {
		params = JSON.stringify(req.body);
	}
	console.log(`method: ${method} url: ${originalUrl} params: ${params}`);
	next();
};

module.exports = logMiddleware;
