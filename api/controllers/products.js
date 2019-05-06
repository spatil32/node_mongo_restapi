const mongoose = require('mongoose');

const Product = require('../models/products');

exports.get_all_products = (req, res, next) => {
	Product.find()
		.select('name price _id productImage')
		.exec()
		.then((result) => {
			const results = {
				count: result.length,
				products: result.map((p) => {
					return {
						name: p.name,
						price: p.price,
						productImage: p.productImage,
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
};

exports.create_product = (req, res, next) => {
	const product = new Product({
		_id: new mongoose.Types.ObjectId(),
		name: req.body.name,
		price: req.body.price,
		productImage: req.file.path
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
};

exports.get_product_by_id = (req, res, next) => {
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
};

exports.update_product = (req, res, next) => {
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
};

exports.delete_product = (req, res, next) => {
	const productId = req.params.productId;
	Product.remove({ _id: productId })
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
};
