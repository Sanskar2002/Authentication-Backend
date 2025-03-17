import User from "../model/User.model.js";
import crypto from "crypto";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const registerUser = async (req, res) => {
  //get data
  //validate
  //check if user is already registered
  //create user in db
  //create verification token
  //save token
  //send token to user via mail
  //send success message

  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: "All fields are required",
    });
  }

  try {
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "User already exists",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "User not registered",
      });
    }

    const token = crypto.randomBytes(32).toString("hex");
    User.verificationToken = token;

    await user.save();

    const transporter = nodemailer.createTransport({
      host: process.env.MAILTRAP_HOST,
      port: process.env.MAILTRAP_PORT,
      secure: false, // true for port 465, false for other ports
      auth: {
        user: process.env.MAILTRAP_USERNAME,
        pass: process.env.MAILTRAP_PASSWORD,
      },
    });

    const mailOption = {
      from: process.env.MAILTRAP_SENDERMAIL,
      to: user.email,
      subject: "Verify your mail",
      text: `Please click on the following link ${process.env.BASE_URL}/api/v1/users/verify/${token}`,
    };

    console.log(
      process.env.MAILTRAP_HOST,
      process.env.MAILTRAP_PORT,
      process.env.MAILTRAP_USERNAME,
      process.env.MAILTRAP_PASSWORD
    );

    console.log("Mailtrap Username:", process.env.MAILTRAP_USERNAME);
    console.log("Mailtrap Password:", process.env.MAILTRAP_PASSWORD);
    try {
      const info = await transporter.sendMail(mailOption);
      console.log("Email sent successfully:", info.response);
    } catch (error) {
      console.error("Error sending email:", error);
    }

    return res.status(200).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (err) {
    return res.status(400).json({
      success: false,
      message: `Error in registering user : ${err}`,
    });
  }
};

const verifyUser = async (req, res) => {
  //get token from url
  //validate
  // find user based on token
  //if not
  // set isVerified field to true
  // remove verification token
  // save
  //return response

  const { token } = req.param;

  if (!token) {
    return res.status(400).json({
      success: false,
      message: "Token not found",
    });
  }

  const user = await User.findOne({ verificationToken: token });

  if (!user) {
    return res.status(400).json({
      success: false,
      message: "Invalid token",
    });
  }

  user.isVerified = true;
  user.verificationToken = undefined;

  await user.save();
};

const login = async (req, res) => {
  //fetch email pass from body
  //validate email and pass
  //search user through email
  //match the password with the pass stored in db
  //create token using jwt
  //store that in cookies
  //send success message

  const { email, password } = req.body;

  console.log(`Email is ${email} and Pasword is ${password}`);
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: "Please provide required fields",
    });
  }

  const user = await User.findOne({ email });

  const isMatch = bcrypt.compare(user.password, password);

  if (!isMatch) {
    return res.status(400).json({
      success: false,
      message: "Password not matched",
    });
  }

  const token = jwt.sign(
    { id: user._id, role: user.role },

    "shhhhh",
    {
      expiresIn: "24h",
    }
  );

  const cookieOptions = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
  };

  res.cookie("token", token, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login Successful",
    token,
    user: {
      id: user.id,
      name: user.name,
      role: user.role,
    },
  });
};

export { registerUser, verifyUser, login };
