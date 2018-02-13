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
				const p = $.promise(), o = $.require('lib!extends.js');

				const base = () => {};
				base.prototype = {value: 'cat', get: function() { return [this.value, this.setup]; }};

				this.it('testing extends', () => {
					const tmp = function(a) {
						this.setup = a;
					};
					tmp.prototype = o(base, {
						toString: function() {
							const a = this.get();
							return a[0] + '_' + a[1];
						}
					});

					for (let i = 0; i < 5; i++) {
						let key = $.key.random(), x = new tmp(key);
						assert.deepEqual(x.get(), ['cat', key]);
						assert.equal(x.toString(), 'cat_' + key);
					}
				});


				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
