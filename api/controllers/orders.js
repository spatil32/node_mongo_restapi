const Order = require('../models/order');
const Product = require('../models/products');
const mongoose = require('mongoose');

exports.get_all_orders = (req, res, next) => {
	Order.find()
		.populate('product')
		.exec()
		.then((docs) => {
			res.status(200).json({
				length: docs.length,
				orders: docs.map((doc) => {
					return {
						_id: doc._id,
						quantity: doc.quantity,
						request: {
							type: 'GET',
							url: 'http://localhost:3000/orders/' + doc._id
						}
					};
				})
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};

exports.create_order = (req, res, next) => {
	Product.findById(req.body.productId)
		.exec()
		.then((product) => {
			if (!product) {
				return res.status(404).json({
					message: 'Product not found'
				});
			}
			const order = new Order({
				_id: mongoose.Types.ObjectId(),
				quantity: req.body.quantity,
				product: req.body.productId
			});
			return order.save();
		})
		.then((result) => {
			console.log(result);
			res.status(201).json({
				message: 'Order Stored',
				createdOrder: {
					_id: result._id,
					product: result.product,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id
				}
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};

exports.getOrderById = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.findById(orderId)
		.populate('product')
		.exec()
		.then((result) => {
			res.status(200).json({
				message: `Order Fetched`,
				order: {
					_id: result._id,
					productId: result.productId,
					quantity: result.quantity
				},
				request: {
					type: 'GET',
					url: 'http://localhost:3000/orders/' + result._id
				}
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};

exports.delete_order_by_id = (req, res, next) => {
	const orderId = req.params.orderId;
	Order.remove({ _id: orderId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'Order deleted',
				result
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};
