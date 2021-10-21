const mysql = require('mysql2');
// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: process.env.DB_PASSWORD,
        database: 'employee_tracker_db'
    },
);

const starterQ = [
    {
        type: 'list',
        message: 'What would you like to do?',
        choices: ['View all employees', 'Add an employee',
            'Update an employee role', 'Update an employees manager',
            'View employees by manager', 'View employees by department',
            'View all roles', 'Add a role',
            'View all departments', 'Add a department',
            'Delete a department', 'Delete a role', 'Delete a employee',
            'View the total utilized budget of each department',
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
const emplRole = new Array;
db.query('SELECT role.title FROM role', function (err, results) {
    for (let i = 0; i < results.length; i++) {
        emplRole.push(results[i].title);
    }
});
//Gets managers and puts it in a array
const emplMang = ["None"];
db.query("SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS employee, concat(manager.first_name, ' ' ,  manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id INNER JOIN role ON employee.role_id = role.id;", function (err, results) {
    for (let i = 0; i < results.length; i++) {
        if (results[i].manager === null) {
            emplMang.push(results[i].employee);
        }
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
        choices: emplRole,
        name: 'employeeRole',
    },
    {
        type: 'list',
        message: 'What is the employees manager?',
        //Get managers name from database
        choices: emplMang,
        name: 'employeeManager',
    }
]

//Gets department names and puts it in a array
const dept = new Array;
db.query('SELECT department.name FROM department', function (err, results) {
    for (let i = 0; i < results.length; i++) {
        dept.push(results[i].name);
    }
});
//Array of questions to add a role
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
        choices: dept,
        name: 'roleDepartment'
    }
]

//Gets employee's name and puts it in a array
const emplNames = new Array;
db.query("SELECT concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee", function (err, results) {
    for (let i = 0; i < results.length; i++) {
        emplNames.push(results[i].employee);
    }
});
//Array of questions to update an employee
const updateEmployee = [
    {
        type: 'list',
        message: 'Which employees role do you want to update?',
        //Get employees names from database
        choices: emplNames,
        name: 'updateName'
    },
    {
        type: 'list',
        message: 'Which role do you wnat to assign the selected employee?',
        //Get employess role from database
        choices: emplRole,
        name: 'updateRole'
    }
]

//Array of questions to update an employee's manager
const updateEmployeeM = [
    {
        type: 'list',
        message: "Which employee's manager do you want to update?",
        //Get employees names from database
        choices: emplNames,
        name: 'updateNameM'
    },
    {
        type: 'list',
        message: 'Which manager do you wnat to assign the selected employee?',
        //Get employess role from database
        choices: emplMang,
        name: 'updateManager'
    }
]

//Array of question to choose what department to delete
const deleteDepartment = [
    {
        type: 'list',
        message: "What department do you want to delete?",
        //Get employeres names from database
        choices: dept,
        name: 'deletedDept'
    }
]

//Array of question to choose what role to delete
const deleteRole = [
    {
        type: 'list',
        message: "What role do you want to delete?",
        //Get employees names from database
        choices: emplRole,
        name: 'deletedRole'
    }
]

//Array of question to choose which employee to delete
const deleteEmployee = [
    {
        type: 'list',
        message: "Which employee do you want to delete?",
        //Get employees names from database
        choices: emplNames,
        name: 'deletedEmpl'
    }
]

exports.starterQ = starterQ;
exports.addDepartmentQ = addDepartmentQ;
exports.dept = dept; 
exports.addEmployeeQ = addEmployeeQ;
exports.emplNames = emplNames;
exports.emplMang = emplMang;
exports.addRoleQ = addRoleQ;
exports.emplRole = emplRole;
exports.updateEmployee = updateEmployee;
exports.updateEmployeeM = updateEmployeeM;
exports.deleteDepartment = deleteDepartment;
exports.deleteRole = deleteRole;
exports.deleteEmployee = deleteEmployee;