const express = require('express');
const router = express.Router();
const requestController = require('../controllers/requestController');

// Create a new weather request
router.post('/requests', requestController.createRequest);

// List all requests
router.get('/requests', requestController.listRequests);

// Get request by ID
router.get('/requests/:id', requestController.getRequest);

// Update request by ID
router.put('/requests/:id', requestController.updateRequest);

// Delete request by ID
router.delete('/requests/:id', requestController.deleteRequest);

// Export request by ID (JSON or CSV)
router.get('/requests/:id/export', requestController.exportRequest);

module.exports = router;
