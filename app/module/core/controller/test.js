"use strict";

module.exports = function($) {
	return $.require([
		'core!git.js',
		'module!/entity/libary/config.js'
	], function(
		git,
		libary_config,
	) {

		var obj = function() {
			this.list = [
				libary_config
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
