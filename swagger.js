var SwaggerParser = require('swagger-parser');

var ex = {};

ex.getSections = function(callback) {
	SwaggerParser.validate("swagger.yaml", function(err, api) {
		if (err) {
			console.warn("Error parsing API");
			return {};
		}
		// console.log(api)
		// ex.modelRecurser(api.definitions["OperatorListItem"])
		var sections = {};
		var keys = Object.keys(api.paths);
		for (var path of keys) {
			var subs = Object.keys(api.paths[path]);
			for (var x of subs) {
				var i = api.paths[path][x];
				i.path = path;
				i.method = x;
				// console.log(i);
				var tags = i['tags'];
				var main = tags[0];
				if (!sections[main]) {
					sections[main] = [];
				}
				sections[main].push(i);
			}
		}
		// console.log(JSON.stringify(api))
		callback(api, sections);
	});

}

// ex.modelRecurser = function(definition, models) {
// 	var props = definition.properties;
// 	var required = definition.required;

// 	var model = {};

// 	var keys = Object.keys(props);
// 	console.log(JSON.stringify(props))
// 	for (var x = 0; x < keys.length; x++) {
// 		var key = keys[x];
// 		var prop = props[key];

// 		// var type = prop['type'];
// 	}
// }

module.exports = ex;
