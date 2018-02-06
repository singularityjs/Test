"use strict";

module.exports = function() {
	return ([
		{
			method: ['get'],
			path: '/data/raw',
			action: {
				controller: 'data',
				method: 'raw'
			}
		},
		{
			method: ['get'],
			path: '/data/heat',
			action: {
				controller: 'data',
				method: 'heat'
			}
		},
		{
			method: ['get'],
			path: '/data/tree',
			action: {
				controller: 'data',
				method: 'tree'
			}
		}
	]);
};
