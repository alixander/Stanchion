import assert from 'assert';
import Stanchion from '../../src/stanchion';
import sinon from 'sinon';

describe('Tests', () => {
  let network;
  let dispatchRequest;
  let receiveResponse;
  beforeEach(() => {
    dispatchRequest = sinon.spy();
    receiveResponse = sinon.spy();
    network = Stanchion.initialize();
  });
  describe('dispatching correctly', () => {
    beforeEach(() => {
      for (let i = 0; i < 20; i++) {
        // The task, when invoked, will add a number to dispatchedRequests
        const task = () => {
          dispatchRequest(i);
          return new Promise((resolve) => {
            setTimeout(resolve, 1);
          });
        }
        // When the response comes back, returnedRequests gets the number
        const onSuccess = () => {receiveResponse(i)};
        network.queue({task, onSuccess, priority: i, url: 'http://test.com'});
      }
    });
    it('should dispatch completely', () => {
      return new Promise(testResolve => {
        setTimeout(testResolve, 40);
      }).then(() => {
        assert.equal(dispatchRequest.callCount, 20);
      });
    });
    it('should dispatch immediately after queueing if concurrent request limit not reached', () => {
      assert(dispatchRequest.calledWith(0));
      assert(dispatchRequest.calledWith(1));
      assert(dispatchRequest.calledWith(2));
      assert(dispatchRequest.calledWith(3));
      assert(dispatchRequest.calledWith(4));
      assert(dispatchRequest.calledWith(5));
    });
    it('should not dispatch if queue is full', () => {
      assert(dispatchRequest.neverCalledWith(6));
      assert.equal(dispatchRequest.callCount, 6);
      return new Promise(testResolve => {
        setTimeout(testResolve, 1);
      }).then(() => {
        assert.equal(dispatchRequest.callCount, 12);
      });
    });
    it('should dispatch highest priority when queue empties', () => {
      return new Promise(testResolve => {
        setTimeout(testResolve, 1);
      }).then(() => {
        assert(dispatchRequest.calledWith(19));
        assert(dispatchRequest.neverCalledWith(6));
      });
    });
  });
  describe('receiving correctly', () => {
    beforeEach(() => {
      for (let i = 0; i < 20; i++) {
        // The task, when invoked, will add a number to dispatchedRequests
        const task = () => {
          dispatchRequest(i);
          return new Promise((resolve) => {
            setTimeout(resolve, 1);
          })
        }
        // When the response comes back, returnedRequests gets the number
        const onSuccess = () => {receiveResponse(i)};
        network.queue({task, onSuccess, priority: i, url: 'http://test.com'});
      }
    });
    it('should not receive anything until first response arrives', () => {
      assert.equal(receiveResponse.callCount, 0);
      return new Promise(testResolve => {
        setTimeout(testResolve, 1);
      }).then(() => {
        assert.equal(receiveResponse.callCount, 6);
      });
    });
    it('should receive in the order requests were dispatched', () => {
      return new Promise(testResolve => {
        setTimeout(testResolve, 1);
      }).then(() => {
        assert(receiveResponse.calledWith, 0);
        assert(receiveResponse.neverCalledWith, 1);
        return new Promise(moreResolve => {
          setTimeout(moreResolve, 1);
        }).then(() => {
          assert(receiveResponse.calledWith, 0);
          assert(receiveResponse.calledWith, 1);
        })
      });
    });
  });
  describe('flush correctly', () => {
    beforeEach(() => {
      for (let i = 0; i < 20; i++) {
        // The task, when invoked, will add a number to dispatchedRequests
        const task = () => {
          dispatchRequest(i);
          return new Promise((resolve) => {
            setTimeout(resolve, 1);
          })
        }
        // When the response comes back, returnedRequests gets the number
        const onSuccess = () => {receiveResponse(i)};
        network.queue({task, onSuccess, url: 'http://test.com'});
      }
    });
    it('should not dispatch anything after response received and queue was flushed', () => {
      return new Promise(testResolve => {
        assert.equal(dispatchRequest.callCount, 6);
        network.flush();
        setTimeout(testResolve, 10);
      }).then(() => {
        assert.equal(dispatchRequest.callCount, 6);
      });
    });
  });
  describe('handle multiple hostnames correctly', () => {
    beforeEach(() => {
      for (let i = 0; i < 10; i++) {
        // The task, when invoked, will add a number to dispatchedRequests
        const task = () => {
          dispatchRequest(i);
          return new Promise((resolve) => {
            setTimeout(resolve, 10);
          })
        }
        // When the response comes back, returnedRequests gets the number
        const onSuccess = () => {receiveResponse(i)};
        network.queue({task, onSuccess, url: 'http://test1.com'});
        network.queue({task, onSuccess, url: 'http://test2.com'});
      }
    });
    it('should not exceed total open hostnames', () => {
      assert.equal(dispatchRequest.callCount, 10);
    });
    it('should dispatch the highest priority regardless of host name', () => {
      network.queue({
        task: () => {
          dispatchRequest(100);
          return Promise.resolve();
        },
        url: 'http://test2.com'
      });
      return new Promise(testResolve => {
        setTimeout(testResolve, 10);
      }).then(() => {
        assert(dispatchRequest.calledWith(100));
      });
    });
  });
});
