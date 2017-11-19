class PriorityQueue {
  constructor({comparator, maxSize}) {
    this.maxSize = maxSize;
    this.comparator = comparator;
    this.reset();
  }

  reset() {
    this.queue = [];
    this.size = 0;
  }

  printQueue() {
    console.log(`Printing queue of size ${this.size}`);
    for (let i = 0; i < this.size; i++) {
      console.log(this.queue[i]);
    }
  }

  add(data) {
    this.queue[this.size] = data;
    this.size += 1;
    this.bubble(this.size - 1);
  }

  isEmpty() {
    return this.size === 0;
  }

  pop() {
    const minElement = this.queue[0];
    this.size = Math.max(this.size - 1, 0);
    this.queue[0] = this.queue[this.size];
    this.queue[this.size] = null;
    this.sink(0);
    return minElement;
  }

  swap(indexA, indexB) {
    const tmp = this.queue[indexA];
    this.queue[indexA] = this.queue[indexB];
    this.queue[indexB] = tmp;
  }

  withinBounds(index) {
    return index < this.size && 0 <= index;
  }

  isFirstArgGreater(firstArg, secondArg) {
    return this.comparator(firstArg, secondArg) === 1;
  }

  sink(index) {
    if (!this.withinBounds(index)) {
      return;
    }
    const leftChildIndex = (index << 1) + 1;
    const rightChildIndex = leftChildIndex + 1;
    let swapIndex = index;
    if (this.withinBounds(leftChildIndex) && this.isFirstArgGreater(this.queue[leftChildIndex], this.queue[swapIndex])) {
      swapIndex = leftChildIndex;
    }
    if (this.withinBounds(rightChildIndex) && this.isFirstArgGreater(this.queue[rightChildIndex], this.queue[swapIndex])) {
      swapIndex = rightChildIndex;
    }
    if (swapIndex !== index) {
      this.swap(swapIndex, index);
      return this.sink(swapIndex);
    }
  }

  bubble(index) {
    if (index <= 0) {
      return;
    }
    const parentIndex = (index - 1) >> 1
    const parentData = this.queue[parentIndex];
    // Stop bubbling if parent's priority higher than mine
    if (this.comparator(parentData, this.queue[index]) === 1) {
      return;
    }
    this.swap(index, parentIndex);
    this.bubble(parentIndex);
  }
}

export default PriorityQueue;
