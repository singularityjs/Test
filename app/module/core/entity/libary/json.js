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
				const p = $.promise(), o = new ($.require('lib!json.js'))();

				const test_value = [
					[1, 1, '1'],
					['', null, '""'],
					['1', '1', '"1"'],
					['abc', null, '"abc"'],
					[true, true, 'true'],
					[false, false, 'false'],
					[[], null, '[]'],
					[[true], true, '[true]'],
					[['cat'], null, '["cat"]'],
					[{}, null, '{}'],
					[{cat: true}, null, '{"cat":true}'],
					[() => {}, null, undefined],
					[function() {}, null, undefined],
					[null, null, 'null'],
					[undefined, null, undefined]
				];

				this.it('testing json.parse', () => {
					for (let i in test_value) {
						assert.equal(o.parse(test_value[i][0]), test_value[i][1]);
					}
				});


				this.it('testing json.parse', () => {
					for (let i in test_value) {
						assert.equal(o.stringify(test_value[i][0]), test_value[i][2]);
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
