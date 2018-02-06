"use strict";

module.exports = function($) {
	return $.require([
		'module!entity/util.js'
	], function(
		util
	) {

		var obj = function() {};
		obj.prototype = {
			hook: function(e) {
				this._log.push(e);
			},

			close: function() {
				process.removeListener('require_hook', this._hook);
				return {
					log: this._log,
					report: this._report
				};
			},

			it: function(key, cd) {
				const f = util.failed(cd);
				this._report[key] = !$.defined(f);
				if ($.is.instance(f, Error)) {
					throw f;
				}
			}
		};
		obj.init = function(self) {
			self._log = [];
			self._report = {};

			self._hook = (e) => {
				self.hook(e);
			}
			process.on('require_hook', self._hook);
		};

		return ({'private': obj});
	});
};
