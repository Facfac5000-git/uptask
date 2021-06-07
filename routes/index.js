const express = require('express');
const router = express.Router();

//Express Validator import
const { body } = require('express-validator/check');

//Controller's import
const projectController = require('../controllers/projectController')
const taskController = require('../controllers/taskController')
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

module.exports = function () {
    router.get('/',
        authController.userIsAuthenticated, 
        projectController.projectHome);
    router.get('/new-project', 
        authController.userIsAuthenticated,
        projectController.projectCreate);
    router.post('/new-project', 
        authController.userIsAuthenticated,
        body('project_name').not().isEmpty().trim().escape(), 
        projectController.projectStore);

    router.get('/projects/:url', 
        authController.userIsAuthenticated,
        projectController.projectByUrl);
    router.get('/projects/edit/:id', 
        authController.userIsAuthenticated,
        projectController.projectEdit);
    router.post('/projects/edit/:id', 
        authController.userIsAuthenticated,
        body('project_name').not().isEmpty().trim().escape(),
        projectController.projectUpdate);

    router.delete('/projects/delete/:id', 
        authController.userIsAuthenticated,
        projectController.projectDelete);

    router.post('/projects/:id/tasks', 
        authController.userIsAuthenticated,
        taskController.taskAdd);
    router.patch('/tasks/:id',
        authController.userIsAuthenticated, 
        taskController.taskUpdateStatus);
    router.delete('/tasks/delete/:id', 
        authController.userIsAuthenticated, 
        taskController.taskDelete);

    router.get('/account-create', userController.userAccountForm);
    router.post('/account-create', userController.userAccountCreate);

    router.get('/account-confirm/:email', userController.userAccountConfirm);

    router.get('/account-login', userController.userAccountLogin);
    router.post('/account-login', authController.userAuthenticate);

    router.get('/account-logout', authController.userLogout);

    router.get('/account-forgot-password', userController.userForgotPassword);
    router.post('/account-forgot-password', authController.sendToken);
    router.get('/account-forgot-password/:token', authController.validateToken);
    router.post('/account-forgot-password/:token', authController.userResetPassword)

    return router;
}