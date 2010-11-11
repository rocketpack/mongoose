/**
 * Demonstrate atomic $push to an array
 *  1) Retrieve a document
 *  2) Run a for loop from 1 to 100, pushing each index into the array that was
 *  marked as atomic. Call .save() on each iteration
 *  3) When all 100 callbacks are fired, re-fetch the document and asser that
 *     - The length of the array is 100
 *     - The order of the items is the expected one
 */
