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
				const p = $.promise(), o = new ($.require('lib!type.js'))();

				const test_value = [
					[1, false], // 0
					['', false], // 1
					['1', false], // 2
					['abc', false], // 3
					[true, false], // 4
					[false, false], // 5
					[[], false], // 6
					[[true], false], // 7
					[['cat'], false], // 8
					[{}, false], // 9
					[{cat: true}, false], // 10,
					[new Date(), false], // 11
					[() => {}, false], // 12
					[function() {}, false], // 13
					[null, false], // 14
					[undefined, false] // 15
				];

				this.it('testing is.int', () => {
					const t = util.clone(test_value);
					t[0][1] = true;
					t[2][1] = true;
					for (let i in t) {
						assert.equal(o.int(t[i][0]), t[i][1]);
						assert.equal(o.number(t[i][0]), t[i][1]);
						assert.equal(o.float(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.string', () => {
					const t = util.clone(test_value);
					t[1][1] = true;
					t[2][1] = true;
					t[3][1] = true;
					for (let i in t) {
						assert.equal(o.string(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.object', () => {
					const t = util.clone(test_value);
					t[9][1] = true;
					t[10][1] = true;
					t[11][1] = true;
					for (let i in t) {
						assert.equal(o.object(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.bool', () => {
					const t = util.clone(test_value);
					t[4][1] = true;
					t[5][1] = true;
					for (let i in t) {
						assert.equal(o.bool(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.array', () => {
					const t = util.clone(test_value);
					t[6][1] = true;
					t[7][1] = true;
					t[8][1] = true;
					for (let i in t) {
						assert.equal(o.array(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.time', () => {
					const t = util.clone(test_value);
					t[0][1] = true;
					t[2][1] = true;
					t[11] = [new Date(), true];
					for (let i in t) {
						assert.equal(o.time(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.func', () => {
					const t = util.clone(test_value);
					t[12][1] = true;
					t[13][1] = true;
					for (let i in t) {
						assert.equal(o.func(t[i][0]), t[i][1]);
						assert.equal(o.function(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.defined', () => {
					const t = util.clone(test_value);
					for (let i in t) {
						t[i][1] = true;
					}
					t[14][1] = false;
					t[15][1] = false;
					for (let i in t) {
						assert.equal(o.defined(t[i][0]), t[i][1]);
					}
				});

				this.it('testing is.instance', () => {
					const t = [
						[new Date(), Date, true],
						[new Error(), Error, true],
					];
					for (let i in test_value) {
						t.push([new Date(), test_value[i][0], false]);
					}
					for (let i in t) {
						assert.equal(o.instance(t[i][0], t[i][1]), t[i][2]);
					}
				});

				this.it('testing is.not', () => {
					const t = [];
					for (let i in test_value) {
						let valid = (util.random(2) == 1), type = (util.random(2) == 1), key = $.key.random();
						t.push([
							key,
							valid? (type? key: util.randomArray(util.random(5) + 2, key)) : $.key.random(),
							!valid
						]);
					}
					for (let i in t) {
						assert.equal(o.not(t[i][0], t[i][1]), t[i][2]);
					}
				});

				this.it('testing is.got', () => { // TODO
					const t = [];
					for (let i in test_value) {
						let valid = (util.random(2) == 1), key = $.key.random();
						t.push([
							key,
							util.randomArray(util.random(5) + 2, valid? key : ''),
							valid
						]);
					}
					for (let i in t) {
						assert.equal(o.got(t[i][0], t[i][1]), t[i][2]);
					}
				});

				this.it('testing is.default', () => { // TODO
					const t = [];
					for (let i in test_value) {
						let valid = (util.random(2) == 1), a = $.key.random(), b = $.key.random();
						t.push([valid? a : null, b, valid? a : b]);
					}
					for (let i in t) {
						assert.equal(o.default(t[i][0], t[i][1]), t[i][2]);
					}
				});

				this.it('testing is.empty', () => { // TODO
					const t = [
						[null, true],
						[undefined, true],
						[[], true],
						[{}, true],
						[{cat: true}, false],
						[['test'], false],
					];
					for (let i in t) {
						assert.equal(o.empty(t[i][0]), t[i][1]);
					}
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
