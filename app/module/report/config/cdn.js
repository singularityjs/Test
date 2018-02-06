"use strict";

module.exports = function() {
	return ([
		{
			method: ['get'],
			path: '/client/main.js',
			priority: 4,
			action: {
				controller: 'client',
				method: 'main'
			}
		},
		{
			method: ['get'],
			path: '/client/module/login.js',
			priority: 4,
			action: {
				controller: 'client',
				method: 'main'
			}
		},
		{
			method: ['get'],
			path: '/client/:path',
			priority: 2,
			param: {
				path: '.*'
			},
			action: {
				controller: 'client',
				method: 'cdn'
			}
		}
	]);
};
