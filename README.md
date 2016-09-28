# node-red-contrib-lifx-api

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

### Toggle Power
Turn off lights if any of them are on, or turn them on if they are all off. All lights matched by the selector will share the same power state after this action. Physically powered off lights are ignored.

Sample `msg.payload`:

    {
        "selector": "label:Lamp"
    }

### Pulse Effect
Performs a pulse effect by quickly flashing between the given colors.

Sample `msg.payload`:

    {
        "selector": "label:Lamp",
        "color": "white",
        "from_color": "red",
        "period": 1,
        "cycles": 5,
        "persist": false,
        "power_on": true
    }

## To Do
The intent is for this collection of nodes to expose the full capability of the
LIFX HTTP Remote Control API.  The following capability is not presently exposed:
* List Lights
* Set State
* Set States
* Breathe Effect
* Cycle
* List Scenes
* Activate Scene
