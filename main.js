"use strict";

if (process.argv.join(' ').match('--profile test')) {
    console.log('hook');
    global._require_hook = true;
    global._require_hook_data = [];
    process.on('require_hook', function(e) {
        global._require_hook_data.push(e);
    });
}

const core = require('./Singularity/core.js'), base = (require('path').resolve(__dirname)).replace(/\\/g, '/');

core({
    absoluteRoot: base,
    projectRoot: base + '/app',
    command: function(c, config) {
        config.upstartWrap = false;
    }
});
