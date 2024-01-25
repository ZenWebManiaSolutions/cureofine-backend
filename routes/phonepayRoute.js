const {newPayment, checkStatus} = require("../Controller/phonepay/payment")
const express = require('express');
const router = express();

router.post('/payment', newPayment);
router.post('/status/:txnId', checkStatus);

module.exports = router;