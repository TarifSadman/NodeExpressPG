const nodemailer = require('nodemailer');
const userModel = require('../models/userModel');
const uuid = require('uuid');
require('dotenv').config();

const signupUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const newUser = await userModel.signupUser(username, password, email);

    res.status(201).json({ message: 'User created successfully', user: newUser });
  } catch (error) {
    console.error('Error creating user:', error);
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

module.exports = { getUsers, createUser, updateUser, deleteUser, getUserById, signupUser, getSignedUsers, loginUser};
