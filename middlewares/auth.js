module.exports = (req, res, next) => {
  /*
    🔥 DEMO AUTH
    Real JWT later add cheyyachu
  */
  req.user = { id: 1 }; // demo user
  next();
};
