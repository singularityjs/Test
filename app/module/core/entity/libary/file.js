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
				const p = $.promise(), o = new ($.require('lib!file.js'))();

				const wait = [];
				const test_data = [
					['cat\\test\\thing.js', 'js', 'thing.js', 'cat/test/thing.js', 'be88c9dfc95a5ff15c9124d99b6d73d8bdd68e5d535a3ca74d4941d4cbdc5969'],
					['core!cat\\/this//dog/god/test\\thing.js', 'js', 'thing.js', 'core!cat/this/dog/god/test/thing.js', '16fec2ebd099d64a7c5f94751526cacf98583abe9d1116189a00412e7d5bd906'],
					['lib!cat\\test\\thing////test.mp3', 'mp3', 'test.mp3', 'lib!cat/test/thing/test.mp3', 'bb567e641f0e1cee0ea1dc2bad060a999f130dee25b6446d12044d52f9641d1e'],
					['cat\\test\\thing.jpeg', 'jpeg', 'thing.jpeg', 'cat/test/thing.jpeg', 'f0c9474b22da8d99ee39848a734cf70ee59d5a1e0523fbfc6a23ac337f982cf3'],
					['module!cat\\test\\thing.html', 'html', 'thing.html', 'module!cat/test/thing.html', '1238619f71d17c32c35567b4c05c88144e55c1d2193227b807f0a9f934e7b13a'],
					['a', 'a', 'a', 'a', 'f91244759a73c211544b4c9a1ac3de66749501cdc634b5102ed1127df1ed504f']
				], fail_data = [
					[1],
					[true],
					[[true]],
					[{}],
					[() => {}]
				];

				this.it('testing file.path', () => {
					const type = [null, 'name', 'extension', 'normalize', 'parse'];
					for (let i in test_data) {
						for (let x in type) {
							if ($.defined(type[x])) {
								let data = o.path[type[x]](test_data[i][0]);
								if (type[x] === 'parse') {
									assert.equal($.crypto.hash($.json.stringify(data)), test_data[i][x]);
								} else {
									assert.equal(data, test_data[i][x]);
								}
							}
						}
					}

					for (let i in fail_data) {
						for (let x in type) {
							if ($.defined(type[x])) {
								util.fail(() => {
									o.path[type[x]](fail_data[i][0]);
								});
							}
						}
					}
				});


				this.it('testing file.create', () => {
					
				});

				$.all(wait).then(() => {
					p.resolve(this.close());
				}, (e) => {
					throw e;
				});

				return p;
			}
		});

		return ({'private': obj});
	});
};
