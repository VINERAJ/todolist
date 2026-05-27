document.addEventListener('DOMContentLoaded', () => {
    const addTaskBtn = document.getElementById('addTaskBtn');
    const showTaskFormBtn = document.getElementById('showTaskFormBtn');
    const addTaskForm = document.getElementById('addTaskForm');
    const taskInput = document.getElementById('taskInput');
    const taskDesc = document.getElementById('taskDesc');
    const taskDate = document.getElementById('taskDate');
    const taskList = document.getElementById('taskList');
    const noTasksMsg = document.getElementById('noTasksMsg');

    function updateTaskListView() {
        if (taskList.children.length === 0) {
            noTasksMsg.style.display = 'block';
        } else {
            noTasksMsg.style.display = 'none';
        }
    }

    function addTask() {
        const taskText = taskInput.value.trim();
        const taskDescText = taskDesc.value.trim();
        const taskDateValue = taskDate.value;
        
        if (taskText === '') {
            alert('Please enter a task');
            return;
        }
        if (taskDescText === '') {
            alert('Please enter a description');
            return;
        }
        if (taskDateValue === '') {
            alert('Please select a date');
            return;
        }
        
        // Create task element
        const taskDiv = document.createElement('div');
        taskDiv.className = 'task';
        
        const taskDetails = document.createElement('span');
        taskDetails.textContent = `${taskText} - ${taskDescText} (Due: ${taskDateValue})`;
        
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.addEventListener('change', () => {
            taskDiv.classList.toggle('completed');
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.innerHTML = '&times;'; // Using HTML entity for a 'x' icon
        deleteBtn.addEventListener('click', () => {
            taskList.removeChild(taskDiv);
            updateTaskListView();
        });

        taskActions.appendChild(checkbox);
        taskActions.appendChild(deleteBtn);
        
        taskDiv.appendChild(taskDetails);
        taskDiv.appendChild(taskActions);
        
        // Add to list
        taskList.appendChild(taskDiv);
        
        // Clear input and hide form
        taskInput.value = '';
        taskDesc.value = '';
        taskDate.value = '';
        addTaskForm.style.display = 'none';
        showTaskFormBtn.style.display = 'block';
        
        updateTaskListView();
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

    // Initial check
    updateTaskListView();
});