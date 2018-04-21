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
  var lifxObj = require("lifx-http-api");

  function lifxConfig(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.token = n.token;
  }
  RED.nodes.registerType("lifx-config", lifxConfig);

  function defaultTo(val, def) {
    return typeof val != "undefined" ? val : def != "" ? def : null;
  }

  function togglePower(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
      lifx.togglePower(selector, 0, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
      });
    });
  }
  RED.nodes.registerType("lifx-toggle-power", togglePower);

  function pulseEffect(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;
    this.color = config.color;
    this.from_color = config.from_color;
    this.period = config.period;
    this.cycles = config.cycles;
    this.persist = config.persist;
    this.power_on = config.power_on;

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
      var settings = {
        color: defaultTo(msg.payload.color, this.color),
        from_color: defaultTo(msg.payload.from_color, this.from_color),
        period: defaultTo(msg.payload.period, this.period),
        cycles: defaultTo(msg.payload.cycles, this.cycles),
        persist: defaultTo(msg.payload.persist, this.persist),
        power_on: defaultTo(msg.payload.power_on, this.power_on),
        peak: 0.5
      };
      lifx.pulse(selector, settings, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
      });
    });
  }
  RED.nodes.registerType("lifx-pulse-effect", pulseEffect);

  function breatheEffect(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;
    this.color = config.color;
    this.from_color = config.from_color;
    this.period = config.period;
    this.cycles = config.cycles;
    this.persist = config.persist;
    this.power_on = config.power_on;
    this.peak = config.peak;

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
      var settings = {
        color: defaultTo(msg.payload.color, this.color),
        from_color: defaultTo(msg.payload.from_color, this.from_color),
        period: defaultTo(msg.payload.period, this.period),
        cycles: defaultTo(msg.payload.cycles, this.cycles),
        persist: defaultTo(msg.payload.persist, this.persist),
        power_on: defaultTo(msg.payload.power_on, this.power_on),
        peak: defaultTo(msg.payload.peak, this.peak)
      };
      lifx.breathe(selector, settings, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
      });
    });
  }
  RED.nodes.registerType("lifx-breathe-effect", breatheEffect);

  function listLights(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
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
  RED.nodes.registerType("lifx-list-lights", listLights);

  function setState(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);
    this.power = config.power;
    this.color = config.color;
    this.brightness = config.brightness;
    this.duration = config.duration;
    this.infrared = config.infrared;

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
      var settings = {
        power: defaultTo(msg.payload.power, this.power),
        color: defaultTo(msg.payload.color, this.color),
        brightness: Number(defaultTo(msg.payload.brightness, this.brightness)),
        duration: defaultTo(msg.payload.duration, this.duration),
        infrared: defaultTo(msg.payload.infrared, this.infrared)
      };
      lifx.setState(selector, settings, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
      });
    });
  }
  RED.nodes.registerType("lifx-set-state", setState);

  function setStates(config) {
    RED.nodes.createNode(this, config);

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      var states = defaultTo(msg.payload, {});
      lifx.setStates(states, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
      });
    });
  }
  RED.nodes.registerType("lifx-set-states", setStates);

  function cycle(config) {
    RED.nodes.createNode(this, config);

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);
    this.selector = config.selector;

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
      var states = msg.payload;
      lifx.cycle(selector, states, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
      });
    });
  }
  RED.nodes.registerType("lifx-cycle", cycle);

  function listScenes(config) {
    RED.nodes.createNode(this, config);

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      lifx.listScenes(function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
        msg.payload = data;
        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("lifx-list-scenes", listScenes);

  function activateScene(config) {
    RED.nodes.createNode(this, config);
    this.selector = config.selector;

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);
    this.duration = config.duration;

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var selector = defaultTo(msg.payload.selector, this.selector);
      var duration = defaultTo(msg.payload.duration, this.duration);
      lifx.setState(selector, duration, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
        msg.payload = data;
        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("lifx-activate-scene", activateScene);

  function validateColor(config) {
    RED.nodes.createNode(this, config);

    // Retrieve the config node
    this.api = RED.nodes.getNode(config.api);
    this.color = config.color;

    var lifx = new lifxObj({ bearerToken: this.api.token });
    var node = this;
    this.on("input", function(msg) {
      msg.payload = defaultTo(msg.payload, {});
      var color = defaultTo(msg.payload.color, this.color);
      lifx.validateColor(color, function(err, data) {
        if (err) {
          node.error(err);
          return;
        }
        msg.payload = data;
        node.send(msg);
      });
    });
  }
  RED.nodes.registerType("lifx-validate-color", validateColor);
};
