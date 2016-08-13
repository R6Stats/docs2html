var SwaggerParser = require('swagger-parser');

var ex = {};

ex.getSections = function(callback) {
	SwaggerParser.validate("swagger.yaml", function(err, api) {
		console.log(err, api)
		var sections = {};
		var keys = Object.keys(api.paths);
		for (var path of keys) {
			var subs = Object.keys(api.paths[path]);
			for (var x of subs) {
				var i = api.paths[path][x];
				i.path = path;
				i.method = x;
				console.log(i);
				var tags = i['tags'];
				var main = tags[0];
				if (!sections[main]) {
					sections[main] = [];
				}
				sections[main].push(i);
			}
		}
		console.log(sections)
		callback(sections);
	});

}

module.exports = ex;
