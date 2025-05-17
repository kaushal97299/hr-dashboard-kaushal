const express = require("express");
const app = express();
const User = require("../models/Users.js");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
// @route   POST /api/auth/register
app.post("/register", async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            email,
            password: hashedPassword,
        });

        res.status(201).json({
            message: "user registered successfully....."
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during registration" });
    }
});

// POST /api/auth/login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log(user);
        if (!user)
            return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch)
            return res.status(401).json({ message: "Invalid credentials" });

        let token = jwt.sign({ id: user._id, }, process.env.JWT_SECRET, { expiresIn: "2h" })
        console.log("Token47",token)
        let userData = user.toObject();
        delete userData.password;
        res.status(200).json({message: "Login successful",user: userData, token
        });
    } catch (error) {
        res.status(500).json({ message: "Server error during login" });
    }
});

module.exports = app;
