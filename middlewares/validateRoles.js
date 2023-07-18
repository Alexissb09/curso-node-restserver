export const isAdminRole = (req, res, next) => {
  try {
    const userAuth = req.userAuth;
    const { role, name } = userAuth;

    if (!userAuth) {
      return res.status(500).json({
        message:
          "Trying to verify user's role without first validate the token",
      });
    }

    if (role !== "ADMIN_ROLE") {
      return res
        .status(401)
        .json({ message: `${name} doesn't have permissions` });
    }

    next();
  } catch (error) {
    console.log(error);
  }
};

export const haveRole = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.userAuth.role)) {
      return res.status(401).json({
        message: `The service require this roles: ${roles}`,
      });
    }
    next();
  };
};
