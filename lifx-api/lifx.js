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
    var lifxObj = require('lifx-api');

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

        var lifx = new lifxObj(this.api.token);
        var node = this;
        this.on('input', function(msg) {
            var selector = (typeof msg.payload.selector != "undefined") ? msg.payload.selector : this.selector;
            lifx.togglePower(selector, function(body) {
                node.log(body);
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

        var lifx = new lifxObj(this.api.token);
        var node = this;
        this.on('input', function(msg) {
            var selector   = (typeof msg.payload.selector   != "undefined") ? msg.payload.selector   : this.selector;
            var color      = (typeof msg.payload.color      != "undefined") ? msg.payload.color      : this.color;
            var from_color = (typeof msg.payload.from_color != "undefined") ? msg.payload.from_color : this.from_color;
            var period     = (typeof msg.payload.period     != "undefined") ? msg.payload.period     : this.period;
            var cycles     = (typeof msg.payload.cycles     != "undefined") ? msg.payload.cycles     : this.cycles;
            var persist    = (typeof msg.payload.persist    != "undefined") ? msg.payload.persist    : this.persist;
            var power_on   = (typeof msg.payload.power_on   != "undefined") ? msg.payload.power_on   : this.power_on;
            lifx.pulseEffect(selector, color, from_color, period, cycles, persist, power_on, 0.5, function(body) {
                node.log(body);
            });
        });
    }
    RED.nodes.registerType("lifx-pulse-effect",pulseEffect);

};
