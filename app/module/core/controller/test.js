"use strict";

module.exports = function($) {
	return $.require([
		'core!git.js',
		'module!/entity/libary/array.js',
		'module!/entity/libary/cast.js',
		'module!/entity/libary/config.js',
		'module!/entity/libary/extends.js',
		'module!/entity/libary/function.js',
		'module!/entity/libary/is.js',
		'module!/entity/libary/json.js',
		'module!/entity/libary/key.js',
		'module!/entity/libary/midware.js',
		'module!/entity/libary/object.js',
		'module!/entity/libary/path.js',
		'module!/entity/libary/promise.js',
		'module!/entity/libary/require.js',
		'module!/entity/libary/schema.js',
		'module!/entity/libary/string.js',
		'module!/entity/libary/time.js',
		'module!/entity/libary/version.js'
	], function(
		git,
		libary_array,
		libary_cast,
		libary_config,
		libary_extends,
		libary_function,
		libary_is,
		libary_json,
		libary_key,
		libary_midware,
		libary_object,
		libary_path,
		libary_promise,
		libary_require,
		libary_schema,
		libary_string,
		libary_time,
		libary_version
	) {

		var obj = function() {
			this.list = [
				libary_array,
				libary_cast,
				libary_config,
				libary_extends,
				libary_function,
				libary_is,
				libary_json,
				libary_key,
				libary_midware,
				libary_object,
				libary_path,
				libary_promise,
				libary_require,
				libary_schema,
				libary_string,
				libary_time,
				libary_version
			];
		};
		obj.prototype = {
			setup: function(path) {
				const p = $.promise(), g = new git('https://github.com/Product-Live/Singularity.git', {
					path: 'cache!/git',
					name: 'Singularity'
				});

				$.file.create('cache!/git').then(() => {
					return g.clone();
				}).then(() => {
					return (g.fetch());
				}).then(() => {
					return (g.reset('HEAD~'));
				}).then(() => {
					p.resolve();
				});

				return p;
			},

			run: function() {
				const wait = [], context = {session: $.key.short()};
				return this.setup().then(() => {

					for (let i in this.list) {
						let h = new this.list[i](context);
						wait.push(h.run());
					}

					return $.all(wait);
				})
			}
		};

		return ({'static private': obj});
	});
};
