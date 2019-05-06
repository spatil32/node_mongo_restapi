const express = require('express');
const router = express.Router();
const multer = require('multer');

const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, './uploads/');
	},
	filename: (req, file, cb) => {
		cb(null, new Date().toISOString() + file.originalname);
	}
});

const fileFilter = (req, file, cb) => {
	if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') cb(null, true);
	else cb(null, false);
};

const upload = multer({
	storage: storage,
	limits: {
		fileSize: 1024 * 1024 * 5
	},
	fileFilter: fileFilter
});

const productsController = require('../controllers/products');

router.get('/', productsController.get_all_products);

router.post('/', checkAuth, upload.single('productImage'), productsController.create_product);

router.get('/:productId', productsController.get_product_by_id);

router.patch('/:productId', checkAuth, productsController.update_product);

router.delete('/:productId', checkAuth, productsController.delete_product);

module.exports = router;
