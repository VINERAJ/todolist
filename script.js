document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const showTaskFormBtn = document.getElementById('showTaskFormBtn');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDesc = document.getElementById('taskDesc');
    const taskDate = document.getElementById('taskDate');
    const taskList = document.getElementById('taskList');
    const noTasksMsg = document.getElementById('noTasksMsg');

    // const apiUrl = 'http://localhost:3000/todos';
    const apiUrl = 'https://todolist-lgen.onrender.com/todos';

    function updateTaskListView() {
        if (taskList.children.length === 0) {
            noTasksMsg.style.display = 'block';
        } else {
            noTasksMsg.style.display = 'none';
        }
    }

    function createTaskElement(task) {
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        if (task.completed) {
            taskDiv.classList.add('completed');
        }

        const taskDetails = document.createElement('span');
        taskDetails.textContent = `${task.title} - ${task.description} (Due: ${task.dueDate})`;

        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.checked = task.completed;
        checkbox.addEventListener('change', () => {
            taskDiv.classList.toggle('completed');
            try {
                const response = fetch(`${apiUrl}/completed/${task.id}/${checkbox.checked}`, {
                    method: 'POST',
                });
                console.log(response.ok);
                if (!response.ok) {
                    console.error('Failed to update task status');
                }
            } catch (error) {
                console.error('Error updating task status:', error);
            }
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;';
        deleteBtn.addEventListener('click', async () => {
            try {
                const response = await fetch(`${apiUrl}/del/${task.id}`, {
                    method: 'DELETE',
                });
                if (response.ok) {
                    taskList.removeChild(taskDiv);
                    updateTaskListView();
                } else {
                    console.error('Failed to delete task');
                }
            } catch (error) {
                console.error('Error deleting task:', error);
            }
        });

        taskActions.appendChild(checkbox);
        taskActions.appendChild(deleteBtn);

        taskDiv.appendChild(taskDetails);
        taskDiv.appendChild(taskActions);

        return taskDiv;
    }

    async function fetchTasks() {
        taskList.innerHTML = '<p>Loading tasks...</p>';
        noTasksMsg.style.display = 'none';
        try {
            const response = await fetch(apiUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const tasks = await response.json();
            taskList.innerHTML = '';
            tasks.forEach(task => {
                const taskElement = createTaskElement(task);
                taskList.appendChild(taskElement);
            });
        } catch (error) {
            console.error('Error fetching tasks:', error);
            taskList.innerHTML = '<p style="color: red; text-align: center;">Failed to load tasks. Please try again later.</p>';
        } finally {
            updateTaskListView();
        }
    }

    async function addTask() {
        const taskText = taskInput.value.trim();
        const taskDescText = taskDesc.value.trim();
        const taskDateValue = taskDate.value;

        if (taskText === '' || taskDescText === '' || taskDateValue === '') {
            alert('Please fill out all fields');
            return;
        }

        const newTask = {
            title: taskText,
            description: taskDescText,
            dueDate: taskDateValue,
            completed: false
        };

        try {
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newTask),
            });
            const createdTask = await response.json();
            const taskElement = createTaskElement(createdTask);
            taskList.appendChild(taskElement);

            taskInput.value = '';
            taskDesc.value = '';
            taskDate.value = '';
            addTaskForm.style.display = 'none';
            showTaskFormBtn.style.display = 'block';

            updateTaskListView();
        } catch (error) {
            console.error('Error adding task:', error);
        }
    }

    showTaskFormBtn.addEventListener('click', () => {
        addTaskForm.style.display = 'block';
        showTaskFormBtn.style.display = 'none';
        taskInput.focus();
    });

    addTaskBtn.addEventListener('click', addTask);

    const enterKeyHandler = (e) => {
        if (e.key === 'Enter') {
            addTask();
        }
    };

    taskInput.addEventListener('keypress', enterKeyHandler);
    taskDesc.addEventListener('keypress', enterKeyHandler);
    taskDate.addEventListener('keypress', enterKeyHandler);

    fetchTasks();
});