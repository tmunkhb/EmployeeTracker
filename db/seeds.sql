INSERT INTO department(id, name)
VALUES
(1, 'Sales'),
(2, 'Engineering'),
(3, 'Legal'),
(4, 'Customer Service');

INSERT INTO roles(id, title, salary, department_id)
VALUES
(1, 'Sales Lead', 150000, 1),
(2, 'Senior Engineer', 170000, 2),
(3, 'Legal Lead', 120000, 3),
(4, 'Service Lead', 100000, 4);

INSERT INTO employee(id, first_name, last_name, role_id, manager_id)
VALUES
(1, 'Michael', 'Scott', 1, NULL),
(2, 'Han', 'Solo', 2, NULL),
(3, 'John', 'Wick', 3, NULL),
(4, 'Indiana', 'Jones', 4, NULL);