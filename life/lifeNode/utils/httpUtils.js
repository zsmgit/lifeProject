var https = require("https");

function post(options,data) {
	return new Promise((resolve, reject) => {
		
		post_req = https.request(options, (res) => {
			
			res.setEncoding('utf8');
			
			let rawData = '';
			res.on('data', (chunk) => {
				rawData += chunk;
			});
			res.on('end', () => {
				resolve(rawData);
			});
			res.on('error', () => {
				reject(error)
			});
        });
        post_req.write(data);
        post_req.end();
	})
}

module.exports = {
    post:post
}