import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import User from "../models/users.models.js";
import dotenv from "dotenv";


// Adding a signup for user to the app...
export const signup = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
  
      // Hash the password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
  
      // Create a new user
      const newUser = new User({
        username,
        email,
        password: hashedPassword,
      });
  
      if(!username || !email || !password){
        res.status(400).json({
          success: false,
          message: "Please fill in all fields.",
        });
      }
  
      // Check if the email already exists
      if (await User.findOne({ email })) {
        res.status(400).json({
          success: false,
          message: "User with this email already exists in the database...",
        });
      }
  
      const result = await newUser.save();
  
      // Generate a JWT token for user authentication
      const token = jwt.sign({ id: result._id }, process.env.JWT_SECRET, {
        expiresIn: "1d",
      });
  
      const { password: pass, ...userDetails } = result._doc;
  
      // Respond with user details and token
      res.status(201).json({
        success: true,
        message: "User created successfully.",
        data: {
          user: userDetails,
          token,
        },
      });
    } catch (error) {
      next(error);
      res.status(400).json({
        success: false,
        message: "Failed to create a user in your system.",
      });
    }
  };
  