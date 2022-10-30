const inquirer = require('inquirer');
const mysql = require('mysql2');
const cTable = require('console.table');

// Connect to Database
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'employees'
});

// Initiate promptUser
const promptUser = () => {
    inquirer.prompt({
        type: 'list',
        name: 'choices',
        message: 'What do you want to do? (Please select one of the following)',
        choices: ['View All Employees', 'View All Department', 'View All Roles', 'Add Employee', 'Add Role', 'Add Department', 'Update Employee', 'Finished!']
    })
    .then((data) => {
        switch (data['choices']) {
            case 'View All Employees':
                viewEmployees();
                break;
            case 'View All Department':
                viewDepartments();
                break;
            case 'View All Roles':
                viewRoles();
                break;
            case 'Add Employee':
                addEmployee();
                break;
            case 'Add Role':
                addRole();
                break;
            case 'Add Department':
                addDepartment();
                break;
            case 'Update Employee':
                updateEmployee();
                break;    
            case 'Finished!':
                break;
        }
    })
};

