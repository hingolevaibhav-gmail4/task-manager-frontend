const User = require("../models/User");

const bcrypt = require("bcryptjs");

const jwt = require("jsonwebtoken");

// SIGNUP
exports.signup = async (req, res) => {
  try {

    const {
      name,
      lastName,
      email,
      password
    } = req.body;

    // CHECK EXISTING USER
    const existing =
      await User.findOne({
        email
      });

    if (existing) {
      return res.status(400).json({
        error:
          "Email already exists"
      });
    }

    // HASH PASSWORD
    const hashed =
      await bcrypt.hash(
        password,
        10
      );

    // CREATE MEMBER ACCOUNT
    const user =
      await User.create({
        name,
        lastName,
        email,
        password: hashed,

        // DEFAULT ROLE
        role: "member"
      });

    res.json(user);

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};

// LOGIN
exports.login = async (req, res) => {
  try {

    const { email, password } =
      req.body;

    // FIND USER
    const user =
      await User.findOne({
        email
      });

    if (!user) {
      return res.status(404).json({
        error:
          "User not found"
      });
    }

    // CHECK PASSWORD
    const match =
      await bcrypt.compare(
        password,
        user.password
      );

    if (!match) {
      return res.status(400).json({
        error:
          "Invalid password"
      });
    }

    // CREATE TOKEN
    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET
    );

    // SEND ROLE + TOKEN
    res.json({
      token,
      role: user.role,

      user: {
        id: user._id,
        name: user.name,
        lastName:
          user.lastName,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {

    res.status(400).json({
      error: err.message
    });
  }
};