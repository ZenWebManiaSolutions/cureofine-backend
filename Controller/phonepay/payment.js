const crypto =  require('crypto');
const axios = require('axios');

// const {salt_key, merchant_id} = require("./secret")
const salt_key = "099eb0cd-02cf-4e2a-8aca-3e6c6aff0399";
const merchant_id ="PGTESTPAYUAT";

const newPayment = async (req, res) => {
    try {
        const merchantTransactionId = req.body.transactionId;
        const data = {
            merchantId: merchant_id,
            merchantTransactionId: merchantTransactionId,
            merchantUserId: req.body.MUID,
            name: req.body.name,
            amount: req.body.amount * 100,
            // redirectUrl: `http://192.168.0.110:3000/api/status/${merchantTransactionId}`,
            // redirectMode: 'POST',
            mobileNumber: req.body.mobile,
            paymentInstrument: {
                type: 'PAY_PAGE'
            }
        };
        const payload = JSON.stringify(data);
        const payloadMain = Buffer.from(payload).toString('base64');
        const keyIndex = 1;
        const string = payloadMain + '/pg/v1/pay' + salt_key;
        const sha256 = crypto.createHash('sha256').update(string).digest('hex');
        const checksum = sha256 + '###' + keyIndex;

        const prod_URL = "https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay"
        const options = {
            method: 'POST',
            url: prod_URL,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                'X-VERIFY': checksum
            },
            data: {
                request: payloadMain
            }
        };

        axios.request(options).then(function (response) {
            console.log(response.data)
            res.json({ message: "Payment Initiated", result: response.data.data.instrumentResponse.redirectInfo.url,merchantId:response.data.data.merchantId,transactionId:response.data.data.merchantTransactionId});
            // return res.send(response.data.data.instrumentResponse.redirectInfo.url)
        })
        .catch(function (error) {
            console.error(error);
        });

    } catch (error) {
        res.status(500).send({
            message: error.message,
            success: false
        })
    }
}

const checkStatus = async (req, res) => {
    // const merchantTransactionId = req.body.transactionId;
    console.log("64",req.params)
    const merchantTransactionId=  req.params.txnId;
    console.log(merchantTransactionId)



    const keyIndex = 1;
    const string = `/pg/v1/status/${merchant_id}/${merchantTransactionId}` + salt_key;
    const sha256 = crypto.createHash('sha256').update(string).digest('hex');
    const checksum = sha256 + "###" + keyIndex;

    const options = {
        method: 'GET',
        url: `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchant_id}/${merchantTransactionId}`,
        headers: {
            accept: 'application/json',
            'Content-Type': 'application/json',
            'X-VERIFY': checksum,
            'X-MERCHANT-ID': `${merchant_id}`
        }
    };

    // CHECK PAYMENT STATUS
    axios.request(options).then(async (response) => {
        console.log("PhonePe Status Response:", response.data);

        if (response.data.success === true) {
            res.json({ status: 'success', message: 'Payment successful' });
        } else {
            res.json({ status: 'failure', message: 'Payment failed' });
        }
    }).catch((error) => {
        console.error("PhonePe Status API Error:", error);
        res.status(500).json({ status: 'error', message: 'Internal server error' });
    });
};

module.exports = {
    newPayment,
    checkStatus
};
