const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.token;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_KEY, (err, user) => {
      if (err) {
        return res.status(401).json({ error: 'Token is not valid!' });
      }
      req.user = user;
      return next();
    });
    return;
  }
  res.status(401).json({ error: 'Token is not provided!' });
};

const verifyTokenAndAuthorization = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id || req.user.isAdmin) {
      next();
    }
    res.status(401).json({
      error: 'You are not authorized to perform this',
    });
  });
};

const verifyTokenAndAdmin = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.isAdmin) {
      /* eslint-disable*/
      //test for return
      return next();
    }
    return res.status(401).json({
      error: 'You are not authorized to perform this',
    });
  });
};

module.exports = {
  verifyToken,
  verifyTokenAndAdmin,
  verifyTokenAndAuthorization,
};
