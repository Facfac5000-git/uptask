import Swal from 'sweetalert2';
import axios from 'axios';

const btnDelete = document.querySelector('#delete-project');

if(btnDelete){
    btnDelete.addEventListener('click', e => {
        const project_id = e.target.dataset.projectId;
        Swal.fire({
            title: '¿Seguro deseas eliminar este proyecto?',
            text: "Un proyecto eliminado no se puede recuperar.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, ¡bórralo!',
            cancelButtonText: 'Cancelar'
          }).then((result) => {
            if (result.isConfirmed) {
                
                const url = `${location.origin}/projects/delete/${project_id}`;
                axios.delete(url, {params: {project_id}})
                    .then(function(response){
                        console.log(response);
                        Swal.fire(
                            '¡Listo!',
                            response.data.message,
                            'success'
                        );
                        setTimeout( () => {
                            window.location.href = '/'
                        }, 3000);
                    })
                    .catch( () => {
                        Swal.fire({
                            type: 'error',
                            title: 'Hubo un error',
                            text: 'No se ha podido eliminar el proyecto.'
                        });
                    });
            }
          })
    })
}

export default btnDelete;