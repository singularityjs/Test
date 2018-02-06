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
				const p = $.promise(), o = new ($.require('lib!schema.js'))();

				this.it('testing merge array', () => {
					for (let i = 0; i < 10; i++) {
						let a = util.randomArray(5), b = util.randomArray(5), c = a.concat(b);
						assert.deepEqual(o.arrayMerge(a, b).sort(), c.sort());

						a = util.randomObj(2, 2);
						b = util.randomObj(2, 2);
						a.test = util.randomArray(5);
						b.test = util.randomArray(5);
						c = a.test.concat(b.test);
						assert.deepEqual(o.arrayMerge(a, b).test.sort(), c.sort());
					}
				});

				this.it('testing copy', () => {
					for (let i = 0; i < 10; i++) {
						let a = util.randomObj(5, 3), b = o.copy(a);
						assert.deepEqual(a, b);
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
