"use strict";

module.exports = function($) {
	return $.require([
		'module!entity/util.js',
		'module!entity/base.js',
		'node!assert',
		'node!fs'
	], function(
		util,
		base,
		assert,
		fs
	) {

		var obj = function(context) {
			base.init(this);
			this._context = context;
		};
		obj.prototype = $.extends(base, {
			run: function() {
				const p = $.promise(), o = $.require('lib!time.js');

				this.it('testing time', () => {
					for (var i = 0; i < 10; i++) {
						assert.equal(o.second(1).get, 1000);
						assert.equal(o.minute(1).get, 60 * 1000);
						assert.equal(o.hour(1).get, (60 * 1000) * 60);
						assert.equal(o.day(1).get, ((60 * 1000) * 60) * 24);
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
