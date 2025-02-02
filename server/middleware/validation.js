const { body, validationResult } = require('express-validator');

const contactValidation = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('message').trim().notEmpty().withMessage('Message is required'),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

const validateService = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('description').trim().notEmpty().withMessage('Description is required'),
    body('price').optional().trim()
];

const validateBlogPost = [
    body('title').trim().notEmpty().withMessage('Title is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('category').optional().trim()
];

const validateTestimonial = [
    body('author').trim().notEmpty().withMessage('Author name is required'),
    body('content').trim().notEmpty().withMessage('Content is required'),
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1-5')
];

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

module.exports = {
    contactValidation,
    validateService,
    validateBlogPost,
    validateTestimonial,
    handleValidation
};