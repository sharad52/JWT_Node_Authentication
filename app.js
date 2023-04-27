require("dotenv").config();
require("./config/database").connect();
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const auth = require("./middleware/auth");

const User = require("./model/user");

const app = express();

app.use(express.json());
//Logic goes here

// Register
app.post("/register", async (req, res) => {
    // our register logic goes here
    console.log(req.body)
    try {
        const { first_name, last_name, email, password } = req.body;

        //validate user input 
        if (!(email && password && first_name && last_name )) {
            res.status(400).send("All input is required");
        }

        // check if user already exists
        // validate if user exist in our database
        const oldUser = await User.findOne({ email });

        if (oldUser) {
            return res.status(409).send("User Already Exist. Please Login");
        }

        // Encrypt user password
        encryptedPassword = await bcrypt.hash(password, 10);

        // Create user in our database 
        const user = await User.create({
            first_name, 
            last_name,
            email: email.toLowerCase(),
            password: encryptedPassword,
        });

        // create token 
        const token = jwt.sign(
            { user_id: user._id, email },
            process.env.TOKEN_KEY,
            {
                expiresIn: "2h"
            }
        );
        //save user token
        user.token = token;

        // return new user
        res.status(201).json(user);
    } catch (err) {
        console.log(err);
    }
    //register logic ends here.
});

// Login
app.post("/login", async (req, res) => {
    // our login logic goes here
    try {
        const {email, password} = req.body;

        // validate user input 
        if (!(email && password)) {
            res.status(400).send("All input is required");
        }
        // validate if user exist in our db.
        const user = await User.findOne({ email });
        if (user && (await bcrypt.compare(password, user.password))) {
            // create token 
            const token = jwt.sign(
                { user_id: user._id, email},
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token 
            user.token = token;

            // user 
            return res.status(200).json(user);
        }
        res.status(400).send("Invalid Credentials");

    } catch (err) {
        console.log(err);
    }
})

app.post("/welcome", auth, (req, res) => {
    res.status(200).send("Welcome 🙌 ");
});

module.exports = app;

