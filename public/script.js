// Function to fetch tasks from the server and display them on the web page
function fetchTasks() {
  fetch('/tasks')
    .then(response => response.json())
    .then(tasks => {
      const taskList = document.getElementById('taskList');
      taskList.innerHTML = '';

      tasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.textContent = task.name;

        const editButton = document.createElement('button');
        editButton.textContent = 'Edit';
        editButton.addEventListener('click', () => {
          editTask(task);
        });

        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Delete';
        deleteButton.addEventListener('click', () => {
          deleteTask(task);
        });

        taskItem.appendChild(editButton);
        taskItem.appendChild(deleteButton);
        taskList.appendChild(taskItem);
      });
    });
}

// Function to handle edit task functionality
function editTask(task) {
  // Display a modal or form with task details for editing
  // Pre-fill the input fields with task details

  // Handle form submission
  const editForm = document.getElementById('editForm');
  editForm.addEventListener('submit', event => {
    event.preventDefault();

    // Get the updated task details from the form
    const updatedTask = {
      id: task.id,
      name: editForm.name.value,
      completed: editForm.completed.checked,
    };

    // Send a PUT or PATCH request to update the task on the server
    fetch(`/task/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedTask),
    })
      .then(response => {
        if (response.ok) {
          // Task updated successfully, refresh the task list
          fetchTasks();
          // Close the modal or form
          // Reset the form fields
        } else {
          console.error('Failed to update task:', response.status);
        }
      })
      .catch(error => {
        console.error('Error:', error);
      });
  });

  console.log('Edit task:', task);
}

// Function to handle delete task functionality
function deleteTask(task) {
  fetch(`/task/${task.id}`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        fetchTasks(); // Fetch tasks again after deleting a task
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Function to handle form submission
function submitTask(event) {
  event.preventDefault();

  const nameInput = document.getElementById('nameInput');
  const completedInput = document.getElementById('completedInput');

  const newTask = {
    name: nameInput.value,
    completed: completedInput.checked,
  };

  fetch('/new-task', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  })
    .then(response => {
      if (response.ok) {
        nameInput.value = '';
        completedInput.checked = false;
        fetchTasks(); // Fetch tasks again after adding a new task
      }
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

// Add event listener to form submission
const taskForm = document.getElementById('taskForm');
taskForm.addEventListener('submit', submitTask);

// Fetch tasks on page load
fetchTasks();
