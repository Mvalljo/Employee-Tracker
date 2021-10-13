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
        database: 'employeeTracker_db'
    },
    console.log(`Connected to the classlist_db database.`)
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
        choices: [''],
        name: 'employeeRole',
    },
    {
        type: 'list',
        message: 'What is the employees manager?',
        //Get managers name from database
        choices: [''],
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
                db.query('SELECT * FROM department', function (err, results) {
                    console.log(results);
                });
            } else if (data.choice === "add a department") {
                
            } else if (data.choice === "view all employees") {
                // Query database
                db.query('SELECT * FROM employee', function (err, results) {
                    console.log(results);
                });
            } else if (data.choice === "add a employee") {

            } else if (data.choice === "update a employee role") {

            } else if (data.choice === "view all roles") {
                // Query database
                db.query('SELECT * FROM role', function (err, results) {
                    console.log(results);
                });
            } else if (data.choice === "add a role") {

            } else if (data.choice === "Quit") {

            }
        })
}
//initializes function init() once
for (let i = 0; i < 1; i++) {
    init();
}