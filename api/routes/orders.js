const express = require('express');
const router = express.Router();

router.get('/', (req, res, next) => {
	res.status(200).json({
		message: 'Order was fetched!'
	});
});

router.post('/', (req, res, next) => {
	const order = {
		productId: req.body.productId,
		quantity: req.body.quantity
	};
	res.status(201).json({
		order
	});
});

router.get('/:orderId', (req, res, next) => {
	const orderId = req.params.orderId;
	res.status(200).json({
		message: `Order Id is ${orderId}!`
	});
});

router.delete('/:orderId', (req, res, next) => {
	const orderId = req.params.orderId;
	res.status(200).json({
		message: `Deleted order Id is ${orderId}!`
	});
});

module.exports = router;
