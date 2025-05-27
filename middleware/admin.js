const checkAdmin = (req, res, next) => {
  if (req.userData && req.userData.rol === 'admin') {
    next();
  } else {
    res.status(403).send({ message: 'Access denied: Admins only' });
  }
};

module.exports = checkAdmin;