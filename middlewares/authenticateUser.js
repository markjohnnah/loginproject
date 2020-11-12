//use of middleware
module.exports = (req, res, next) => {
  if (!req.session.user) {
    res.send("You're not allowed to view this content! please login or register!");
    return;
  }
  //else continue
  next();
};
