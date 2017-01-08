import Constants from 'constants.js';

const noop = Function.prototype;

class Request {
  constructor({
    task,
    hostname,
    priority = 1,
    retryOption = Constants.RetryOptions.NONE,
    onSuccess = noop,
    onError = noop
  }) {
    if (!task) {
      throw new Error('A task is required');
    }
    this.hostname = hostname;
    this.task = task;
    this.priority = priority;
    this.onError = onError;
    this.onSuccess = onSuccess;
  }

  getHostname() {
    return this.hostname;
  }

  getPriority() {
    return this.priority;
  }

  getTask() {
    return this.task;
  }

  static getRequestComparator(requestA, requestB) {
    if (requestA.priority > requestB.priority) return 1;
    if (requestA.priority === requestB.priority) return 0;
    return -1;
  }
}

export default Request;
