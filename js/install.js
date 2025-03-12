// install.js

let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault();
  deferredPrompt = e;

  if (!window.matchMedia('(display-mode: standalone)').matches && !window.navigator.standalone) {
    document.getElementById('installButton').style.display = 'block';
  }
});

document.getElementById('installButton').addEventListener('click', () => {
  if (deferredPrompt) {
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then((result) => {
      if (result.outcome === 'accepted') {
        console.log('El usuario aceptó la instalación.');
      } else {
        console.log('El usuario rechazó la instalación.');
      }
      deferredPrompt = null;
      document.getElementById('installButton').style.display = 'none';
    });
  }
});

function checkIfInstalled() {
  if (window.matchMedia('(display-mode: standalone)').matches || window.navigator.standalone === true) {
    document.getElementById('installButton').style.display = 'none';
  }
}

window.addEventListener('load', checkIfInstalled);

window.addEventListener('appinstalled', () => {
  console.log('Planit ha sido instalada.');
  document.getElementById('installButton').style.display = 'none';
});