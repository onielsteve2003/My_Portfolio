const mongoose = require('mongoose')
const User = require('../models/user')

exports.getUserData = (req, res) => {
    User.find({})
        .then(users => {
            res.status(200).json({ users })
        })
        .catch(err => {
            console.log(err)
        })
}

exports.postUserData = (req, res) => {
    const { name, email, message, subject } = req.body
    if (!name || !email || !message || !subject ) {
        return res.status(403).json({ success: 'false', error: 'Enter all Fields' })
    }
    User.findOne({ email }, (err, user) => {
        //check for server errors
        if (err) {
            return res.status(500).json({ success: false, error: "Something went wrong" })
        }

        // verify if email already exist
        if (user) {
            return res.status(401).json({ success: false, error: "Email Already Taken" })
        }
        User.create({
            name,
            email,
            message,
            subject
        })
        .then(user => {
            return res.status(201).json({ success:true, msg: `Thank You ${user.name} for getting in touch` })
        })
        .catch(err => res.status(500).json({ error: err }))
    })
}
