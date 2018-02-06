"use strict";

$.require([
	'core!/module.js',
	'core!/server.js',
	'core!/exit.js',
	'core!/serviceManager.js',

	'bootstrap!/part/part.js'
], function(
	module,
	server,
	exit,
	serviceManager,
	part
) {

	var e = new exit(), _s = {};
	part.info();
	var m = new module();

	var service = new serviceManager();

	var moduleScope = service.createScope('module').add({
		exit: e,
		module: m
	});

	part.scope(moduleScope);
	const session = $.key.short()
	let report = null;

	console.log('loading modules');
	m.loadPlugin(service.scope('module')).load($.config.get('module.load')).then(() => {
		console.log('loaded modules');
		return m.query().api('task').route('/run').run({session: session});
	}).then((r) => {
		report = r;
		return 0;
	}, () => {
		report = r;
		return 1;
	}).then(function(code) {
		var heat_map = {}, data = global._require_hook_data, last = null;
		for (var i in data) {
			let t = Math.floor(data[i].time / 1000000);
			if (!heat_map[t]) {
				heat_map[t] = {};
				if (last) {
					for (let y in heat_map[last]) {
						heat_map[t][y] = heat_map[last][y];
					}
				}
			}

			for (let x in data[i].stack) {
				let c = data[i].stack[x].match(/\(.*?\)$/);
				if (c && c[0]) {
					heat_map[t][c[0]] = (heat_map[t][c[0]] || 0) + 1;
				}
			}

			heat_map[t][data[i].path] = (heat_map[t][data[i].path] || 0) + 1;
			last = t;
		}

		var path = $.path('absolute!..');
		for (var i in heat_map) {
			let ne = {};
			for (var x in heat_map[i]) {
				let key = x.replace(/\\/g, '/').replace(path, '');
				if (key[0] == '(') {
					key = key.substr(1, key.length - 2);
				}
				ne[key] = (ne[key] || 0) + heat_map[i][x];
			}
			heat_map[i] = ne;
		}

		$.file.create('cache!/report/' + session).then(() => {
			return $.all([
				$.file.write('cache!/report/' + session + '/raw.json', $.json.encode(data, null, '\t')),
				$.file.write('cache!/report/' + session + '/heat_map.json', $.json.encode(heat_map, null, '\t')),
				$.file.write('cache!/report/' + session + '/report.json', $.json.encode(report, null, '\t')),
			]);
		}, () => {
			process.exit(code);
		}).then(() => {
			console.log('report and stats can be found in ', $.path('cache!' + session));
			console.log('run "npm start" and view the report with a ui at http://localhost/report#' + session);
			process.exit(code);
		}, () => {
			process.exit(code);
		});

	});
});
