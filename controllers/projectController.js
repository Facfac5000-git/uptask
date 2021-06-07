const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.projectHome = async (request, response) => {
    const projects = await Projects.findAll({where:{userId: response.locals.user.id}});
    response.render('index', {
        pageName: 'Proyectos', projects
    });
}

exports.projectCreate = async (request, response) => {
    const projects = await Projects.findAll({where:{userId: response.locals.user.id}});
    response.render('project_new', {
        pageName: 'Crear nuevo proyecto', projects
    });
}

exports.projectStore = async (request, response) => {
    //console.log(request.body)
    const { project_name } = request.body;
    const projects = await Projects.findAll({where:{userId: response.locals.user.id}});

    let errors = [];
    
    if(!project_name){
        errors.push({'message': 'Agrega un nombre al proyecto.'});
    }

    if(errors.length > 0){
        response.render('project_new', {
            pageName: 'Crear nuevo proyecto',
            errors, projects
        });
    }else{
        await Projects.create({ name: project_name, userId: response.locals.user.id });
        response.redirect('/');
    }
}

exports.projectByUrl = async (request, response, next) => {
    
    const projectsPromise = Projects.findAll({where:{userId: response.locals.user.id}});

    const projectPromise = Projects.findOne({
        where: {
            url: request.params.url
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise])
    
    const tasks = await Tasks.findAll({ 
        where: {
                projectId: project.id
            },
        //include: [
        //    { model: Projects }
        //]
    });

    if(!project){
        return next();
    }
    response.render('tasks', {
        pageName: 'Tareas de Proyecto',
        project, tasks, projects
    });
}

exports.projectEdit = async (request, response) => {
    
    const projectsPromise = Projects.findAll({where:{userId: response.locals.user.id}});

    const projectPromise = Projects.findOne({
        where: {
            id: request.params.id
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise])

    response.render('project_new', {
        pageName: 'Editar proyecto',
        project, projects
    })
}

exports.projectUpdate = async (request, response) => {
    //console.log(request.body)
    const { project_name } = request.body;
    
    const projectsPromise = Projects.findAll({where:{userId: response.locals.user.id}});

    const projectPromise = Projects.findOne({
        where: {
            id: request.params.id
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise])

    let errors = [];
    
    if(!project_name){
        errors.push({'message': 'El nombre del proyecto no puede quedar vacío.'});
    }

    if(errors.length > 0){
        response.render('project_new', {
            pageName: 'Editar proyecto',
            errors, project, projects
        });
    }else{
        //const url = slug(project_name).toLowerCase();
        await Projects.update({ name: project_name }, {where: {id: request.params.id }});
        response.redirect('/');
    }
}

exports.projectDelete = async (request, response, next) => {
    const { project_id } = request.query;
    const result = await Projects.destroy({where: {id: project_id}})

    if(!result){
        return next();
    }

    response.status(200).send({message: 'Proyecto Eliminado Correctamente'});
}