const Sequelize = require('sequelize');

const db = require('../config/db');

const bcrypt = require('bcrypt-nodejs');

const Projects = require('./Projects');

const Users = db.define('users', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    email: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            isEmail:{
                msg: 'Agrega un correo válido.'
            },
            notEmpty: {
                msg: 'El email no puede ir vacío.'
            }
        },
        unique: {
            args: true,
            msg: 'Usuario ya registrado.'
        }
    },
    password: {
        type: Sequelize.STRING(60),
        allowNull: false,
        validate: {
            notEmpty: {
                msg: 'El password no puede ir vacío.'
            }
        }
    },
    active: {
        type: Sequelize.INTEGER,
        defaultValue: 0
    },
    token: Sequelize.STRING,
    expire_token: Sequelize.DATE,
}, {
    hooks: {
        beforeCreate(user) {
            user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10));
        }
    }
});
Users.prototype.passwordVerify = function(password){
    return bcrypt.compareSync(password, this.password);
}

Users.hasMany(Projects);

module.exports = Users;