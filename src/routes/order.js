/**
 * @description - Order routes
 * @author - Eloilson <eloilsonfontenele2@gmail.com>
 */

const router = require('express').Router();
const Order = require('../models/Order');
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAuthorization, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    return res.status(200).json({
      message: 'Order created successfully',
      savedOrder,
    });
  } catch (e) {
    return res.status(400).json({
      message: 'Error in creating Order',
    });
  }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true },
    );

    return res.status(200).json({
      message: 'Order updated successfully',
      updatedOrder,
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Error updating Order',
    });
  }
});

router.delete('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Order deleted successfully',
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Error deleting Order',
    });
  }
});

router.get('/find/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find(req.params.id);

    return res.status(200).json({ orders });
  } catch (e) {
    return res.status(400).send({
      error: 'Error finding Order',
    });
  }
});

router.get('/', verifyTokenAndAdmin, async (_, res) => {
  try {
    const orders = await Order.find();
    return res.status(200).json({ orders });
  } catch (e) {
    return res.status(500).send({
      error: 'Error fetching Orders',
    });
  }
});

router.get('/income', verifyTokenAndAdmin, async (req, res) => {
  try {
    const date = new Date();
    const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
    const previousMonth = new Date(
      new Date().setMonth(lastMonth.getMonth() - 1),
    );

    const income = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: previousMonth },
        },
      },
      {
        $project: {
          month: {
            $month: '$createdAt',
          },
          sales: '$amount',
        },
      },
      {
        $group: {
          _id: '$month',
          total: { $sum: '$sales' },
        },
      },
    ]);

    return res.status(200).json({ income });
  } catch (e) {
    return res.status(500).send({
      error: 'Error fetching Orders',
    });
  }
});
module.exports = router;
