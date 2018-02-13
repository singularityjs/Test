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
				const p = $.promise(), o = new ($.require('lib!cast.js'))();

				const test_value = [
					[1, 1, '1', true],
					['', 0, '', false],
					['1', 1, '1', true],
					['abc', NaN, 'abc', true],
					[true, 1, 'true', true],
					[false, 0, 'false', false],
					[[], 0, '', true],
					[[true], NaN, 'true', true],
					[{}, NaN, '[object Object]', true],
					[() => {}, NaN, '() => {}', true],
					[function() {}, NaN, 'function () {}', true],
					[null, 0, 'null', false],
					[undefined, NaN, 'undefined', false]
				];

				this.it('testing cast.number', () => {
					for (let i in test_value) {
						let tmp = o.number(test_value[i][0]);
						if (!(isNaN(tmp) && isNaN(test_value[i][1]))) {
							assert.equal(tmp, test_value[i][1]);
						}
					}
				});

				this.it('testing cast.string', () => {
					for (let i in test_value) {
						assert.equal(o.string(test_value[i][0]), test_value[i][2]);
					}
				});

				this.it('testing cast.bool', () => {
					for (let i in test_value) {
						assert.equal(o.bool(test_value[i][0]), test_value[i][3]);
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
