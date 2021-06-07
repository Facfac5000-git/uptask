import Swal from "sweetalert2";

export const updateAdvance = () => {
    const tasks = document.querySelectorAll('li.tarea');
    
    if(tasks.length){
        const completed_tasks = document.querySelectorAll('i.completo')
        const advance = Math.round((completed_tasks.length/tasks.length) * 100);
        const percentage = document.querySelector('#percentage');
        percentage.style.width = advance+'%';

        if(advance === 100){
            Swal.fire('¡Excelente!', '¡Has completado este proyecto!', 'success');
        }
    }
}