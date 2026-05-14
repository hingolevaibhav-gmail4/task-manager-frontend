const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  let token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token" });
  }

  // Support "Bearer TOKEN" format (important for deployment)
  if (token.startsWith("Bearer ")) {
    token = token.split(" ")[1];
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Ensure role is present
    req.user = {
      id: decoded.id,
      role: decoded.role
    };

    next();
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
};