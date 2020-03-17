const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        path: '/login',
        pageTitle: 'Login'
    });
}

exports.getSignup = (req, res, next) => {
    res.render('auth/signup', {
        path: '/signup',
        pageTitle: 'Signup',
        isAuthenticated: false
    });
}

exports.postLogin = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    // Checking email
    User.findOne({
            where: { email: email }
        })
        .then(user => {
            if (!user) {
                return res.redirect('/login');
            }
            // checking password
            bcrypt.compare(password, user.password)
                .then(doMatch => {
                    // if Matches, save a session and login
                    if (doMatch) {
                        req.session.isLoggedIn = true;
                        req.session.user = user;
                        return req.session.save((err) => {
                            console.log(err);
                            res.redirect('/');
                        });
                    }
                    // if password doesn't match, redirect to login page
                    res.redirect('/login');
                })
                .catch(err => {
                    console.log(err)
                    res.redirect('/login');
                });
        })
}

exports.postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        console.log(err);
        res.redirect('/');
    });
}

exports.PostSignup = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    const confirmPassword = req.body.confirmPassword;

    // Check if the entered email already exists in DB
    User.findOne({
            where: { email: email }
        })
        .then(userDoc => {
            if (userDoc) {
                return res.redirect('/signup');
            }
            // This is Asynchronise, so it returns a middleware
            return bcrypt.hash(password, 12)
                .then(hashedPassword => {
                    const user = new User({
                        email: email,
                        password: hashedPassword
                    });
                    return user.save();
                })
                .then(result => {
                    // creating the cart for registered user
                    User.findOne({ where: { id: result.id } })
                        .then(user => {
                            return user.createCart();
                        })
                        .then(result => {
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                });
        })
        .catch(err => console.log(err));
}