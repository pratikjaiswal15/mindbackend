const express = require('express');
const router = express.Router();
const Manager = require('../models/manager-model')

const jwt = require('jsonwebtoken');
const accessTokenSecret = 'gygysbdkowufrdq31567189';

const refreshTokenSecret = 'yourrefreshtokensecrethere';
const refreshTokens = [];

const authToken = require('../auth')


// register manager with hashed password
router.post('/managers', (req, res, next) => {

    console.log(req.body)
    let data = new Manager({
        email: req.body.email,
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        password: req.body.password,
        address: req.body.address,
        dob: req.body.dob,
        company: req.body.company
    })
    console.log(data)


    data.save(function (err) {
        if (err) next(err);
        else {
            res.send(data)
        }
    })
})


// login user. On successful login send auth token and refresh token
router.post('/login', (req, res, next) => {
    console.log(req.body)

    let data = {
        email: req.body.email,
        password: req.body.password
    }

    // fetch the user and test password verification
    Manager.findOne({ email: data.email }, function (err, user) {
        if (err) next(err);
        else {

            if (user) {
                // check password
                user.comparePassword(data.password, function (err, isMatch) {
                    if (err) next(err);
                    console.log(isMatch); // -&gt; Password123: true
                    console.log(user)
                    if (user) {
                        // generate an access token
                        const accessToken = jwt.sign({ email: user.email, first_name: user.first_name }, accessTokenSecret, { expiresIn: '20m' });
                        const refreshToken = jwt.sign({ email: user.email, first_name: user.first_name }, refreshTokenSecret);

                        refreshTokens.push(refreshToken);

                        res.json({
                            accessToken,
                            refreshToken
                        });
                    } else {
                        res.send('Username or password incorrect');
                    }
                });
            }
            else {
                res.send(404, { error: "User not found" });
            }

        }


    });
})

// refresh token
router.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ email: user.email, first_name: user.first_name }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});


// Logout user
router.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.send("Logout successful");
});

// list all managers with pagination
router.get('/managers', (req, res, next) => {

    Manager.find().then(data => {
        res.send(data)
    }).catch(next)
})

// list one user
router.get('/managers/:id', authToken, (req, res, next) => {

    Manager.findById(req.params.id).then(data => {
        if (data) {
            res.send(data)
        }
        else {
            res.send("no manager found")
        }
    }).catch(next)
})


// Update user with token
router.patch('/managers/:id', authToken, (req, res, next) => {

    var opts = { runValidators: true };

    Manager.findByIdAndUpdate({ _id: req.params.id }, req.body, opts).then(() => {
        Manager.findOne({ _id: req.params.id }).then(data => {
            res.send(data)
        }).catch(next)
    }).catch(next)

})

// delete manager
router.delete('/managers/:id', authToken, (req, res, next) => {

    Manager.findByIdAndRemove({ _id: req.params.id }).then(data => {
        if (data) {
            res.send("successfully deleted")
        }
        else {
            res.send("No user found")
        }
    }).catch(next)
})



module.exports = router