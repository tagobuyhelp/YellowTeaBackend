/**
 * Standard success response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Object} data - Response data
 */
export const successResponse = (res, statusCode = 200, message = 'Success', data = {}) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

/**
 * Paginated response
 * @param {Object} res - Express response object
 * @param {Number} statusCode - HTTP status code
 * @param {String} message - Success message
 * @param {Array} data - Response data array
 * @param {Number} page - Current page
 * @param {Number} limit - Items per page
 * @param {Number} total - Total number of items
 */
export const paginatedResponse = (res, statusCode = 200, message = 'Success', data = [], page = 1, limit = 10, total = 0) => {
    const totalPages = Math.ceil(total / limit);

    return res.status(statusCode).json({
        success: true,
        message,
        data,
        pagination: {
            page,
            limit,
            total,
            totalPages,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        }
    });
};