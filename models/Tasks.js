const Sequelize = require('sequelize');

const db = require('../config/db');

const Projects = require('./Projects');

const Tasks = db.define('tasks', {
    id:{
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name: Sequelize.STRING(100),
    status: Sequelize.INTEGER(1)
});
Tasks.belongsTo(Projects);

module.exports = Tasks;