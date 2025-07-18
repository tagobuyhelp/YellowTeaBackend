import express from 'express';
import {
    createOrder,
    getOrderStats,
    cancelOrder,
    processRefund,
    generateInvoice,
    trackOrder,
    getOrderAnalytics,
    exportOrders,
    updateShippingDetails,
    getOrderCountByStatus
} from '../controllers/order.controller.js';
import { isAuthenticated } from '../middlewares/auth.middleware.js';
import { restrictTo } from '../middlewares/role.middleware.js';

const router = express.Router();

// Order routes
router.route('/')
    .post(isAuthenticated, createOrder);

// Order statistics route (admin only)
router.route('/stats')
    .get(isAuthenticated, restrictTo('admin'), getOrderStats);

// Order analytics for dashboard (admin only)
router.route('/analytics')
    .get(isAuthenticated, restrictTo('admin'), getOrderAnalytics);

// Export orders to CSV (admin only)
router.route('/export')
    .get(isAuthenticated, restrictTo('admin'), exportOrders);

// Get order count by status (admin only)
router.route('/count-by-status')
    .get(isAuthenticated, restrictTo('admin'), getOrderCountByStatus);

// Order specific routes
router.route('/:id/cancel')
    .put(isAuthenticated, cancelOrder);

router.route('/:id/refund')
    .put(isAuthenticated, restrictTo('admin'), processRefund);

router.route('/:id/invoice')
    .get(isAuthenticated, generateInvoice);

router.route('/:id/track')
    .get(isAuthenticated, trackOrder);

router.route('/:id/shipping')
    .put(isAuthenticated, restrictTo('admin'), updateShippingDetails);

export default router;