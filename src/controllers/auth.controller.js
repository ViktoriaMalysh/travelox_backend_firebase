const keys = require("../keys/keys");
const { User, PaymentCards, UserPaymentCards } = require("../models/sequelize");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

module.exports.signUp = async function (req, res) {
  try {
    const { firstName, lastName, email, password } = req.body;

    const isAlreadyExistEmail = await checkEmail(email);

    if (isAlreadyExistEmail) {
      return res.status(404).json({
        message: "Email already taken",
      });
    }

    await User.sync({ alter: true });

    const salt = bcrypt.genSaltSync(10);
    const bcryptPassword = bcrypt.hashSync(password, salt);

    const token = jwt.sign(
      {
        email: email,
        firstName: firstName,
      },
      keys.jwt,
      { expiresIn: 300 }
    );

    const newUser = await User.create({
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: bcryptPassword,
      token: token,
    });
    await newUser.save();

    return res.json({
      token: token,
      userDetails: {
        id: newUser.dataValues.id,
        firstName: newUser.dataValues.firstName,
        lastName: newUser.dataValues.lastName,
        email: newUser.dataValues.email,
      },
    });
  } catch (exeption) {
    console.log("[Error]: " + exeption);
    return res.status(500).json({
      message: exeption,
    });
  }
};

module.exports.signIn = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await checkEmail(email);

    const checkPassword = bcrypt.compareSync(password, user.password);

    if (!checkPassword) {
      return res.status(404).json({
        message: "Wrong password",
      });
    }

    const token = jwt.sign(
      {
        email: user.email,
        firstName: user.firstName,
      },
      keys.jwt,
      { expiresIn: 300 }
    );

    return res.json({
      token: token,
      userDetails: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (exeption) {
    console.log("[Error]:", exeption);
    return res.status(500).json({
      message: exeption,
    });
  }
};

module.exports.verifyToken = async function (req, res) {
  try {
    const token = await req.headers["authorization"];
    const decode_token = jwt.decode(token);
    if (decode_token === null) {
      res.status(404).json({ message: "invalid token" });
    } else {
      const check_user = await checkEmail(decode_token.email);

      jwt.verify(token, keys.jwt, function (err, decoded) {
        const newToken = jwt.sign(
          {
            email: decode_token.email,
            password: decode_token.password,
            id: decode_token.id,
          },
          keys.jwt,
          { expiresIn: 600 }
        );
        res.status(200).json({
          token: err ? newToken : token,
          userDetails: {
            id: check_user.id,
            firstName: check_user.firstName,
            lastName: check_user.lastName,
            email: check_user.email,
          },
        });
      });
    }
  } catch (err) {
    console.log("[Error]: " + err);
    res.status(500).json({ message: err });
  }
};

checkEmail = async function (email) {
  const result = await User.findOne({ where: { email: email }, raw: true });
  if (result === null) return false;
  else if (result.email === email) return result;
};
