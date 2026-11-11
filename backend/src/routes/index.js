const express = require('express');
const publicRoutes = require('./public.routes');
const adminRoutes = require('./admin.routes');

const router = express.Router();
router.use('/admin', adminRoutes);
router.use('/', publicRoutes);

module.exports = router;
