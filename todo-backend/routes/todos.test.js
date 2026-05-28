const request = require('supertest');
const app = require('../app'); // Import your express app

describe('GET /todos', () => {
  it('should return a list of tasks', async () => {
    const response = await request(app).get('/todos');
    expect(response.statusCode).toBe(200);
    expect(response.body).toBeInstanceOf(Array);
  });
});

// ... existing code ...
describe('POST /todos', () => {
  it('should create a new task', async () => {
    const newTask = {
      title: 'Test Task',
      description: 'This is a test task',
      dueDate: '2025-01-01'
    };

    // 1. Create the task
    const createResponse = await request(app)
      .post('/todos')
      .send(newTask);
    
    expect(createResponse.statusCode).toBe(201);
    expect(createResponse.body).toHaveProperty('id');
    const newTaskId = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/todos/del/${newTaskId}`);
  });
});


describe ('DELETE /todos/del/:id', () => {
  it('should delete a task', async () => {
    const newTask = {
      title: 'Task to Delete',
      description: 'This task will be deleted',
      dueDate: '2024-12-31'
    };
    const createResponse = await request(app).post('/todos').send(newTask);
    const taskId = createResponse.body.id;

    const deleteResponse = await request(app).delete(`/todos/del/${taskId}`);
    expect(deleteResponse.statusCode).toBe(200);

    const getResponse = await request(app).get('/todos');
    const deletedTask = getResponse.body.find(task => task.id === taskId);
    expect(deletedTask).toBeUndefined();
  });
});

describe ('POST /todos/completed/:id/:completed', () => {
  it('should update the completed status of a task', async () => {
    const newTask = {
      title: 'Task to Complete',
      description: 'This task will be marked as completed',
      dueDate: '2024-12-31'
    };
    const createResponse = await request(app).post('/todos').send(newTask);
    const taskId = createResponse.body.id;

    const completeResponse = await request(app).post(`/todos/completed/${taskId}/true`);
    expect(completeResponse.statusCode).toBe(200);

    const getResponse = await request(app).get('/todos');
    const updatedTask = getResponse.body.find(task => task.id === taskId);
    expect(updatedTask.completed).toBe(true);

    const deleteResponse = await request(app).delete(`/todos/del/${taskId}`);
  });
});