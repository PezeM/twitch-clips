# Twitch clips data grabber

Command line application to gather twitch.tv clips with internal ID and download link in source resolution.

# Installation

Clone down this repository. You will need `node` and `npm` installed globally on your machine.  

Installation:

`npm install`

Building:

`npm run build`

Building in watch mode

`npm run build:watch`

### Configuration

Enter `src/configs` directory and copy `config.example.ts` to `config.ts`. Replace default data with own clientId/clientSecret/accessToken/refreshToken.

### Running application

Go into `build/src` directory and run `main.js` file with twitch.tv username as first parameter.

Example:
`node ./main.js twitch`

It will gather clips from channel named twitch.