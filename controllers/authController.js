const passport = require('passport');

const Users = require('../models/Users');

const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs');
const sendEmail = require('../handlers/email');

exports.userAuthenticate = passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/account-login',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatiorios'
});

exports.userIsAuthenticated = (request, response, next) => {
    if(request.isAuthenticated()){
        return next();
    }
    return response.redirect('/account-login')
}

exports.userLogout = (request, response) => {
    request.session.destroy( () => {
        response.redirect('/account-login')
    })
}

exports.sendToken = async (request, response) => {
    const { email } = request.body;
    const user = await Users.findOne({where: {email}})

    if(!user){
        request.flash('error', 'Ese email no tiene cuenta en UpTask.')
        response.redirect('/account-forgot-password');
        return;
    };

    const token = crypto.randomBytes(20).toString('hex'); 
    user.token = crypto.randomBytes(20).toString('hex');
    user.expire_token = Date.now() + 3600000;
    await user.save();
    
    const resetUrl = `http://${request.headers.host}/account-forgot-password/${user.token}`;

    await sendEmail.send({
        user, subject: 'Password Reset', resetUrl, file: 'reset_password'
    });

    request.flash('correcto', 'Se ha enviado un mail de reestablecimiento.');
    console.log(response.locals.flash_messages);
    response.redirect('/account-login');
}

exports.validateToken = async (request, response) => {
    const user = await Users.findOne({where: {token: request.params.token}});

    if(!user){
        request.flash('error', 'No válido.');
        response.redirect('/account-forgot-password')
    }

    response.render('account_reset_password', {
        pageName: 'Reestablecer Contraseña'
    });
}

exports.userResetPassword = async (request, response) => {
    const user = await Users.findOne({where: {token: request.params.token}});

    if(!user){
        request.flash('error', 'No válido.');
        response.redirect('/account-forgot-password')
    }

    if(Date.now() > user.expire_token){
        user.token = null;
        user.expire_token = null;
        await user.save()
        request.flash('error', 'Tu token ha expirado.');
        response.redirect('/account-forgot-password')
    }

    user.password = bcrypt.hashSync(request.body.password, bcrypt.genSaltSync(10));
    user.token = null;
    user.expire_token = null;
    user.save();

    request.flash('correcto', 'Contraseña reestablecida exitosamente.');
    response.redirect('/account-login');
}