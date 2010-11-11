/**
 * Show .pre()/.post() hooks that yield
 *  - A serial flow control (by next()ing when the async code completes)
 *  - A parallel flow control (by next()ing immediately and fireing the done() callback
 *  when the task is completed
 */
