const express = require('express');
const router = express.Router();

const java_controller = require('../controllers/javaController');

router.post('/java', java_controller.generate, java_controller.compile,
    java_controller.execute, java_controller.clean);

module.exports = router;
