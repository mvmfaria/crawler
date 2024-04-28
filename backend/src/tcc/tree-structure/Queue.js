/**
 * Represents a Queue data structure.
 */
class Queue {

  /**
   * Creates an instance of Queue.
   */
  constructor() {
    this.items = [];
  }

  /**
   * Adds an element to the end of the queue.
   * @param {*} element - The element to be added.
   */
  enqueue(element) {
    this.items.push(element);
  }

  /**
   * Removes and returns the first element from the queue.
   *
   * @returns {*} The removed element from the queue.
   */
  dequeue() {
    return this.items.shift();
  }

  /**
   * Checks if the queue is empty.
   * @returns {boolean} Returns true if the queue is empty, false otherwise.
   */
  isEmpty() {
    return this.items.length === 0;
  }
}

module.exports = Queue;