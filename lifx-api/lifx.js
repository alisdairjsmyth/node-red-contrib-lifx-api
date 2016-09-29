/**
 * Copyright 2016 Alisdair Smyth
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/
module.exports = function(RED) {
    "use strict";
    var lifxObj = require('lifx-http-api');

    function lifxConfig(n) {
        RED.nodes.createNode(this,n);
        this.name  = n.name;
        this.token = n.token;

    }
    RED.nodes.registerType("lifx-config",lifxConfig);

    function togglePower(config) {
        RED.nodes.createNode(this,config);
        this.selector = config.selector;

        // Retrieve the config node
        this.api = RED.nodes.getNode(config.api);

        var lifx = new lifxObj({bearerToken: this.api.token});
        var node = this;
        this.on('input', function(msg) {
            var selector = (typeof msg.payload.selector != "undefined") ? msg.payload.selector : this.selector;
            lifx.togglePower(selector, 0, function (err, data) {
                if (err) {
                    node.error(err);
                    return;
                }
            });
        });
    }
    RED.nodes.registerType("lifx-toggle-power",togglePower);

    function pulseEffect(config) {
        RED.nodes.createNode(this,config);
        this.selector   = config.selector;
        this.color      = config.color;
        this.from_color = config.from_color;
        this.period     = config.period;
        this.cycles     = config.cycles;
        this.persist    = config.persist;
        this.power_on   = config.power_on;

        // Retrieve the config node
        this.api = RED.nodes.getNode(config.api);

        var lifx = new lifxObj({bearerToken: this.api.token});
        var node = this;
        this.on('input', function(msg) {
            var selector   = (typeof msg.payload.selector   != "undefined") ? msg.payload.selector   : this.selector;
            var settings   = {
                color:      (typeof msg.payload.color      != "undefined") ? msg.payload.color      : this.color,
                from_color: (typeof msg.payload.from_color != "undefined") ? msg.payload.from_color : this.from_color,
                period:     (typeof msg.payload.period     != "undefined") ? msg.payload.period     : this.period,
                cycles:     (typeof msg.payload.cycles     != "undefined") ? msg.payload.cycles     : this.cycles,
                persist:    (typeof msg.payload.persist    != "undefined") ? msg.payload.persist    : this.persist,
                power_on:   (typeof msg.payload.power_on   != "undefined") ? msg.payload.power_on   : this.power_on,
                peak:       0.5
            };
            lifx.pulse(selector, settings, function(err, data) {
                    if (err) {
                        node.error(err);
                        return;
                    }
            });
        });
    }
    RED.nodes.registerType("lifx-pulse-effect",pulseEffect);

    function breatheEffect(config) {
        RED.nodes.createNode(this,config);
        this.selector   = config.selector;
        this.color      = config.color;
        this.from_color = config.from_color;
        this.period     = config.period;
        this.cycles     = config.cycles;
        this.persist    = config.persist;
        this.power_on   = config.power_on;
        this.peak       = config.peak;

        // Retrieve the config node
        this.api = RED.nodes.getNode(config.api);

        var lifx = new lifxObj({bearerToken: this.api.token});
        var node = this;
        this.on('input', function(msg) {
            var selector   = (typeof msg.payload.selector   != "undefined") ? msg.payload.selector   : this.selector;
            var settings   = {
                color:      (typeof msg.payload.color      != "undefined") ? msg.payload.color      : this.color,
                from_color: (typeof msg.payload.from_color != "undefined") ? msg.payload.from_color : this.from_color,
                period:     (typeof msg.payload.period     != "undefined") ? msg.payload.period     : this.period,
                cycles:     (typeof msg.payload.cycles     != "undefined") ? msg.payload.cycles     : this.cycles,
                persist:    (typeof msg.payload.persist    != "undefined") ? msg.payload.persist    : this.persist,
                power_on:   (typeof msg.payload.power_on   != "undefined") ? msg.payload.power_on   : this.power_on,
                peak:       (typeof msg.payload.peak       != "undefined") ? msg.payload.peak       : this.peak
            };
            lifx.breathe(selector, settings, function(err, data) {
                    if (err) {
                        node.error(err);
                        return;
                    }
            });
        });
    }
    RED.nodes.registerType("lifx-breathe-effect",breatheEffect);

    function listLights(config) {
        RED.nodes.createNode(this,config);
        this.selector   = config.selector;

        // Retrieve the config node
        this.api = RED.nodes.getNode(config.api);

        var lifx = new lifxObj({bearerToken: this.api.token});
        var node = this;
        this.on('input', function(msg) {
            var selector   = (typeof msg.payload.selector   != "undefined") ? msg.payload.selector   : this.selector;
            lifx.listLights(selector, function(err, data) {
                if (err) {
                    node.error(err);
                    return;
                }
                msg.payload = data;
                node.send(msg);
            });
        });
    }
    RED.nodes.registerType("lifx-list-lights",listLights);
};
