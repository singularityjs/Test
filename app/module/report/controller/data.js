"use strict";

module.exports = function($) {
	return $.require([
		//
	], function(
		//
	) {

		var obj = function() {};
		obj.prototype = $.extends('!controller', {
			heat: function(data) {
				return (this.file({contentDisposition: 'inline', path: $.path('cache!/heat_map.json')}));
			},
			raw: function(data) {
				return (this.file({contentDisposition: 'inline', path: $.path('cache!/raw.json')}));
			},

			tree: function(path) {
				var run = function(path, data) {
					if (path.match('node_modules') || path.match('resources') || path.match('.git')) {
						return $.promise().resolve(true);
					}

					path = $.path(path);
		            return $.file.stat(path).then(function(stat) {
		                if (stat.isDirectory()) {
		                    return $.file.list(path).then(function(res) {
		                        var wait = [];
		                        for (var i in res) {
									if (!data[res[i]]) {
										data[res[i]] = {};
									}
		                            wait.push(run(path + '/' + res[i], data[res[i]]));
		                        }
		                        return ($.all(wait));
		                    });
		                } else {
							data[path] = true;
		                    return (true);
		                }
		            }, function() {
		                return (true);
		            })
		        }

				const data = {};
				return run($.path('absolute!'), data).then(() => {
					return this.res().status(200).data(data);
				})
	        }
		});

		return ({'static private': obj});
	});
};
