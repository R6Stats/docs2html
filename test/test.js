/* globals describe, it, before, after */

var assert = require("assert");
var SwaggerParser = require('swagger-parser');
var swagger = require('../swagger');

describe("YML Validation", function() {
    it("has valid yml", function(done) {
        this.timeout(10000);
        SwaggerParser.validate("swagger.yaml", function(err, api) {
	       assert.strictEqual(err, null);
	       done();
	    });
    });

    it("has multiple sections", function(done) {
        this.timeout(10000);
        swagger.getSections(function(sections) {
            var keys = Object.keys(sections);
            assert.strictEqual(keys.length > 0, true);
            done();
        })
    });
})