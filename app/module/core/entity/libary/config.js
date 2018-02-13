"use strict";

module.exports = function($) {
	return $.require([
		'module!entity/util.js',
		'module!entity/base.js',
		'module!entity/libary/config/data.js',
		'node!assert',
		'node!fs'
	], function(
		util,
		base,
		response,
		assert,
		fs
	) {

		const obj = function(context) {
			base.init(this);
			this._context = context;
			this._obj = $.require('lib!config.js');
		};
		obj.prototype = $.extends(base, {
			run: function() {
				const p = $.promise();

				this.it('testing config creation and reload', () => {
					for (let i = 0; i < 5; i++) {
						let seed = util.randomObj(2, 2), o = new this._obj(seed);
						assert.deepEqual(o.get('configSeed'), util.clone(response.seed, seed));
						o.reload((seed = util.randomObj(2, 2)));
						assert.deepEqual(o.get('configSeed'), util.clone(response.seed, seed));
					}
				});

				this.it('testing failing wrong setup', () => {
					for (let i = 0; i < 5; i++) {
						let fail = util.failed(() => {
							let seed = util.randomObj(2, 2), o = new this._obj(seed);
							assert.deepEqual(o.get('configSeed'), response.seed);
						});
						if (!fail) {
							throw Error('seed can\'t match');
						}
					}
				});

				this.it('testing wrong input into config', () => {
					const input = ['string', 10, true, [], null, undefined];
					for (let i in input) {
						if (!util.failed(() => { new this._obj(input[i]); })) {
							throw Error('needs to fail with wrong input type "' + typeof(input[i]) + '"');
						}
					}
				});

				this.it('testing fetch config', () => {
					let seed = {
						machineName: $.key.random(),
						upstartWrap: true,
						appProfile: $.key.random()
					}, o = new this._obj(seed);

					assert.equal(o.get('env.profile'), seed.appProfile);
					assert.equal(o.get('env.machine'), seed.machineName);
					assert.equal(o.get('env.upstart'), seed.upstartWrap);
				});

				this.it('testing reload', () => {
					let seed = {
						machineName: $.key.random(),
						upstartWrap: true,
						appProfile: $.key.random()
					}, o = new this._obj(seed);

					assert.equal(o.get('env.profile'), seed.appProfile);
					assert.equal(o.get('env.machine'), seed.machineName);
					assert.equal(o.get('env.upstart'), seed.upstartWrap);
					let nextSeed = {
						machineName: $.key.random(),
						upstartWrap: true,
						appProfile: $.key.random()
					};
					o.reload(nextSeed);

					assert.equal(o.get('env.profile'), nextSeed.appProfile);
					assert.equal(o.get('env.machine'), nextSeed.machineName);
					assert.equal(o.get('env.upstart'), nextSeed.upstartWrap);
				});

				p.resolve(this.close());

				return p;
			}
		});

		return ({'private': obj});
	});
};
