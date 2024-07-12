const user = require('../models/user');
const { setUser } = require('../services/auth');
const bcrypt = require('bcrypt');
const saltRounds = 10;

const createNewUser = async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const entry = await user.create({
            name,
            email,
            password: hashedPassword
        });
        const token = setUser(entry);
        res.cookie("uid", token);

        return res.status(201).json({success: true});
    } catch (error) {
        return res.status(400).json({ success: false, message: error.message });
    }
}

const handleUserLogin = async (req, res) => {
    const { email, password } = req.body
    const entry = await user.findOne({ email });

    if (!entry) return res.json({ success : false, message: "email or password is incorrect"});

    await bcrypt.compare(password, entry.password, function(err, result) {
        if (err || !result) {
            return res.json({success: false, message: err.message ?? "password did not match"});
        }
    });

    const token = setUser(entry)
    res.cookie("uid", token)

    return res.json({success: true});
}

module.exports = {
    createNewUser,
    handleUserLogin
}