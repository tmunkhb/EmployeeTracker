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

// Add employee
const addEmployee = () => {
    connection.query('SELECT * FROM employee, roles', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the first name?',
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the last name?',
            },
            {
                name: 'role',
                type: 'rawlist',
                choices: () => {
                    let empArr = [];
                    for (let i = 0; i < results.length; i++) {
                        empArr.push(results[i].title);
                    }
                    let newEmpArr = [...new Set(empArr)];
                    return newEmpArr;
                },
                message: 'What is the role?'
            }
        ]).then(data => {
            let chosenRole;

            for (let i = 0; i < results.length; i++) {
                if (results[i].title === data.role) {
                    chosenRole = results[i];
                }
            }
            connection.query('INSERT INTO employee SET ?',
            {
                first_name: data.firstName,
                last_name: data.lastName,
                role_id: chosenRole.id,
            },
            (err) => {
                if (err) throw err;
                console.log(`New employee ${data.firstName} ${data.lastName} has been added!`);
                promptUser();
            }
          )
        });
    });
};

// Add role
const addRole = () => {
    connection.query('SELECT * FROM department', (err, results) => {
        if (err) throw err;
        inquirer.prompt([
            {
                name: 'title',
                type: 'input',
                message: 'Please enter title for the role',
            },
            {
                name: 'salary',
                type: 'input',
                message: 'Please enter salary for the role',
            },
            {
                name: 'department',
                type: 'rawlist',
                choices: () => {
                    let newRoleArr = [];
                    for (let i = 0; i < results.length; i++) {
                        newRoleArr.push(results[i].name);
                    }
                    return newRoleArr;
                },
                message: 'What department is this new role under?',
            }
        ]).then(data => {
            let chosenDepartment;
            for (let i = 0; i < results.length; i++) {
                if (results[i].name === data.department) {
                    chosenDepartment = results[i];
                }
            }
            connection.query('INSERT INTO roles SET ?',
            {
                title: data.title,
                salary: data.salary,
                department_id: chosenDepartment.id
            },
            (err) => {
                if (err) throw err;
                console.log(`New role ${data.title} has been added!`);
                promptUser();
            })
        });
    });
};

// Add department function
const addDepartment = () => {
    inquirer.prompt([
        {
            type: 'text',
            name: 'departmentName',
            message: 'Please enter the name of the department'
        },
        ]).then(data => {
            connection.query(`INSERT INTO department SET ?`,
                {name: data.departmentName},
                (err) => {
                    if (err) throw err;
                    console.log(`Added ${data.departmentName} department`);
                    promptUser();
                }
            );
        });
};

// Update employee role
const updateEmployee = () => {
    connection.query(`SELECT * FROM roles`, (err, results) => {
        if (err) throw err;
        const rolesArray = [];
        results.forEach(item => {
            rolesArray.push(item.title)
        });
        connection.query(`SELECT first_name, last_name FROM employee`, (err, results) => {
            if (err) throw err;
            const namesArray = [];
            results.forEach(item => {
                namesArray.push(item.first_name);
                namesArray.push(item.last_name);
            });
            const fullNameArray = [];
            for (let i = 0; i < namesArray.length; i += 2) {
                if (!namesArray[i + 1])
                break
                fullNameArray.push(`${namesArray[i]} ${namesArray[i + 1]}`)
            }
            inquirer.prompt([
                {
                    type: 'list',
                    name: 'name_select',
                    message: 'Please select an employee you would like to update',
                    choices: fullNameArray
                },
                {
                    type: 'list',
                    name: 'role_select',
                    message: 'Please select a role you would like your employee to change to:',
                    choices: rolesArray
                }
            ]).then((data) => {
                    let role_id;
                    for (let i = 0; i < rolesArray.length; i++) {
                        if (data.role_select === rolesArray[i]) {
                            role_id = i + 1;
                        }
                    };
                    const selectedNameArr = data.name_select.split(" ");
                    const lastName = selectedNameArr.pop();
                    const firstName = selectedNameArr[0];

                    connection.query(`UPDATE employee SET role_id = ? WHERE first_name = ? AND last_name = ?`,
                                [role_id, firstName, lastName],
                                function (err, results) {
                                    if (err) throw err;
                                    console.log('Employee updated!');
                                    promptUser();
                                }
                            );
                        });
                    }
                );
            }
        );
};


promptUser();