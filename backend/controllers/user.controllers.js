import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.models.js";
import dotenv from "dotenv";

dotenv.config();

// Adding a signup for user to the app...
export const signup = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    // Check for missing fields
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please fill in all fields.",
      });
    }

    // Check if the email is valid
    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    // Check if the password is at least 8 characters
    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 8 characters.",
      });
    }

    // Check if the email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User with this email already exists in the database...",
      });
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    });

    const result = await newUser.save();

    // Generate a JWT token for user authentication
    const token = jwt.sign({ id: result._id }, process.env.SECRET_KEY_JWT, {
      expiresIn: "1d",
    });

    const { password: pass, ...userDetails } = result._doc;

    // Respond with user details and token
    return res.status(201).json({
      success: true,
      message: "User created successfully.",
      data: {
        user: userDetails,
        token,
      },
    });
  } catch (error) {
    next(error);
    return res.status(500).json({
      success: false,
      message: "Failed to create a user in your system.",
    });
  }
};

// Adding a login for user to the app...
export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const validUser = await User.findOne({ email });

    if (!validUser) {
      const error = new Error("User not found");
      error.status = 404;
      return next(error);
    }

    const validPassword = await bcrypt.compare(password, validUser.password);

    if (!validPassword) {
      const error = new Error("Password is incorrect");
      error.status = 401;
      return next(error);
    }

    // If all is good, user signed in successfully
    const token = jwt.sign({ id: validUser._id }, process.env.SECRET_KEY_JWT, {
      expiresIn: "1d", // You could shorten this for better security
    });
    const { password: pass, ...userDetails } = validUser._doc;

    const cookieOptions = {
      httpOnly: true,
      sameSite: true,
      secure: process.env.NODE_ENV === "production",
    };

    res.cookie("access_token", token, cookieOptions).status(200).json({
      user: userDetails,
      success: true,
      message: "User signed in successfully",
      token,
    });
  } catch (error) {
    next(error);
  }
};
