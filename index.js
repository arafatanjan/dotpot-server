require("dotenv").config();
const express = require('express');
const cors = require('cors');
// const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();



app.use(express.json());

app.use(
  cors()
);

const SSLCommerzPayment = require('sslcommerz-lts')

const port = process.env.PORT;

//SSLCommerze
const store_id = process.env.STORE_ID;
const store_passwd = process.env.STORE_PASSWORD;
const is_live = false //true for live, false for sandbox

//payment
const tran_id= 'REF123';

app.post('/order', async (req, res) => {
    const id = req.params.id;
     console.log(id)

   const data = {
        total_amount: req.body.price,
        currency: 'BDT',
        tran_id: tran_id, // use unique tran_id for each api call
        success_url: `https://dotpot-frontend.vercel.app/payment/success/${tran_id}`,
        fail_url: `http://localhost:5000/payment/fail/${tran_id}`,
        cancel_url: 'http://localhost:3030/cancel',
        ipn_url: 'http://localhost:3030/ipn',
        shipping_method: 'Courier',
        product_name: 'Computer.',
        product_category: 'Electronic',
        product_profile: 'general',
        cus_name: 'Customer Name',
        cus_email: 'customer@example.com',
        cus_add1: 'Dhaka',
        cus_add2: 'Dhaka',
        cus_city: 'Dhaka',
        cus_state: 'Dhaka',
        cus_postcode: '1000',
        cus_country: 'Bangladesh',
        cus_phone: '01711111111',
        cus_fax: '01711111111',
        ship_name: 'Customer Name',
        ship_add1: 'Dhaka',
        ship_add2: 'Dhaka',
        ship_city: 'Dhaka',
        ship_state: 'Dhaka',
        ship_postcode: 1000,
        ship_country: 'Bangladesh',
    };
  
    // console.log(data);
  
    try {
        const sslcz = new SSLCommerzPayment(store_id, store_passwd, is_live);
        console.log('sslcz', sslcz);
        const apiResponse = await sslcz.init(data);
        console.log('apiResponse', apiResponse);
  
        let GatewayPageURL = apiResponse.GatewayPageURL;
  
        console.log('Redirecting to: ', GatewayPageURL);
         res.send({ url : GatewayPageURL});
        //res.redirect({ url : GatewayPageURL});
        console.log('Redirecting to: ', url);
    } 
    catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  //Payment Success Route
app.post('/payment/success/:tranId', async (req, res) => {
    try { 
            res.redirect(`http://localhost:5173/payment/success/${req.params.tranId}`);
        
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });


  //Payment Failure Route
app.post('/payment/fail/:tranId', async (req, res) => {
    try {
            res.redirect(`http://localhost:5173/payment/fail/${req.params.tranId}`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Internal Server Error');
    }
  });

  app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
  })
