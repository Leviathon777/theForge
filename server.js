const express = require('express');
const stripe = require('stripe')('pk_test_51OsKglDB2hEnJcqyQFsy4s8onv0bfeBnhBFMz762Ag4wbigHxNagQBkXzeRHpbsnDXqeQTQmX5MS5c4CKZPWTVN600l9HxG4i1'); 
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/create-payment-intent', async (req, res) => {
  const { items } = req.body;

  // Implement calculateOrderAmount based on your business logic
  const amount = calculateOrderAmount(items);

  // Create a PaymentIntent with the order amount and currency
  const paymentIntent = await stripe.paymentIntents.create({
    amount,
    currency: 'usd', // Replace with your desired currency
  });

  // Send the client secret to the client
  res.json({ client_secret: paymentIntent.client_secret });
});

app.listen(3001, () => {
  console.log('Server is running on port 3001');
});

function calculateOrderAmount(items) {
  // Implement your logic to calculate the order amount based on items
  return 1000; // Replace with your actual calculation
}
