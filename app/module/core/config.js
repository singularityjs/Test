"use strict";

module.exports = function() {
	return ({
		dependencies: {},
		route: [
			{
				api: ['task'],
				path: '/run',
				action: {
					controller: 'test',
					method: 'run'
				}
			}
		],
		cdn: [],
		import: []
	});
};
