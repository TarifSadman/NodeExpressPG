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

const signupUser = async (username, password, email) => {
  try {
    const result = await pool.query('INSERT INTO new_signup (username, password, email) VALUES ($1, $2, $3) RETURNING *', [username, password, email]);
    return result.rows[0];
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

module.exports = { getAllUsers, insertUser, updateUser, deleteUser, getUserById, signupUser, getSignedUsers, loginUser };
