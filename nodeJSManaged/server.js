/*eslint no-console: 0, no-shadow: 0*/
"use strict";

var http = require("http");
var port = process.env.PORT || 3000;

http.createServer(function(req, res) {
	var xsenv = require("@sap/xsenv");
	var createInstanceManager = require("@sap/instance-manager").create;

	var options = xsenv.getServices({
		hana: {
			tag: "managed-hana"
		}
	});
	console.log(JSON.stringify(options.hana)        );
	createInstanceManager(options.hana, function(err, instanceManager) {
		if (err) {
			return console.log("Create instance manager error: ", err.message);
		}

		instanceManager.create("my-tenant", function(err, instance) {
			if (err) {
				return console.log("Create error: ", err.message);
			}

			// consume instance.credentials
			console.log(instance);

			instanceManager.get("my-tenant", function(err, instance) {
				if (err) {
					return console.log("Get error: ", err.message);
				}

				// same instance
				console.log(instance);

				instanceManager.delete("my-tenant", function(err) {
					if (err) {
						return console.log("Delete error: ", err.message);
					}

					console.log("Instance deleted");
				});
			});
		});
	});

	res.writeHead(200, {
		"Content-Type": "text/plain"
	});
	res.end("Instance Test\n");
}).listen(port);

console.log("Server listening on port %d", port);