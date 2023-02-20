/**
 * @description - Cart routes
 * @author - Eloilson <eloilsonfontenele2@gmail.com>
 */

const router = require('express').Router();
const Cart = require('../models/Cart');
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAuthorization, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedCart = await newCart.save();
    return res.status(200).json({
      message: 'Cart created successfully',
      savedCart,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: 'Error in creating cart',
    });
  }
});

router.put('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );

    return res.status(200).json({
      message: 'Cart updated successfully',
      updatedCart,
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Error updating Cart',
    });
  }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Cart.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Cart deleted successfully',
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Error deleting Cart',
    });
  }
});

router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const cart = await Cart.find(req.params.id);

    return res.status(200).json({ cart });
  } catch (e) {
    return res.status(400).send({
      error: 'Error finding Cart',
    });
  }
});

router.get('/', verifyTokenAndAdmin, async (_, res) => {
  try {
    const cart = await Cart.find();
    return res.status(200).json({ cart });
  } catch (e) {
    return res.status(500).send({
      error: 'Error fetching carts',
    });
  }
});

module.exports = router;
