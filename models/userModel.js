const pool = require('../db');

const getAllUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM user_table');
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const insertUser = async (name, email) => {
  try {
    const result = await pool.query('INSERT INTO user_table (name, email) VALUES ($1, $2) RETURNING *', [name, email]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const updateUser = async (id, name, email) => {
  try {
    const result = await pool.query('UPDATE user_table SET name = $1, email = $2 WHERE id = $3 RETURNING *', [name, email, id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const deleteUser = async (id) => {
  try {
    await pool.query('DELETE FROM user_table WHERE id = $1', [id]);
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const result = await pool.query('SELECT * FROM user_table WHERE id = $1', [id]);
    return result.rows[0];
  } catch (error) {
    throw error;
  }
};

const initSignup = async (username, password, email) => {
  try {
    const otp = Math.floor(100000 + Math.random() * 900000);
    
    await pool.query('INSERT INTO otp_table (email, username, password, otp, status) VALUES ($1, $2, $3, $4, $5)', [email, username, password, otp, 1]);    
    return { email, username, otp };
  } catch (error) {
    throw error;
  }
};

const conSignup = async (email, otp, username, password) => {
  try {
    const otpResult = await pool.query('SELECT * FROM otp_table WHERE email = $1 AND otp = $2 AND status = 1', [email, otp]);
    
    if (otpResult.rows.length === 0) {
      throw new Error('Invalid OTP or email');
    }

    await pool.query('UPDATE otp_table SET status = 2 WHERE email = $1', [email]);

    await pool.query('INSERT INTO new_signup (username, email, password) VALUES ($1, $2, $3)', [username, email, password]);

    return { message: 'OTP verification successful. User registered successfully.' };
  } catch (error) {
    throw error;
  }
};


const getSignedUsers = async () => {
  try {
    const result = await pool.query('SELECT * FROM new_signup');
    return result.rows;
  } catch (error) {
    throw error;
  }
};

const loginUser = async (email) => {
  try {
      const result = await pool.query('SELECT * FROM new_signup WHERE email = $1', [email]);
      return result.rows[0];
  } catch (error) {
      throw error;
  }
};

module.exports = { getAllUsers, insertUser, updateUser, deleteUser, getUserById, initSignup, conSignup, getSignedUsers, loginUser };
