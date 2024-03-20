const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const uuid = require('uuid');
require('dotenv').config();

const initSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUserWithOTP = await userModel.initSignup(username, password, email);

    const { otp } = newUserWithOTP;

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.SECRET_KEY
      }
    });

    const mailOptions = {
      from: `"Authentication Notifier" <${process.env.AUTH_EMAIL}>`,
      to: email,
      subject: 'OTP for Registration',
      text: `Your OTP for registration is: ${otp}`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'User registration initiated successfully' });
  } catch (error) {
    console.error('Error initiating user registration:', error);
    res.status(500).json({ error: 'Failed to initiate user registration' });
  }
};

const conSignup = async (req, res) => {
  try {
    const { email, otp, username, password } = req.body;

    const result = await userModel.conSignup(email, otp, username, password);

    res.status(200).json(result);
  } catch (error) {
    console.error('Error verifying OTP and signup:', error);
    res.status(500).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await userModel.loginUser(email);
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    if (password !== user.password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.AUTH_EMAIL,
        pass: process.env.SECRET_KEY
      }
    });

    const mailOptions = {
      from: `"Authentication Notifier" <${process.env.AUTH_EMAIL}>`,
      to: user.email,
      subject: 'Login Notification',
      text: 'You have successfully logged in.'
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
      } else {
        console.log('Email sent:', info.response);
      }
    });

    const token = uuid.v4();

    res.status(200).json({ message: 'Login successful', user: { ...user, token } });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};



const getUsers = async (req, res) => {
  try {
    const users = await userModel.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createUser = async (req, res) => {
  const { name, email } = req.body;
  try {
    const newUser = await userModel.insertUser(name, email);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  try {
    const updatedUser = await userModel.updateUser(id, name, email);
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    await userModel.deleteUser(id);
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await userModel.getUserById(id);
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getSignedUsers = async (req, res) => {
  try {
    const users = await userModel.getSignedUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser, getUserById, initSignup, conSignup, getSignedUsers, loginUser};
