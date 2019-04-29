const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const Product = require('../models/products');

router.get('/', (req, res, next) => {
	Product.find()
		.select('name price _id')
		.exec()
		.then((result) => {
			const results = {
				count: result.length,
				products: result.map((p) => {
					return {
						name: p.name,
						price: p.price,
						_id: p._id,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/products/' + p._id
						}
					};
				})
			};
			res.status(200).json({
				products: results
			});
		})
		.catch((error) => {
			console.log(error);
			res.status(404).json({
				message: 'No product found!',
				error: error
			});
		});
});

router.post('/', (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price
	});
	product
		.save()
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: 'New Product!',
				product: {
					name: result.name,
					price: result.price,
					_id: result._id
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + result._id
				}
			});
		})
		.catch((err) => {
			console.log(err);
			res.send('Something went wrong!');
		});
});

router.get('/:productId', (req, res, next) => {
	const productId = req.params.productId;
	Product.findById(productId)
		.select('name price _id')
		.exec()
		.then((result) => {
			console.log(result);
			res.status(200).json({
				message: 'Product found',
				product: {
					name: result.name,
					price: result.price,
					_id: result._id
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + result._id
				}
			});
		})
		.catch((err) => {
			res.status(404).json({
				error: err
			});
		});
});

router.patch('/:productId', (req, res, next) => {
	const productId = req.params.productId;
	const changedParams = req.body;
	const updatedParams = {};
	for (let key in changedParams) {
		updatedParams[key] = changedParams[key];
	}
	Product.update({ _id: productId }, { $set: updatedParams })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Product updated',
				request: {
					type: 'GET',
					url: 'http://localhost:3000/products/' + productId
				}
			});
		})
		.catch((error) => {
			res.status(404).json({
				error: error
			});
		});
});

router.delete('/:productId', (req, res, next) => {
	const productId = req.params.productId;
	Product.remove()
		.then((result) => {
			console.log(result);
			res.status(200).json({
				message: 'Product deleted'
			});
		})
		.catch((error) => {
			res.status(404).json({
				message: error
			});
		});
});

module.exports = router;
