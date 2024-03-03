import { signinUser } from '../models/authModel';

async function signIn(req, res) {
    const { email, password } = req.body;

    try {
        const user = await signinUser(email, password);

        if (user) {
            res.status(200).json({ message: 'Login successful', user });
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        console.error('Error logging in:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export default {
    signIn
};
