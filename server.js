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

// View employees function
const viewEmployees = () => {
    connection.query(`SELECT employee.id, employee.first_name, employee.last_name, roles.title AS role, roles.salary AS salary,
    department.name AS department 
    FROM employee
    LEFT JOIN roles
    ON employee.role_id = roles.id
    LEFT JOIN department
    ON roles.department_id = department.id`,
    (err, results) => {
        if (err) throw err;
        console.log('Showing employees');
        console.table(results);
        promptUser();
    })
};

// View departments function
const viewDepartments = () => {
    connection.query(`SELECT * FROM department`, (err, results) => {
            if (err) throw err;
            console.log(`Showing departments:`)
            console.table(results);
            promptUser();
        });
};

// View employee roles function
const viewRoles = () => {
    connection.query(`SELECT * FROM roles`, (err, results) => {
        if (err) throw err;
        console.log(`Showing roles:`)
        console.table(results);
        promptUser();
    })
};

