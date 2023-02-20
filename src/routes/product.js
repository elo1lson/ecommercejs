/** @format */

const router = require('express').Router();
const CryptoJS = require('crypto-js');
const Product = require('../models/Product');
const {
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
} = require('../middlewares/verifyToken');

router.post('/', verifyTokenAndAdmin, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).json({
      message: 'product created successfully',
      savedProduct,
    });
  } catch (e) {
    console.log(e);
    return res.status(400).json({
      message: 'Error in creating product',
    });
  }
});

router.put('/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );

    return res.status(200).json({
      message: 'Product updated successfully',
      updatedProduct,
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Error updating Product',
    });
  }
});

router.delete('/:id', verifyTokenAndAuthorization, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      message: 'Product deleted successfully',
    });
  } catch (e) {
    return res.status(400).send({
      error: 'Error deleting Product',
    });
  }
});

router.get('/find/:id', verifyTokenAndAdmin, async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    return res.status(200).json({ product });
  } catch (e) {
    console.log(e);
    return res.status(400).send({
      error: 'You are not alowed to that',
    });
  }
});

router.get('/', verifyTokenAndAdmin, async (req, res) => {
  const qNew = req.query.new;
  const qCategoty = req.query.category;
  let products;
  const avaliableNewQueryValues = ['true', 'false'];

  try {
    if (qNew && avaliableNewQueryValues.includes(qNew)) {
      products = await Product.find().sort({ _id: -1 }).limit(5);
      return res.status(200).json({ news: products });
    }
    if (qCategoty) {
      products = await Product.find({
        categories: {
          $in: [qCategoty],
        },
      });
      return res.status(200).json({ query: products });
    }

    products = await Product.find();
    return res.status(200).json({ all: products });
  } catch (e) {
    return res.status(500).send({
      error: 'Error fetching products',
    });
  }
});

module.exports = router;
