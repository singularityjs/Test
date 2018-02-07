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
				const p = $.promise(), o = new ($.require('lib!array.js'))();

				this.it('testing array.clear', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5), b = [];
						for (let i in a) {
							b.push(a[i]);
						}
						for (let i = 0; i < 10; i++) {
							a.splice(util.random(a.length), 0, (util.random(2) == 1) ? null : undefined);
						}
						assert.deepEqual(o.clean(a), b);
					}
				});

				this.it('testing array.compact', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5), b = [];
						for (let i in a) {
							b.push(a[i]);
						}
						for (let i = 0; i < 5; i++) {
							let add = util.randomArray(5);
							for (let x in add) {
								b.push(add[x]);
							}
							a.splice(util.random(a.length), 0, add);
						}
						assert.deepEqual(o.compact(a).sort(), b.sort());
					}
				});

				this.it('testing array.clone', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5), b = o.clone(a);
						for (let x in a) {
							a[x] = $.key.random();
						}
						assert.notDeepEqual(a.sort(), b.sort());
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
