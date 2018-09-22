const express = require('express');
const router = express.Router();

// const java_controller = require('../controllers/javaController');
const pythonC = require('../controllers/pythonController')
// router.post('/java', java_controller.generate, java_controller.compile,
//     java_controller.execute, java_controller.clean);

router.post(`/python`, pythonC.createfile, pythonC.execute,
  pythonC.clean);

module.exports = router;
