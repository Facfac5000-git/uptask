const Users = require('../models/Users');
const Projects = require('../models/Projects');

const sendEmail = require('../handlers/email');
const { request, response } = require('express');

exports.userAccountForm = (request, response) => {
    response.render('account_new', {
        pageName: 'Crear cuenta en Uptask',
    });
}

exports.userAccountLogin = (request, response) => {
    const {error} = request.flash();
    response.render('account_login', {
        pageName: 'Inicia Sesión en Uptask', error
    });
}

exports.userAccountCreate = async (request, response) => {
    const { email, password } = request.body;

    try{
        await Users.create({ email, password })

        const confirmUrl = `http://${request.headers.host}/account-confirm/${email}`;
        const user = { email };
        await sendEmail.send({
            user, 
            subject: 'Confirmación de nueva cuenta en Uptask', 
            confirmUrl, 
            file: 'account-confirm'
        });

        request.flash('correcto', 'Se ha enviado un correo electrónico de confirmación.');
        response.redirect('/account-login');
    } catch (error) {
        request.flash('error', error.errors.map(error => error.message));
        response.render('account_new', {
            pageName: 'Crear cuenta en Uptask',
            flash_messages: request.flash(),
            email, password,
        });
    }
}

exports.userForgotPassword = (request, response) => {
    response.render('account_forgot_password', {
        pageName: 'Reestablecer tu Contraseña',
    });
}

exports.userAccountConfirm = async (request, response) => {
    const user = await Users.findOne({where: {email: request.params.email}});

    if(!user){
        request.flash('error', 'No válido');
        response.redirect('/account-create');
    }
    user.active = 1;
    await user.save();

    request.flash('correcto', 'Cuenta confirmada.');
    response.redirect('/account-login');
};