const router = require('express').Router();
const stripe = require('stripe')(process.env.STRIPE_KEY);

router.post('/payment', async (req, res) => {
  try {
    stripe.charges.create(
      {
        source: req.body.tokenId,
        amount: req.body.amount,
        currency: 'brl',
      },
      (stripeErr, stripeRes) => {
        if (stripeErr) {
          return res.status(500).send({ error: stripeErr });
        }
        return res.status(200).json({ success: stripeRes });
      },
    );
  } catch (err) {
    res.status(500).end();
  }
});

module.exports = router;
