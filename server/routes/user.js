const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.get('/', userController.view);
router.get('/transcation',userController.trans);
router.get('/transfer',userController.mon);
router.post('/transfer',userController.form);



module.exports = router;