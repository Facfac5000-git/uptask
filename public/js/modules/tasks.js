import axios from "axios";
import Swal from "sweetalert2";

import { updateAdvance } from '../functions/advance';

const tasks = document.querySelector('.listado-pendientes');

if(tasks){
    tasks.addEventListener('click', e => {
        if(e.target.classList.contains('fa-check-circle-o')){
            const task_id = e.target.parentElement.parentElement.dataset.taskId;
            
            const url = location.origin+`/tasks/${task_id}`;
            
            axios.patch(url, { task_id })
                .then(function(response){
                    console.log(response.data.message);
                    if(response.status == 200){
                        e.target.classList.toggle('completo');

                        updateAdvance();
                    }
                })

        }

        if(e.target.classList.contains('fa-trash')){
            const task_li = e.target.parentElement.parentElement;
            const task_id = task_li.dataset.taskId;

            Swal.fire({
                title: '¿Seguro deseas eliminar esta tarea?',
                text: "Una tarea eliminado no se puede recuperar.",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Si, ¡bórrala!',
                cancelButtonText: 'Cancelar'
              }).then((result) => {
                if (result.isConfirmed) {
                    const url = location.origin+`/tasks/delete/${task_id}`;
                    axios.delete(url, { params: {task_id}})
                        .then(function(response){
                            if(response.status == 200){
                                task_li.parentElement.removeChild(task_li);
                                updateAdvance();
                                Swal.fire('¡Listo!', response.data.message, 'success');
                            }
                        });
                }
            });
        }
    })
}

export default tasks;