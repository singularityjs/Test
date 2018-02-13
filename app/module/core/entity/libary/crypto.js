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
				const p = $.promise(), o = new ($.require('lib!crypto.js'))();

				const value = 'test';
				const out = [
					'79caa93da9153f23fe10c7ddf2d8267e',
					value,
					'9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08',
					'dGVzdA=='
				];

				const test_value = [
					1,
					true,
					false,
					[],
					[true],
					{},
					() => {},
					function() {},
					null,
					undefined
				];

				this.it('testing crypto.encrypt', () => {
					assert.equal(o.encrypt('aes192', 'test', value), out[0]);
					for (let i in test_value) {
						util.fail(() => {
							o.encrypt('aes192', 'test', test_value[i]);
						});
					}
				});

				this.it('testing crypto.decrypt', () => {
					assert.equal(o.decrypt('aes192', 'test', out[0]), out[1]);
					for (let i in test_value) {
						util.fail(() => {
							o.decrypt('aes192', 'test', test_value[i]);
						});
					}
				});

				this.it('testing crypto.hash', () => {
					assert.equal(o.hash(value), out[2]);
					for (let i in test_value) {
						util.fail(() => {
							o.hash(test_value[i]);
						});
					}
				});

				this.it('testing crypto.btoa', () => {
					assert.equal(o.btoa(value), out[3]);
				});

				this.it('testing crypto.atob', () => {
					assert.equal(o.atob(out[3]), value);
				});

				this.it('testing crypto.equal', () => {
					assert.equal(o.equal(out[2], out[2]), true);
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
