/**
 * @jest-environment jsdom
 */

const fs = require('fs');
const path = require('path');
const { getByText, getByPlaceholderText } = require('@testing-library/dom');
require('@testing-library/dom/extend-expect');

describe('To-Do List Frontend', () => {
  let container;

  beforeEach(() => {
    // Load the HTML file into the JSDOM
    const html = fs.readFileSync(path.resolve(__dirname, './index.html'), 'utf8');
    container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    // Load the script file
    // We need to re-require it in each test to ensure a clean state
    jest.isolateModules(() => {
      require('./script.js');
    });
  });

  afterEach(() => {
    // Clean up the DOM
    document.body.removeChild(container);
    container = null;
  });

  test('should show the add task form when the button is clicked', () => {
    // Find the "Add a New Task" button
    const showFormBtn = getByText(container, 'Add a New Task');
    
    // Simulate a click
    showFormBtn.click();

    // Find an element within the form to check if it's visible
    const taskInput = getByPlaceholderText(container, 'Enter a new task...');
    expect(taskInput).toBeVisible();
  });
});
