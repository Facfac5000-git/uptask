const Sequelize = require('sequelize');
const slug = require('slug');
const short_id = require('shortid');

const db = require('../config/db');

const Projects = db.define('projects', {
    id : {
        type: Sequelize.INTEGER(11),
        primaryKey: true,
        autoIncrement: true
    },
    name : Sequelize.STRING(100),
    url: Sequelize.STRING(100)
},
    {
        hooks: {
            beforeCreate(project) {
                const url = slug(project.name).toLowerCase();
                project.url = `${url}-${short_id.generate()}`;
            }
        }
    }
);
//Projects.hasMany(Tasks);

module.exports = Projects;