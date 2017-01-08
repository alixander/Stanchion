import UAParser from 'ua-parser-js';
import Constants from 'constants.js';

const userAgentParser = new UAParser();

let maxOpenConnections = Constants.DEFAULT_MAX_OPEN_CONNECTIONS;
let maxOpenConnectionsPerHostname = Constants.DEFAULT_MAX_CONNECTIONS_PER_HOSTNAME;
let isBrowserSupported = false;

const browser = userAgentParser.getBrowser();

switch (browser.name) {
  case 'Chrome':
    isBrowserSupported = true;
    if (browser.major === 42) {
      maxOpenConnections = 12;
      maxOpenConnectionsPerHostname = 13;
    } else if (browser.major === 50) {
      maxOpenConnections = 6;
      maxOpenConnectionsPerHostname = 17;
    } else {
      maxOpenConnections = 10;
      maxOpenConnectionsPerHostname = 6;
    }
  case 'Firefox':
    isBrowserSupported = true;
    maxOpenConnections = 17;
    maxOpenConnectionsPerHostname = 6;
  case 'Safari':
    isBrowserSupported = true;
    maxOpenConnections = 17;
    maxOpenConnectionsPerHostname = 6;
}

if (process.env.NODE_ENV === 'testing') {
  isBrowserSupported = true;
}

export default {
  maxOpenConnections,
  maxOpenConnectionsPerHostname,
  isBrowserSupported
}
