# WB Backend

Backend for the RN app

## How to install?

Make sure you have [Node.js v6+](https://nodejs.org) and the [necessary dependencies to be able to compile `node-canvas`](https://github.com/Automattic/node-canvas#installation), then open your terminal and run:

`npm install`

To install PostgreSQL, follow the instructions here:
https://doubleqliq.atlassian.net/wiki/display/WBB/Setting+up+PostgreSQL+development+server

## How to setup the development server?

Make sure you have started PostgreSQL server, then open your terminal and run:

`npm run fixtures`

## How to start the development server?

Make sure you have started PostgreSQL server, then open your terminal and run:

`npm run watch`

## How to deploy?

Build the app with the following command:

`npm run build`

Once the app is build you can run it based on the environment required.  The default start script will start the app with development as the environment:

`npm run start`

If starting app for beanstalk, you may pass in the required environment within the beanstalk config. Below is an example to start for qa

`npm run beanstalk-start-qa`
