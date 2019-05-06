const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const User = require('../models/user');

exports.signup_user = (req, res, next) => {
	User.find({ email: req.body.email }).exec().then((user) => {
		if (user.length >= 1) {
			res.status(409).json({
				message: 'User already exists!'
			});
		} else {
			bcrypt.hash(req.body.password, 10, (err, hash) => {
				if (err) {
					res.status(500).json({
						error: err
					});
				} else {
					const user = new User({
						_id: new mongoose.Types.ObjectId(),
						email: req.body.email,
						password: hash
					});
					user
						.save()
						.then((result) => {
							console.log(result);
							res.status(201).json({
								message: 'User created'
							});
						})
						.catch((err) => {
							console.log(err);
							res.status(500).json({
								error: err
							});
						});
				}
			});
		}
	});
};

exports.login_user = (req, res, next) => {
	User.find({ email: req.body.email })
		.exec()
		.then((users) => {
			if (users.length < 1) {
				res.status(401).json({
					message: 'Auth failed'
				});
			} else {
				bcrypt.compare(req.body.password, users[0].password, (err, result) => {
					if (err || !result) {
						res.status(401).json({
							message: 'Auth failed'
						});
					} else {
						const token = jwt.sign(
							{
								email: users[0].email,
								_id: users[0]._id
							},
							process.env.JWT_KEY,
							{
								expiresIn: '1h'
							}
						);
						res.status(200).json({
							message: 'Auth Successful',
							token
						});
					}
				});
			}
		})
		.catch((err) => {
			console.log(err);
			res.status(500).json({
				error: err
			});
		});
};

exports.deleteUser = (req, res, next) => {
	User.remove({ _id: req.params.userId })
		.exec()
		.then((result) => {
			res.status(200).json({
				message: 'User deleted'
			});
		})
		.catch((err) => {
			res.status(500).json({
				error: err
			});
		});
};
