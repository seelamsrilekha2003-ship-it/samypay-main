const express = require('express');
const router = express.Router();
const plansController = require('./plans.controller');

router.get('/', plansController.getPlans);

module.exports = router;
