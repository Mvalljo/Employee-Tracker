const inquirer = require('inquirer');
const mysql = require('mysql2');

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: '',
        database: 'employee_tracker_db'
    },
);

const starterQ = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['view all department', 'add a department',
            'view all employees', 'add an employee', 'update an employee role',
            'view all roles', 'add a role',
            'Quit'],
        name: 'choice',
    },
];

const addDepartmentQ = [
    {
        type: 'input',
        message: 'What is the name of the department?',
        name: 'departmentName',
    }
]
//Gets roles and puts it in a array
const employeeRole = new Array;
db.query('SELECT role.title FROM role', function (err, results) {
    for (let i = 0; i < results.length; i++) {
        employeeRole.push(results[i].title);    
    }
});
//Array of questions to add an employee
const addEmployeeQ = [
    {
        type: 'input',
        message: 'What is the employees first name?',
        name: 'employeeFirstName',
    },
    {
        type: 'input',
        message: 'What is the employees last name?',
        name: 'employeeLastName',
    },
    {
        type: 'list',
        message: 'What is the employees role?',
        //Get roles from database
        choices: test,
        name: 'employeeRole',
    },
    {
        type: 'list',
        message: 'What is the employees manager?',
        //Get managers name from database
        choices: test,
        name: 'employeeManager',
    }
]

const addRoleQ = [
    {
        type: 'input',
        message: 'What is the name of the role?',
        name: 'roleName',
    },
    {
        type: 'input',
        message: 'What is the salary of the role?',
        name: 'roleSalary',
    },
    {
        type: 'list',
        message: 'Which department does the role belong to?',
        //Get departments from database
        choices: [''],
        name: 'roleDepartment'
    }
]

const updateEmployee = [
    {
        type: 'list',
        message: 'Which employees role do you want to update?',
        //Get employees names from database
        choices: [''],
        name: 'updateName'
    },
    {
        type: 'list',
        message: 'Which role do you wnat to assign the selected employee?',
        //Get employess role from database
        choices: [''],
        name: 'updateRole'
    }
]

function init() {
    inquirer
        .prompt(starterQ)
        .then((data) => {
            if (data.choice === "view all department") {
                // Query database
                db.query('SELECT department.name FROM department', function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (data.choice === "add a department") {
                inquirer
                    .prompt(addDepartmentQ)
            } else if (data.choice === "view all employees") {
                // Query database
                db.query("SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name, ' ' ,  manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;", function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (data.choice === "add an employee") {
                inquirer
                    .prompt(addEmployeeQ)
                    .then((data)=> {
                        console.log(data);
                        init();
                    })
            } else if (data.choice === "update a employee role") {
                inquirer
                    .prompt(updateEmployee)
            } else if (data.choice === "view all roles") {
                // Query database
                db.query("SELECT role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id;", function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (data.choice === "add a role") {
                inquirer
                    .prompt(addRoleQ)
            } else if (data.choice === "Quit") {
                console.log("\nGoodbye!");
                process.exit(0);
            }
        })
}
//initializes function init() once
for (let i = 0; i < 1; i++) {
    init();
}