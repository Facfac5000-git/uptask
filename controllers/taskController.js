const Projects = require('../models/Projects');
const Tasks = require('../models/Tasks');

exports.taskAdd = async (request, response, next) => {

    const { project_id } = request.query;

    const { task_name } = request.body;
    const task_status = 0;

    const projectsPromise = Projects.findAll({where:{userId: response.locals.user.id}});

    const projectPromise = Projects.findOne({
        where: {
            id: request.params.id
        }
    });

    const [projects, project] = await Promise.all([projectsPromise, projectPromise])

    let errors = [];
    
    if(!task_name){
        errors.push({'message': 'Agrega un nombre a la tarea.'});
    }

    if(errors.length > 0){
        response.render('project_new', {
            pageName: 'Crear nuevo proyecto',
            errors, projects, project
        });
    }else{
        //const url = slug(project_name).toLowerCase();
        await Tasks.create({ name: task_name, status: task_status, projectId: project.id });

        if(!project){
            return next();
        }
        response.redirect(`/projects/${project.url}`);
    }
}

exports.taskUpdateStatus = async (request, response) => {
    const task_id = request.params.id;
    const task = await Tasks.findOne({
        where: {
            id: task_id
        }
    })
    
    let status = 0;
    if(task.status === status){
        status = 1;
    }

    task.status = status;

    const result = await task.save();

    if(!result) return next();

    response.status(200).send({message: 'Estado de tarea actualizado'});
}

exports.taskDelete = async (request, response, next) => {
    const { task_id } = request.query;
    const result = await Tasks.destroy({where: {id: task_id}})

    if(!result){
        return next();
    }

    response.status(200).send({message: 'Tarea Eliminada Correctamente'});
}