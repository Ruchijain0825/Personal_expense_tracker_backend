const devAuthMiddleware = (req, res, next) => {
  console.log("DEV AUTH ENTERED");

  console.log("NODE_ENV:", process.env.NODE_ENV);
  console.log("DEV_BYPASS_AUTH:", process.env.DEV_BYPASS_AUTH);

  if (
    process.env.NODE_ENV !== "development" ||
    process.env.DEV_BYPASS_AUTH !== "true"
  ) {
    console.log("AUTH CONDITION FAILED");

    return res.status(401).json({
      message: "Authentication required"
    });
  }

  req.user = {
    userId: "000000000000000000000001"
  };

  console.log("DEV USER:", req.user);

  next();
};

export default devAuthMiddleware;