import assert from 'assert';
import PriorityQueue from '../../src/priorityqueue';
import Request from '../../src/request';
import sinon from 'sinon';

describe('PriorityQueue Tests', () => {
  let priorityQueue;
  beforeEach(() => {
    priorityQueue = new PriorityQueue({
      comparator: Request.getRequestComparator, 
      maxSize: 100
    });
  });
  it('isEmpty', () => {
    assert(priorityQueue.isEmpty());
    priorityQueue.add({});
    assert(!priorityQueue.isEmpty());
    priorityQueue.pop();
    assert(priorityQueue.isEmpty());
  });
});
