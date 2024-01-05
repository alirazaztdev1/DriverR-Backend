import { validationResult } from 'express-validator';
import responseUtil from '../utilities/response.js';

const passwordValidation = (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw new Error(
        'The password entered is not valid, the password should be of min 8 characters, and max 20 characters, should contain a special character, a numeric character, and should use both lower and upper case alphabets'
      );
    }
    next();
  } catch (error) {
    return responseUtil.validationErrorResponse(res, error.message);
  }
};

export { passwordValidation };

// return responseUtil.validationErrorResponse(res, response.message);
