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

				this.it('testing array.range', () => {
					for (let y = 0; y < 5; y++) {
						let start = util.random(10), end = util.random(start - 10);
						let num = [];
						for (let x = 0; x < start; x++) {
							num.push(x);
						}
						assert.deepEqual(o.range(start), num);
						let step = [];
						for (let x = start; x < (start + end); x += 2) {
							num.push(x);
						}
						assert.deepEqual(o.range(start, start + end, 2), step);
					}
				});

				this.it('testing array.find', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5), k = util.random(5);
						assert.deepEqual(o.find(a, a[k]), k);
					}
				});

				this.it('testing array.findLast', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5), k = util.random(5);
						a[k + 1] = a[k];
						assert.deepEqual(o.findLast(a, a[k]), k + 1);
					}
				});

				this.it('testing array.unique', () => {
					for (let y = 0; y < 5; y++) {
						let size = util.random(10) + 1, a = util.randomArray(size);
						a = a.concat(a).concat(a);
						assert.notDeepEqual(o.unique(a).length, a.length);
						assert.deepEqual(o.unique(a).length, size);
					}
				});

				this.it('testing array.first', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5);
						assert.deepEqual(o.first(a), a[0]);
						assert.deepEqual(o.first([]), null);
					}
				});

				this.it('testing array.last', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5);
						assert.deepEqual(o.last(a), a[a.length - 1]);
						assert.deepEqual(o.last([]), null);
					}
				});

				this.it('testing array.map', () => {
					for (let y = 0; y < 5; y++) {
						let a = util.randomArray(5), map = {};
						for (let x in a) {
							map[a[x] + '_test'] = a[x];
						}
						let b = o.map(a, function(value) {
							return (value + '_test');
						});
						assert.deepEqual(b, map);
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
