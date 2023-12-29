const isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    return res.redirect("/login");
  }
  next();
};

const isOwner = (req, res, next) => {
  let { id } = req.params;
  if (req.user.student._id != id) {
    return res.redirect("/logout");
  }
  next();
};

const middleware = { isLoggedIn, isOwner };
export default middleware;
