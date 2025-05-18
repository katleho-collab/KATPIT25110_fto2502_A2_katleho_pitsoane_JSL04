import { initialTasks } from './initialData.js';

// DOM Elements
const todoContainer = document.querySelector('.column-div[data-status="todo"] .tasks-container');
const doingContainer = document.querySelector('.column-div[data-status="doing"] .tasks-container');
const doneContainer = document.querySelector('.column-div[data-status="done"] .tasks-container');
const todoHeader = document.getElementById('toDoText');
const doingHeader = document.getElementById('doingText');
const doneHeader = document.getElementById('doneText');
const modal = document.getElementById('task-modal');
const titleInput = document.getElementById('task-title');
const descriptionInput = document.getElementById('task-description');
const descriptionAlert = document.getElementById('description-alert');
const statusSelect = document.getElementById('task-status');
const closeModalBtn = document.getElementById('close-modal');
const saveChangesBtn = document.getElementById('save-changes');
const deleteTaskBtn = document.getElementById('delete-task');
const newTaskBtn = document.getElementById('new-task-btn');

let currentTask = null;
let isEditing = false;

/**
 * Renders tasks into columns and updates header counts.
 */
function renderTasks() {
  // Clear existing tasks
  todoContainer.innerHTML = '';
  doingContainer.innerHTML = '';
  doneContainer.innerHTML = '';

  let todoCount = 0;
  let doingCount = 0;
  let doneCount = 0;

  initialTasks.forEach(task => {
    const taskDiv = document.createElement('div');
    taskDiv.classList.add('task-div');
    taskDiv.textContent = task.title;
    taskDiv.addEventListener('click', () => openModal(task, true));

    if (task.status === 'todo') {
      todoContainer.appendChild(taskDiv);
      todoCount++;
    } else if (task.status === 'doing') {
      doingContainer.appendChild(taskDiv);
      doingCount++;
    } else if (task.status === 'done') {
      doneContainer.appendChild(taskDiv);
      doneCount++;
    }
  });

  todoHeader.textContent = `TODO (${todoCount})`;
  doingHeader.textContent = `DOING (${doingCount})`;
  doneHeader.textContent = `DONE (${doneCount})`;
}

/**
 * Opens the modal with task details or for creating a new task.
 * @param {Object|null} task - The task to display/edit, or null for a new task.
 * @param {boolean} editing - Whether the modal is in edit mode.
 */
function openModal(task, editing = false) {
  isEditing = editing;
  currentTask = task;
  
  if (isEditing) {
    // Edit mode
    titleInput.value = task.title;
    descriptionInput.value = task.description || '';
    statusSelect.value = task.status;
    deleteTaskBtn.style.display = 'block'; // Show delete button in edit mode
  } else {
    // Create mode
    titleInput.value = '';
    descriptionInput.value = '';
    statusSelect.value = 'todo'; // Default status for new tasks
    deleteTaskBtn.style.display = 'none'; // Hide delete button in create mode
  }
  
  descriptionAlert.style.display = 'none'; // Hide alert initially
  modal.style.display = 'block';
}

/**
 * Closes the modal without saving.
 */
function closeModal() {
  modal.style.display = 'none';
  descriptionAlert.style.display = 'none';
  currentTask = null;
  isEditing = false;
}

/**
 * Saves changes to the task or creates a new one.
 */
function saveChanges() {
  const title = titleInput.value.trim();
  const description = descriptionInput.value.trim();
  const status = statusSelect.value;

  // Validation: Ensure title is not empty
  if (!title) {
    alert('Please fill out this field.');
    return;
  }

  // Validation: Ensure description is not empty
  if (!description) {
    descriptionAlert.style.display = 'block';
    return;
  }

  if (isEditing && currentTask) {
    // Update existing task
    currentTask.title = title;
    currentTask.description = description;
    currentTask.status = status;
  } else {
    // Create new task
    const newTask = {
      id: initialTasks.length ? Math.max(...initialTasks.map(t => t.id)) + 1 : 1, // Generate new ID
      title,
      description,
      status,
    };
    initialTasks.push(newTask);
  }

  renderTasks();
  closeModal();
}

/**
 * Deletes the task and updates the board.
 */
function deleteTask() {
  if (!currentTask || !isEditing) return;
  const index = initialTasks.findIndex(t => t.id === currentTask.id);
  if (index !== -1) {
    initialTasks.splice(index, 1);
    renderTasks();
    closeModal();
  }
}

// Event Listeners
closeModalBtn.addEventListener('click', closeModal);
saveChangesBtn.addEventListener('click', saveChanges);
deleteTaskBtn.addEventListener('click', deleteTask);
modal.addEventListener('click', (e) => {
  if (e.target === modal) closeModal();
});
newTaskBtn.addEventListener('click', () => openModal(null, false));

// Initial Render
renderTasks();