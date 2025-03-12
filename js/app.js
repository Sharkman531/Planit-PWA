
const taskForm = document.getElementById('task-form');
const taskList = document.getElementById('task-list');
const newTaskInput = document.getElementById('new-task');
const totalTasksEl = document.getElementById('total-tasks');
const completedTasksEl = document.getElementById('completed-tasks');
const pendingTasksEl = document.getElementById('pending-tasks');

let totalTasks = 0;
let completedTasks = 0;

function updateStats() {
  totalTasksEl.innerHTML = `Tareas totales: <span class="number">${totalTasks}</span>`;
  completedTasksEl.innerHTML = `Tareas completadas: <span class="number">${completedTasks}</span>`;
  pendingTasksEl.innerHTML = `Tareas pendientes: <span class="number">${totalTasks - completedTasks}</span>`;
}

function loadTasks() {
  const savedTasks = JSON.parse(localStorage.getItem('tasks')) || [];

  totalTasks = savedTasks.length;
  completedTasks = savedTasks.filter(task => task.completed).length;

  savedTasks.forEach(task => {
    addTask(task.text, task.completed, task.taskNumber);
  });

  updateStats();
}

taskForm.addEventListener('submit', function (e) {
  e.preventDefault();

  const taskText = newTaskInput.value.trim();

  if (taskText !== '') {
    addTask(taskText);
    newTaskInput.value = '';
    totalTasks++;
    updateStats();
    saveTasks();
  }
});

function addTask(taskText, isCompleted = false, taskNumber = null) {
  const li = document.createElement('li');
  const taskNumElement = document.createElement('span');
  taskNumElement.className = 'task-number';
  const taskTextElement = document.createElement('span');
  taskTextElement.className = 'task-text';
  taskTextElement.textContent = taskText;

  taskNumElement.textContent = taskNumber || (taskList.children.length + 1);

  li.appendChild(taskNumElement);
  li.appendChild(taskTextElement);

  const buttonContainer = document.createElement('div');
  buttonContainer.innerHTML = `
    <button class="complete-btn">✔</button>
    <button class="edit-btn">✎</button>
    <button class="delete-btn">✖</button>
  `;
  li.appendChild(buttonContainer);

  taskList.appendChild(li);

  if (isCompleted) {
    li.classList.add('completed');
  }

  li.querySelector('.complete-btn').addEventListener('click', function () {
    li.classList.toggle('completed');

    if (li.classList.contains('completed')) {
      completedTasks++;
      console.log("se completo una tarea");
    } else {
      completedTasks--;
      sendNotification();
    }

    updateStats();
    saveTasks();
  });

  li.querySelector('.delete-btn').addEventListener('click', function () {
    if (li.classList.contains('completed')) {
      completedTasks--;
    }
    totalTasks--;
    li.remove();
    updateStats();
    saveTasks();
    updateTaskNumbers();
  });

  li.querySelector('.edit-btn').addEventListener('click', function () {
    const currentText = taskTextElement.textContent;
    const inputField = document.createElement('input');
    inputField.type = 'text';
    inputField.value = currentText;
    inputField.className = 'edit-input';

    li.replaceChild(inputField, taskTextElement);

    inputField.addEventListener('blur', function () {
      const newTaskText = inputField.value;
      taskTextElement.textContent = newTaskText;
      li.replaceChild(taskTextElement, inputField);
      saveTasks();
    });

    inputField.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
        const newTaskText = inputField.value;
        taskTextElement.textContent = newTaskText;
        li.replaceChild(taskTextElement, inputField);
        saveTasks();
      }
    });

    inputField.focus();
  });
}

function updateTaskNumbers() {
  const tasks = taskList.querySelectorAll('li');
  tasks.forEach((task, index) => {
    const taskNumber = task.querySelector('.task-number');
    taskNumber.textContent = `${index + 1} `;
  });
}

function saveTasks() {
  const tasks = [];
  const taskElements = taskList.querySelectorAll('li');

  taskElements.forEach(task => {
    const taskText = task.querySelector('.task-text').textContent;
    const isCompleted = task.classList.contains('completed');
    tasks.push({ text: taskText, completed: isCompleted });
  });

  localStorage.setItem('tasks', JSON.stringify(tasks));
}

function sendNotification() {
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then(function (registration) {
      registration.showNotification('¡No olvides completar tus tareas! 🎯⏰', {
        body: '¡Recuerda que tienes tareas pendientes! No dejes para mañana lo que puedes hacer hoy 📋✅',
        icon: 'icon.png',
        vibrate: [200, 100, 200],
        actions: [
          { action: 'explore', title: 'explorar' },
          { action: 'close', title: 'cerrar' }
        ]
      });
    });
  } else {
    alert('Debes conceder permiso para enviar notificaciones');
  }
}

loadTasks(); 