import PriorityQueue from './priorityqueue';
import Request from './request';
import Constants from './constants';
import Utils from './utils';
import MaxConnections from './max_connections';

const noop = () => {};

class Stanchion {
  constructor(config = {}) {
    this.validateConfig(config);
    this.priorityQueue = new PriorityQueue(Request.getRequestComparator, 100);
    this.inflightCount = 0;
    this.logger = config.logger || noop;
    if (process.env.NODE_ENV !== 'testing') {
      // https://gist.github.com/jlong/2428561
      this.urlParser = document.createElement('a');
    }
    this.maxOpenConnections = config.maxOpenConnections || MaxConnections.maxOpenConnections;
    this.maxOpenConnectionsPerHostname = config.maxOpenConnectionsPerHostname || MaxConnections.maxOpenConnectionsPerHostname;
    // Object where key is hostname and value is number of connections currently in flight
    this.openConnectionsPerHostname = {};
  }

  validateConfig(config) {
    if (config.maxOpenConnections && (!Number.isInteger(config.maxOpenConnections) || config.maxOpenConnections < 1)) {
      throw new Error('maxOpenConnections has to be an integer value greater than 0');
    }
    if (config.maxOpenConnectionsPerHostname && (!Number.isInteger(config.maxOpenConnectionsPerHostname) || config.maxOpenConnectionsPerHostname < 1)) {
      throw new Error('maxOpenConnectionsPerHostname has to be an integer value greater than 0');
    }
    if (config.logger && typeof config.logger !== 'function') {
      throw new Error('logger has to be a function');
    }
  }

  queue(requestConfig) {
    requestConfig.hostname = Utils.getHostname(requestConfig.url, this.urlParser);
    const request = new Request(requestConfig);
    if (!Utils.isBrowserSupported()) {
      this.naiveDispatch(request);
      return;
    }
    this.logger({
      logLevel: Constants.LogLevels.INFO,
      message: `Queuing new request with priority ${request.getPriority()}`
    });
    this.priorityQueue.add(request);
    this.dequeue();
  }

  isMaxOpenConnectionsReached() {
    return this.inflightCount >= this.maxOpenConnections;
  }

  isMaxOpenConnectionsForHostnameReached(hostname) {
    return this.openConnectionsPerHostname[hostname] >= this.maxOpenConnectionsPerHostname;
  }

  flush() {
    // Resetting the priority queue is the equivalent of flushing outstanding requests
    // Doesn't affect inflight count since requests already sent can't be retracted
    this.priorityQueue.reset();
  }

  dequeue() {
    if (this.isMaxOpenConnectionsReached()) {
      this.logger({
        logLevel: Constants.LogLevels.INFO,
        message: 'Requests in queue but network congested'
      });
      return;
    }
    const request = this.priorityQueue.pop();
    if (!request) {
      return;
    }
    const requestHostname = request.getHostname();
    if (this.isMaxOpenConnectionsForHostnameReached(requestHostname)) {
      // If the max connection for this particular hostname is reached but less than
      // max open connections are in flight, then we repeat with the next highest priority.
      // Afterwards, we add the request back in the queue because it has not been processed yet
      this.dequeue();
      this.priorityQueue.add(request);
      return;
    }
    this.logger({
      logLevel: Constants.LogLevels.INFO,
      message: `Dispatching previously queued request with priority ${request.getPriority()}`
    });
    this.dispatch(request);
    return request;
  }

  // This bypasses Stanchion's network management
  naiveDispatch({task, onSuccess, onError}) {
    task().then(response => {onSuccess(response)}).catch(response => {onError(error)});
  }

  dispatch({task, onSuccess, onError, retryOption, hostname}) {
    this.inflightCount += 1;
    this.openConnectionsPerHostname[hostname] = (this.openConnectionsPerHostname[hostname] || 0) + 1;
    task()
      .then(response => {
        this.inflightCount -= 1;
        if (hostname) {
          this.openConnectionsPerHostname[hostname] -= 1;
        }
        this.dequeue();
        return onSuccess(response);
      })
      .catch(error => {
        this.logger({
          logLevel: Constants.LogLevels.ERROR,
          message: `Network request failed with error message: ${error.message}`
        });
        this.inflightCount -=1;
        this.dequeue();
        return onError(error);
      });
  }
}

export const initialize = (config) => {
  return new Stanchion(config);
};

export default {
  initialize,
  Constants
};
