// load the auth variables
var configAuth = require('./auth');
// load all the things we need
var LocalStrategy = require('passport-local').Strategy;
// jwt strategy
var JwtStrategy = require('passport-jwt').Strategy;
var ExtractJwt = require('passport-jwt').ExtractJwt;
var opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeader();
opts.secretOrKey = configAuth.jwtAuth.secret;
//opts.issuer = "localhost";
//opts.audience = "yoursite.net";
// bcrypt
var bcrypt = require('bcrypt');
const saltRounds = 10;

// load up the user model
//var User = require('../models/user');
var db = require('../models/index');

module.exports = function(passport) {
    
    // used to serialize the user for the session
    passport.serializeUser(function(user, done) {
        console.log('serialize - user');
        console.log(user);        
        done(null, user);
    });

    // used to deserialize the user
    passport.deserializeUser(function(user, done) {
        console.log('deserilize - user');
        console.log(user);
        db.User.findOne({ where: { 'id': user.id } })
            .then(user => {
                done(null, user);
            });
    });

    // local login strategy
    passport.use(
        'local-login',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                db.User.findOne({ where: { 'username': username } })
                    .then(user => {
                        if (!user) {
                            return done(null, false, { message: 'The username entered is incorrect.' });
                        }
                        if (!bcrypt.compareSync(password, user.password)) {
                            return done(null, false, { message: 'The password entered is incorrect.' });
                        }
                        return done(null, user);
                    });
            }
        ));

    // local register strategy
    passport.use(
        'local-signup',
        new LocalStrategy({
                // by default, local strategy uses username and password, we will override with email
                usernameField: 'username',
                passwordField: 'password',
                passReqToCallback: true // allows us to pass back the entire request to the callback
            },
            function(req, username, password, done) {
                console.log('req.body');
                console.log(req.body);

                db.User.findOne({ where: { 'username': username } })
                    .then(user => {
                        if (user) {
                            return done(null, false, { message: 'That username is already taken.' });                            
                        }
                        db.User.create({
                            username: username,
                            password: bcrypt.hashSync(password, saltRounds),                            
                            firstname: req.body.user.firstname,
                            lastname: req.body.user.lastname,
                            activity: req.body.user.activity,
                            comment: req.body.user.comment,
                            email: req.body.user.email
                        }).then(user => {
                            return done(null, user);
                        });
                    });
            })
    );

    // jwt strategy
    passport.use('jwt',
        new JwtStrategy(opts, function(jwt_payload, done) {
            db.User.findOne({ where: { 'id': jwt_payload.id } })
                .then(user => {
                    if (!user) {
                        return done(null, false, req.flash('loginMessage', 'Incorrect username'));
                    }
                    return done(null, user);
                });
        }));

};