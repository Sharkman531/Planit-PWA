
if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registrado con éxito:', registration);

        registration.onupdatefound = () => {
            const newWorker = registration.installing;
            newWorker.onstatechange = () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        console.log('Nueva versión disponible. Refresque la página para actualizar.');
                    } else {
                        console.log('Contenido disponible sin conexión para la primera vez.');
                    }
                }
            };
        };

        setInterval(() => {
            registration.update();
        }, 1000 * 60 * 60); 
    }).catch(error => {
        console.error('Error al registrar el Service Worker:', error);
    });
}


let refreshing;

function showUpdateNotification() {
    if (refreshing) return;
    refreshing = true;
    alert('Hay una nueva versión disponible. La página se actualizará ahora.');
    window.location.reload();
}

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/sw.js').then(registration => {
        console.log('Service Worker registrado con éxito:', registration);

        registration.onupdatefound = () => {
            const newWorker = registration.installing;
            newWorker.onstatechange = () => {
                if (newWorker.state === 'installed') {
                    if (navigator.serviceWorker.controller) {
                        showUpdateNotification();
                    }
                }
            };
        };
    }).catch(error => {
        console.error('Error al registrar el Service Worker:', error); 
    });
}


if('Notification' in window) {
    Notification.requestPermission().then((permission)=> {        
     
       if(permission === 'granted'){
             console.log('Permiso de notificaciones concedido.')
       }else{
        console.log('Permiso de notificaciones denegado.')
       }
    })
}


if (navigator.share) {
    document.getElementById("shareButton").addEventListener("click", () => {

        const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
        
        let taskListText = tasks.length > 0 ? 'Lista de tareas:\n' : 'No hay tareas en la lista.';
        tasks.forEach((task, index) => {
            const status = task.completed ? '✔️' : '❌';
            taskListText += `${index + 1}. ${task.text} - ${status}\n`;
        });

        navigator.share({
            title: 'Mi lista de tareas en Planit',
            text: taskListText,
            // url: 'https://mi-aplicacion.com' 
        })
        .then(() => console.log('Contenido compartido exitosamente'))
        .catch((error) => console.error('Error al compartir: ', error));
    });
} else {
    console.log('API de compartir no soportada en este navegador');
}