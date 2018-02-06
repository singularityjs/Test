var _App;
(function($) {
    "use strict";

    var info = {
        page: 'page'
    };
    var deus = new $._deus(info.page), r = deus.pub();
    $.util.style('base', r);

    r.create('app.page', {
        getInitialState: function() {
            return ({current: 0, frame: []});
        },

        componentDidUpdate: function(nextProps, nextState) {
            this.canvas();
        },

        componentDidMount: function() {
            var self = this;
            setTimeout(function() {
                $.all([
                    self.tree(),
                    self.heat()
                ]).then(function() {
                    var max = 0, frame = [];
                    for (var i in self._heat) {
                        for (var x in self._heat[i]) {
                            max = Math.max(max, self._heat[i][x]);
                        }
                        frame.push(i);
                    }
                    self.setState({load: false, max: max, frame: frame});
                })
            });
        },

        heat: function(page, scroll) {
            var self = this;
            this.setState({load: true});
            return $.ajax({
                url: '/data/heat',
                method: 'GET'
            }).then(function(msg) {
                var o = {};
                for (var i in msg) {
                    o[i] = {};
                    for (var x in msg[i]) {
                        var k = x.replace(/\\/g, '/').replace(/\.js:\d*:\d*/g, '.js');
                        if (k[0] == '(') {
                            k = k.substr(1, k.length - 2);
                        }
                        o[i][k] = (o[i][k] || 0) + msg[i][x];
                    }
                }
                self._heat = o;
                return true;
            }, function() {
                $.route.redirect('/error/N3');
                return true;
            });
        },

        tree: function(page, scroll) {
            var self = this;
            this.setState({load: true});
            return $.ajax({
                url: '/data/tree',
                method: 'GET'
            }).then(function(msg) {
                self._tree = msg;
                return true;
            }, function() {
                $.route.redirect('/error/N3');
                return true;
            });
        },

        _node: null,
        _map: {},
        canvas: function() {
            if (!this._node) {
                this._node = new sigma({
                    container: this.refs.container,
                    settings: {
                        labelThreshold: 0,
                        edgeColor: 'default'
                        /*minNodeSize: 4,
                        maxNodeSize: 2,
                        minEdgeSize: 1,
                        maxEdgeSize: 1*/
                    }
                });
            }

            if (this._heat) {
                var heat = this._heat[this.state.frame[this.state.current]] || {};
                console.log(heat);
                this._node.graph.clear();
                var self = this, heat = self._heat[self.state.frame[self.state.current]] || {}, max = 0;
                var tree = {};
                for (var i in heat) {
                    var path = i.split('/'), c = tree;
                    for (var x in path) {
                        if (path[x]) {
                            if (!c[path[x]]) {
                                c[path[x]] = {};
                            }
                            c = c[path[x]];
                        }
                    }
                    max = Math.max(max, heat[i]);
                }

                var hslToHex = function(h, s, l) {
                    h /= 360;
                    s /= 100;
                    l /= 100;
                    let r, g, b;
                    if (s === 0) {
                        r = g = b = l; // achromatic
                    } else {
                        const hue2rgb = (p, q, t) => {
                            if (t < 0) t += 1;
                            if (t > 1) t -= 1;
                            if (t < 1 / 6) return p + (q - p) * 6 * t;
                            if (t < 1 / 2) return q;
                            if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                            return p;
                        };
                        const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                        const p = 2 * l - q;
                        r = hue2rgb(p, q, h + 1 / 3);
                        g = hue2rgb(p, q, h);
                        b = hue2rgb(p, q, h - 1 / 3);
                    }
                    const toHex = x => {
                        const hex = Math.round(x * 255).toString(16);
                        return hex.length === 1 ? '0' + hex : hex;
                    };
                    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
                }

                var getColor = function(value) {
                    //value from 0 to 1
                    var hue=((1-value)*120).toString(10);
                    //return ["hsl(",hue,",100%,50%)"].join("");
                    var c = hslToHex(hue, 100, 50);
                    return c;
                }

                var draw = function(x, y, last, data) {
                    var xC = 0, yC = 0, scale = 1;
                    for (var i in data) {
                        xC += 30 * scale;
                        yC += 30;
                        //scale += 0.01;

                        var h = heat[((last) ? last + '/' : '') + i] || 1;
                        self._node.graph.addNode({
                            // Main attributes:
                            id: last + '/' + i,
                            label: i + ((h == 1)? '' : ' called ' + h),
                            // Display attributes:
                            x: x + xC,
                            y: y + yC,
                            size: h,
                            color: getColor(1 - (h / max))
                        });
                        console.log(i, getColor(h / max), h / max, h, max)
                        if (last) {
                            self._node.graph.addEdge({
                                id: last + '/' + i,
                                // Reference extremities:
                                source: last,
                                target: last + '/' + i
                            })
                        }
                        yC += draw(x + xC + 200, y + yC, last + '/' + i, data[i]);

                    }
                    return yC;
                }

                draw(0, 0, '', tree);
                this._node.refresh();
            }

        },

        render: function() {
            var self = this;
            return r('div').style('full', {padding: '1px 10px'}).c(
                r('div').set({ref: 'container'}).style({height: 'calc(100% - 100px)', overflow: 'auto'}).c(
                    //r('canvas').set({ref: 'canvas'}).style('full').c()
                ),
                r('div').style({height: '100px'}).c(
                    r('input').set({type: 'range', min: 0, max: Math.max(0, (this.state.frame || []).length - 1), value: this.state.current}).on('change', function(e) {
                        self.setState({current: e.target.value})
                    }).c()
                )
            )
        }
    });

    $.page.add(info.page, {
        index: function() {
            ReactDOM.render(r('app.page').c(), document.getElementById('container'));
            return (true);
        }
    });
})(_App || (_App = {}));
