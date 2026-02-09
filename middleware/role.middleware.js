function accessRole(...allowedRole) {
  return (req, resp, next) => {
    try {
      if (!req.user?.role) {
        return resp.status(401).json({ message: "Unauthorized" });
      }

      if (!allowedRole.includes(req.user.role)) {
        return resp.status(403).json({ message: "Access denied" });
      }

      next();
    } catch (err) {
      console.log(err);
    }
  };
}

module.exports = {accessRole}