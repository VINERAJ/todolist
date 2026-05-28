/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { getByText, getByPlaceholderText } = require('@testing-library/dom');
const userEvent = require('@testing-library/user-event').default;

describe('To-Do List Frontend', () => {
  let container;

  beforeEach(() => {
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    container = document.createElement('div');
    document.body.appendChild(container);
    container.innerHTML = html;

    jest.isolateModules(() => {
      require('./script.js');
      document.dispatchEvent(new Event('DOMContentLoaded'));
    });
  });

  afterEach(() => {
    document.body.removeChild(container);
    container = null;
  });

  test('should show the add task form when the button is clicked', async () => {
    const user = userEvent.setup();
    const showFormBtn = getByText(container, 'Add a New Task');
    
    await user.click(showFormBtn);

    const taskInput = getByPlaceholderText(container, 'Enter a new task...');
    const taskDesc = getByPlaceholderText(container, 'Enter task description...');
    const taskDueDate = container.querySelector('#taskDate');
    expect(taskDesc).toBeVisible();
    expect(taskDueDate).toBeVisible();
    expect(taskInput).toBeVisible();
  });

  test('should create tasks and display them in the list', async () => {
    const showFormBtn = getByText(container, 'Add a New Task');
    await user.click(showFormBtn);

    const taskInput = getByPlaceholderText(container, 'Enter a new task...');
    const taskDesc = getByPlaceholderText(container, 'Enter task description...');
    const taskDueDate = container.querySelector('#taskDate');
    const addTaskBtn = getByText(container, 'Add Task');

    taskInput.value = 'Test Task';
    taskDesc.value = 'This is a test task';
    taskDueDate.value = '2026-01-01';
    addTaskBtn.click();

    const newTaskElement = await container.querySelector('#taskList');
    expect(newTaskElement).toBeInTheDocument();
  });
});
