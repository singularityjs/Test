"use strict";

module.exports = function($) {
	return $.require([
		'node!fs'
	], function(
		fs
	) {

		var data = {
			seed: {
				path: {
					node: '',
					absolute: 'C:/Users/30270/Desktop/Singularity/test',
					root: 'C:/Users/30270/Desktop/Singularity/test/Singularity',
					project: 'C:/Users/30270/Desktop/Singularity/test/app',
					config: 'C:/Users/30270/Desktop/Singularity/test/app/config.js',
					engine: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine',
					base: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine/base',
					npm: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine/node_modules',
					core: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine/core',
					lib: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine/core/lib',
					docker: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine/core/docker',
					public: 'C:/Users/30270/Desktop/Singularity/test/app/public',
					hyperion: 'C:/Users/30270/Desktop/Singularity/test/Singularity/engine/core/hyperion',
					hypeConfig: 'C:/Users/30270/Desktop/Singularity/test/app/resources/cache/hyperion/config',
					bootstrap: 'C:/Users/30270/Desktop/Singularity/test/app/bootstrap',
					app: 'C:/Users/30270/Desktop/Singularity/test/app',
					resources: 'C:/Users/30270/Desktop/Singularity/test/app/resources',
					keys: 'C:/Users/30270/Desktop/Singularity/test/app/resources/keys',
					assets: 'C:/Users/30270/Desktop/Singularity/test/app/resources/assets',
					cache: 'C:/Users/30270/Desktop/Singularity/test/app/resources/cache',
					log: 'C:/Users/30270/Desktop/Singularity/test/app/resources/logs'
				},
				session: null,
				machineName: 'worker',
				prefix: 'sig',
				port: 80,
				upstartWrap: true,
				skipPrivate: false,
				entry: '127.0.0.1:80',
				name: 'none',
				appProfile: 'worker',
				app: {
					version: '1.0.0',
					author: 'anzerr',
					name: 'singularity',
					startup: 1517919820025
				}
			}
		}

		try {
			data.seed.session = fs.readFileSync(config.path.resources + '/.machineSession').toString();
		} catch(e) {
			// don't care, it gets created later if it doesn't exist
		}

		return ({'private': data});
	});
};
