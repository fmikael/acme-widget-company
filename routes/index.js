var express = require('express');
var router = express.Router();
var passport = require('passport');
var jwt = require('jsonwebtoken');
var db = require('../models/index');
var bcrypt = require('bcrypt');
var configAuth = require('../config/auth');
const saltRounds = 10;

router.get('/', function(req, res, next) {
    res.render('index', { title: 'Acme Widget Company' });
});

router.get('/getUser', isLoggedIn, function(req, res, next) {
    db.User.find({
            where: {
                id: req.user.id
            }
        })
        .then(user => {
            if (user) {
                res.status(200).json({ "user": user });
            }
        });
});

router.get('/getUsers', isLoggedIn, function(req, res, next) {
    db.User.findAll({
            where: {
                id: { $ne: req.user.id }
            }
        })
        .then(users => {
            if (users) {
                res.status(200).json({ "users": users });
            }
        });
});

router.get('/login', function(req, res, next) {
    res.render('index', { message: req.flash('loginMessage'), title: 'Acme Widget Company' });
});

router.post('/login', function(req, res, next) {
    passport.authenticate('local-login', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            res.status(401).json({ message: info.message });
        } else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                var payload = { id: user.id };
                var token = jwt.sign(payload, configAuth.jwtAuth.secret);
                res.status(200).json({ "token": token });
            });
        }
    })(req, res, next);
});

router.post('/signup', function(req, res, next) {
    req.body.username = req.body.user.username;
    req.body.password = req.body.user.password;
    passport.authenticate('local-signup', function(err, user, info) {
        if (err) { return next(err); }
        if (!user) {
            res.status(401).json({ message: info.message });
        } else {
            req.logIn(user, function(err) {
                if (err) { return next(err); }
                var payload = { id: user.id };
                var token = jwt.sign(payload, configAuth.jwtAuth.secret);
                res.status(200).json({ "token": token });
            });
        }
    })(req, res, next);
});

router.get("/secret", passport.authenticate('jwt', { session: false }), function(req, res) {
    res.json("Success! You can not see this without a token");
});

router.get('/logout', function(req, res) {
    req.logout();
    req.session.destroy(function(err) {
        res.clearCookie("jwt-token");
        res.redirect('/'); //Inside a callback… bulletproof!
    });
});

function isLoggedIn(req, res, next) {
    console.log('req.isAuthenticated()');
    console.log(req.isAuthenticated());
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;