// const inquirer = require('inquirer');
import fs from 'fs'
import inquirer from 'inquirer';
import chalk from 'chalk';

// const chalk = require('chalk');

// Load the tasks from tasks.json file
const loadTasks = () => {
    try {
        const dataBuffer = fs.readFileSync('tasks.json');
        const dataJSON = dataBuffer.toString();
        return JSON.parse(dataJSON);
    } catch (e) {
        return [];
    }
};

// Save tasks to tasks.json
const saveTasks = (tasks) => {
    const tasksJSON = JSON.stringify(tasks, null, 2);
    fs.writeFileSync('tasks.json', tasksJSON);
};

// List all tasks
const listTasks = () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log(chalk.yellow('No tasks found!'));
    } else {
        console.log(chalk.green('Your To-Do List:'));
        tasks.forEach((task, index) => {
            console.log(chalk.cyan(`${index + 1}. ${task.description}`));
        });
    }
};

// Add a new task
const addTask = async () => {
    const tasks = loadTasks();
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'description',
            message: 'Enter the task description:',
            validate: (input) => (input ? true : 'Task description cannot be empty!')
        }
    ]);
    tasks.push({ description: answers.description });
    saveTasks(tasks);
    console.log(chalk.green('Task added successfully!'));
};

// Remove a task
const removeTask = async () => {
    const tasks = loadTasks();
    if (tasks.length === 0) {
        console.log(chalk.red('No tasks to remove!'));
        return;
    }
    const answers = await inquirer.prompt([
        {
            type: 'input',
            name: 'taskNumber',
            message: 'Enter the number of the task you want to remove:',
            validate: (input) => {
                const taskNumber = parseInt(input);
                if (isNaN(taskNumber) || taskNumber < 1 || taskNumber > tasks.length) {
                    return 'Please enter a valid task number.';
                }
                return true;
            }
        }
    ]);
    const taskNumber = parseInt(answers.taskNumber) - 1;
    tasks.splice(taskNumber, 1);
    saveTasks(tasks);
    console.log(chalk.green('Task removed successfully!'));
};

// Display the menu
const showMenu = async () => {
    const answers = await inquirer.prompt([
        {
            type: 'list',
            name: 'action',
            message: 'What would you like to do?',
            choices: [
                'List tasks',
                'Add task',
                'Remove task',
                'Exit'
            ]
        }
    ]);

    switch (answers.action) {
        case 'List tasks':
            listTasks();
            break;
        case 'Add task':
            await addTask();
            break;
        case 'Remove task':
            await removeTask();
            break;
        case 'Exit':
            console.log(chalk.yellow('Goodbye!'));
            return;
    }

    showMenu();
};

// Start the app
showMenu();
