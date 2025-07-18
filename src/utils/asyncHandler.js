/**
 * Async handler to avoid try-catch blocks in route handlers
 * @param {Function} fn - The async function to handle
 * @returns {Function} - Express middleware function
 */
const asyncHandler = (fn) => (req, res, next) =>
    Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;