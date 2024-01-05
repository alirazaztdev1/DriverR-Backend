import { body } from 'express-validator';

export const validatePasssword = [
  body('newPassword')
    .isLength({ min: 8, max: 20 })
    .withMessage('Password must be between 8 and 20 characters long')
    .matches(/[!@#$%^&*(),.?":{}|<>]/)
    .withMessage('Password must contain at least one special character')
    .matches(/[0-9]/)
    .withMessage('Password must contain at least one numeric character')
    .matches(/[a-z]/)
    .withMessage('Password must contain at least one lowercase letter')
    .matches(/[A-Z]/)
    .withMessage('Password must contain at least one uppercase letter'),
];
