const jwt = require("jsonwebtoken");
const { User } = require("../models/sequelize");

const auth = async function (req, res, next) {
  let user = {};
  try {
    console.log(req.body);
    if (!req.headers?.authorization) {
      return res.status(400).json({ message: "missing authorization header" });
    }

    const bearerToken = req.headers.authorization;
    const [bearer, token] = bearerToken.split(" ");
    console.log(token);

    user = await User.findOne({ where: { token: token }, raw: true });

    if (!user) {
      return res.status(401).json({ message: "unauthorized" });
    }

    // --- check token if expired ---
    jwt.verify(token, process.env.TOKEN_KEY);

    // --- attach user information to req.user ---
    req.user = user;

    next();
  } catch (exception) {
    if (exception.name === "TokenExpiredError") {
      // --- token is expired, let's create a new one and return it to the client ---
      const newToken = jwt.sign(
        {
          email: user.email,
          firstName: user.firstName,
        },
        process.env.TOKEN_KEY,
        { expiresIn: Number(process.env.JWT_EXPIRES_IN) }
      );

      await User.update(
        { token: token },
        {
          where: {
            token: newToken,
          },
        }
      );

      return res.status(201).json({ token: newToken });
    }
    return res.status(401).json({ message: "unauthorized" });
  }
};

module.exports = auth;
