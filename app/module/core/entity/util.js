"use strict";

module.exports = function($) {
	return $.require([
		//
	], function(
		//
	) {

		var obj = function() {};
		obj.prototype = {
			randomObj: function(size, deep) {
				var o = {};
				for (var i = 0; i < size; i++) {
					o[$.key.random()] = $.key.random()
				}
				if (deep > 0) {
					for (var i = 0; i < (size / 2); i++) {
						o[$.key.random()] = this.randomObj(size, deep - 1);
					}
				}
				return o;
			},

			clone: function(a, b) {
				return $.schema.merge().deep($.schema.copy(a), b);
			},

			failed: function(cd) {
				let failed = null;
				try {
					cd();
				} catch(e) {
					failed = e;
				}
				return failed;
			}
		};

		return ({'static private': obj});
	});
};
