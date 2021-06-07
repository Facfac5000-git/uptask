const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

const Users = require('../models/Users');

passport.use(
    new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password'
    },
    async (email, password, done) => {
        try{
            const user = await Users.findOne({
                where: {
                    email, active: 1
                }
            });

            if(!user.passwordVerify(password)){
                return done(null, false, {
                    message: 'Password incorrecto.'
                })
            }
            return done(null, user, {
                message: 'Login exitoso.'
            })

        } catch (error){
            return done(null, false, {
                message: 'Ese mail no posee cuenta en UpTask.'
            })
        }
    }
    )
);

passport.serializeUser((user, callback) => {
    callback(null, user);
})

passport.deserializeUser((user, callback) => {
    callback(null, user);
})

module.exports = passport;