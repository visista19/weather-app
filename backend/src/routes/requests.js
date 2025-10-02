const express = require('express');
const router = express.Router();
const requestsController = require('../controllers/requestsController');

// CRUD
router.post('/', requestsController.createRequest);
router.get('/', requestsController.listRequests);
router.get('/:id', requestsController.getRequest);
router.put('/:id', requestsController.updateRequest);
router.delete('/:id', requestsController.deleteRequest);
router.get('/:id/export', requestsController.exportRequest);

// ✅ New weather by location
router.get('/weather/search', requestsController.getWeatherByLocation);

module.exports = router;
