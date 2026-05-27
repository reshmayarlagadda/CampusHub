const router = require('express').Router();
const { sendContactMessage } = require('../controllers/contactController');

router.post('/', sendContactMessage);

module.exports = router;
