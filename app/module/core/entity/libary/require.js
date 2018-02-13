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

		const obj = function(context) {
			base.init(this);
			this._context = context;
		};
		obj.prototype = $.extends(base, {
			run: function() {
				const p = $.promise(), o = $.require('lib!require.js');

				// TODO
				this.it('testing THING', () => {
					//assert.equal(a,b);
					//assert.deepEqual(a,b);
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
