import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import jwt_decode from 'jwt-decode';
dotenv.config();

const generateAuthToken = async (payload) => {
  return jwt.sign({ payload }, process.env.JWT_SECRET, { expiresIn: '30d' }); //'1h','60d'
};

const verifyAuthToken = () => {
  return (req, res, next) => {
    const token = req.headers['authorization'];
    if (!token) {
      return res.status(403).send({ message: 'Auth token not found' });
    } else {
      const tokenBody = token.slice(7);
      jwt.verify(tokenBody, process.env.JWT_SECRET, (err) => {
        if (err) {
          return res
            .status(401)
            .send({ message: 'Token expired, access denied' });
        }
        next();
      });
    }
  };
};

const isValidToken = async (token) => {
  return jwt.verify(token, process.env.JWT_SECRET, (err) => {
    if (err) {
      return false;
    } else {
      return true;
    }
  });
};

const destroyToken = async (token) => {
  if (!token) {
    return false;
  } else {
    const tokenBody = token.slice(7);
    const destroy = jwt.destroy(token);
    console.log('destroying...', destroy);
  }
};

const getAuthenticateId = async (req) => {
  let token = req.headers['authorization'];
  const decoded = jwt_decode(token);
  let id = decoded.payload.id;
  return id;
};

export {
  generateAuthToken,
  verifyAuthToken,
  isValidToken,
  getAuthenticateId,
  destroyToken,
};
