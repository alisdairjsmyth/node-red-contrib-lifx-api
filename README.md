# node-red-contrib-lifx-api
[![npm version](https://badge.fury.io/js/node-red-contrib-lifx-api.svg)](https://badge.fury.io/js/node-red-contrib-lifx-api)

A collection of [Node-RED](http://nodered.org/) nodes to control [LIFX](http://www.lifx.com/) globes using the HTTP Remote Control API.

## Installation
Run the following command in the root directory of your Node-RED install

    npm install node-red-contrib-lifx-api

## HTTP versus LAN
LIFX has two methods of interacting with their globes:
* HTTP Remote Control API
* LAN Protocol

The Node-RED node [node-red-contrib-lifx2](https://www.npmjs.com/package/node-red-contrib-lifx2) is based on the LAN Protocol, while
these nodes utilize the HTTP Remote Control API.  The HTTP API allows the
implementation to be on a different network e.g. on Bluemix, and provides
higher level operations, such as:
* Breathe effect - slowly fading between two colours
* Pulse effect - quickly flashing between two colours
* Activate scene - activates a scene from the users account

## Pre-requisites
You will need a LIFX access token - see [LIFX Developer Documentation](https://api.developer.lifx.com/docs/authentication).  

Rate limiting is performed by LIFX on a per user, per application basis, effectively making it per access token.

Currently, each access token is limited to 60 requests for a 60 second window, however this may change in the future.

If you breach the rate limit, you will receive a status code of `429 Too Many Requests`.

## Usage
Separate nodes are provided for each of the capabilities of the LIFX HTTP Remote Control API.
Each node can be configured, or can receive settings in the triggering `msg`.

Refer to the LIFX documentation for [Selectors](https://api.developer.lifx.com/docs/selectors) and [Colors](https://api.developer.lifx.com/docs/colors).

### List Lights
Gets lights belonging to the authenticated account. Filter the lights using selectors.
Properties such as id, label, group and location can be used in selectors.

Sample input `msg.payload`:

    {
        "selector": "all"
    }

Sample output `msg.payload`:

    [
      {
        "id": "d3b2f2d97452",
        "uuid": "8fa5f072-af97-44ed-ae54-e70fd7bd9d20",
        "label": "Left Lamp",
        "connected": true,
        "power": "on",
        "color": {
          "hue": 250.0,
          "saturation": 0.5,
          "kelvin": 3500
        },
        "brightness": 0.5,
        "group": {
          "id": "1c8de82b81f445e7cfaafae49b259c71",
          "name": "Lounge"
        },
        "location": {
          "id": "1d6fe8ef0fde4c6d77b0012dc736662c",
          "name": "Home"
        },
        "last_seen": "2015-03-02T08:53:02.867+00:00",
        "seconds_since_seen": 0.002869418,
        "product": {
          "name": "Original 1000",
          "company": "LIFX",
          "identifier": "lifx_original_1000",
          "capabilities": {
            "has_color": true,
            "has_variable_color_temp": true
          }
        }
      }
    ]

### Set State
Sets the state of the lights within the selector. All parameters (except for the selector) are optional. If you don't supply a parameter, the node will leave that value untouched.

Sample input `msg.payload`:

    {
        "selector": "label:Lamp",
        "power": "on",
        "color": "blue saturation:0.5",
        "brightness": 0.5,
        "duration": 5
    }


### Set States
This node allows you to set different states on multiple selectors in a single request.

Each hash in `states` is comprised of a state hash as per Set State.

You can optionally use the defaults hash to specify the base hash that each state hash is built from.

Sample input `msg.payload`:

    {
        "states": [
            {
              "selector": "label:Lamp",
              "power": "on"
            },
            {
              "selector": "label:Casual Table",
              "brightness": 0.5
            }
        ],
            "defaults": {
            "duration": 5.0 // all states will be applied over 5 seconds
        }
    }

### Toggle Power
Turn off lights if any of them are on, or turn them on if they are all off. All lights matched by the selector will share the same power state after this action. Physically powered off lights are ignored.

Sample input `msg.payload`:

    {
        "selector": "label:Lamp"
    }

### Breathe Effect
Performs a breathe effect by slowly fading between the given colors.

Sample input `msg.payload`:

    {
        "selector": "label:Lamp",
        "color": "white",
        "from_color": "red",
        "period": 1,
        "cycles": 5,
        "persist": false,
        "power_on": true,
        "peak": 0.5
    }

### Pulse Effect
Performs a pulse effect by quickly flashing between the given colors.

Sample input `msg.payload`:

    {
        "selector": "label:Lamp",
        "color": "white",
        "from_color": "red",
        "period": 1,
        "cycles": 5,
        "persist": false,
        "power_on": true
    }

### Cycle
This node lets you easily have a set of lights transition to the next state in a list of states you supply without having to implement client side logic to calculate the next state in the sequence.

The API scores each state hash against the current states of all the lights in the selector, and if the score is high enough to be considered a match, it will apply the next state in the list, looping back to the first one if necessary. If there's no close match, it will apply the closest state to the selector.

The optional direction parameter determines the direction the API uses to determine the next state.

Sample input `msg.payload`:

    {
      "selector": "label:Lamp",
      "states": [
        {
          "brightness": 1.0
        },
        {
          "brightness": 0.5
        },
        {
          "brightness": 0.1
        },
        {
          "power": "off"
        }
      ],
      "defaults": {
        "power": "on",
        "saturation": 0,
        "duration": 2.0
      }
    }
