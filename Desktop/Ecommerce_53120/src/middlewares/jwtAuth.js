import jwt from 'jsonwebtoken';

const jwtAuth = (req, res, next) => {
  const token = req.cookies.auth || req.headers.authorization?.split(' ')[1];

  if (!token) {
    return res.status(401).send({ status: 'error', message: 'No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET || 'coderSecret', (err, decoded) => {
    if (err) {
      return res.status(401).send({ status: 'error', message: 'Failed to authenticate token' });
    }
    req.user = decoded;
    next();
  });
};

export default jwtAuth;
