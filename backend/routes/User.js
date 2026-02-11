const express = require("express")
const bcrypt = require("bcrypt")
const UsersModel = require("../models/user")
const routes = express.Router()

routes.post("/user/signup", (req, res) => {
    const userInfo = req.body;

    // validate if all info is filled out
    if (!userInfo.username || !userInfo.password) {
        return res.status(400).send({
            status: false,
            message: "All fields are required.",
        })
    }

    // check if user already exists
    UsersModel.findOne({username: userInfo.username}).then((existingUser) => {
        if (existingUser) {
            return res.status(400).send({
                status: false,
                message: "This username is taken!"
            })
        }

        // hashing the password
        bcrypt.hash(userInfo.password, 10).then((hashedPassword) => {
            userInfo.password = hashedPassword;

            const newUser = new UsersModel(userInfo);
            // save user to the database
            newUser.save().then((user) => {
                res.status(201).send({
                    status: true,
                    message: "User created successfully",
                    user: user
                })
            }).catch((err) => {
                res.status(500).send({
                    status: false,
                    message: "Error saving user",
                    error: err.message
                })
            })
        }).catch((err) => {
            res.status(500).send({
                status: false,
                message: "Error hashing password",
                error: err.message
            })
        })
    }).catch((err) => {
        res.status(500).send({
            status: false,
            message: "Error checking if username is taken",
            error: err.message
        })
    })
})

routes.post("/user/login", (req, res) => {
    const loginInfo = req.body;

    // validate if all info is filled out
    if (!loginInfo.username || !loginInfo.password) {
        return res.status(400).send({
            status: false,
            message: "All fields are required"
        })
    }

    // check if user exists
    UsersModel.findOne({username: loginInfo.username}).then((user) => {
        if (!user) {
            return res.status(404).send({
                status: false,
                message: "No user found with that username"
            })
        }

        // check if password matches
        bcrypt.compare(loginInfo.password, user.password,).then((isMatch) => {
            if (isMatch) {
                res.status(200).send({
                    status: true,
                    message: "User logged in successfully",
                    user: {
                        username: user.username,
                    }
                })
            } else {
                res.status(400).send({
                    status: false,
                    message: "Wrong password!",
                })
            }
        }).catch((err) => {
            res.status(500).send({
                status: false,
                message: "Error verifying password",
                error: err.message
            })
        })
    }).catch((err) => {
        res.status(500).send({
            status: false,
            message: "Error finding user",
            error: err.message
        })
    })
})

// user logout
routes.post("/user/logout", (req, res) => {
    // TODO
});

module.exports = routes