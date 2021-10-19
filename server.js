const inquirer = require('inquirer');
const mysql = require('mysql2');
require('dotenv').config();

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
        choices: ['view all department', 'add a department',
            'view all employees', 'add an employee',
            'update an employee role', 'update an employees manager',
            'view employees by manager', 'view employees by department',
            'view all roles', 'add a role',
            'Delete a department', 'Delete a role', 'Delete a employee',
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
                    .then((data) => {
                        db.query(`INSERT INTO department (name) VALUES (?);`, data.departmentName, (err, results) => {
                            if (err) {
                                console.log('error:', err.message);
                            } else {
                                console.log("Added " + data.departmentName + " to the database.");
                            }
                            init();
                            return results;
                        });
                    })
            } else if (data.choice === "view all employees") {
                // Query database
                db.query("SELECT employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, concat(manager.first_name, ' ' ,  manager.last_name) AS manager FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id;", function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (data.choice === "add an employee") {
                inquirer
                    .prompt(addEmployeeQ)
                    .then((data) => {
                        db.query("SELECT * FROM role;", function (err, results) {
                            //Searches for the role name that matches the answer given to get the role id
                            let empR;
                            for (let d = 0; d < results.length; d++) {
                                if (results[d].title === data.employeeRole) {
                                    empR = results[d].id;
                                }
                            }
                            db.query("SELECT id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee;", function (err, results) {
                                console.log(results);
                                //Searches for the manager name that matches the answer given to get the manager id
                                let empM;
                                for (let m = 0; m < results.length; m++) {
                                    if (results[m].employee === data.employeeManager) {
                                        empM = results[m].id;
                                    } else if (data.employeeManager === "None") {
                                        empM = "NULL";
                                    }
                                }
                                //adds a new employee to the database
                                db.query(`INSERT INTO employee (first_name,last_name,role_id,manager_id) VALUES ("${data.employeeFirstName}","${data.employeeLastName}",${empR},${empM});`, (err, results) => {
                                    if (err) {
                                        console.log('error:', err.message);
                                    } else {
                                        console.log("Added " + data.employeeFirstName + " " + data.employeeLastName + " to the database.");
                                    }
                                    init();
                                    return results;
                                });
                            });
                        });
                    })
            } else if (data.choice === "update an employee role") {
                inquirer
                    .prompt(updateEmployee)
                    .then((data) => {
                        db.query("SELECT id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee;", function (err, results) {
                            //Searches for the employee name that matches the answer given to get the employee id
                            let empId;
                            for (let u = 0; u < results.length; u++) {
                                if (results[u].employee === data.updateName) {
                                    empId = results[u].id;
                                }
                            }
                            db.query("SELECT role.id, role.title FROM role;", function (err, results) {
                                //Searches for the role name that matches the answer given to get the role id
                                let empR;
                                for (let u = 0; u < results.length; u++) {
                                    if (results[u].title === data.updateRole) {
                                        empR = results[u].id;
                                    }
                                }
                                //updates an employee's role to the database
                                db.query(`UPDATE employee SET role_id = ${empR} WHERE employee.id = ${empId};`, (err, results) => {
                                    if (err) {
                                        console.log('error:', err.message);
                                    } else {
                                        console.log("Updated " + data.updateName + " role.");
                                    }
                                    init();
                                    return results;
                                });
                            });
                        });
                    })
            } else if (data.choice === "update an employees manager") {
                inquirer
                    .prompt(updateEmployeeM)
                    .then((data) => {
                        db.query("SELECT id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee;", function (err, results) {
                            //Searches for the employee name that matches the answer given to get the employee id
                            let empIdM;
                            for (let u = 0; u < results.length; u++) {
                                if (results[u].employee === data.updateNameM) {
                                    empIdM = results[u].id;
                                }
                            }
                            //Searches for the manager name that matches the answer given to get the manager id
                            let empMangUpdate;
                            console.log(data.updateManager)
                            for (let t = 0; t < results.length; t++) {
                                if (results[t].employee === data.updateManager) {
                                    empMangUpdate = results[t].id;
                                } else if (data.updateManager === "None") {
                                    empMangUpdate = "NULL";
                                }
                            }
                            //updates an employee's manager to the database
                            db.query(`UPDATE employee SET manager_id = ${empMangUpdate} WHERE employee.id = ${empIdM};`, (err, results) => {
                                if (err) {
                                    console.log('error:', err.message);
                                } else {
                                    console.log("Updated " + data.updateNameM + " manager to " + data.updateManager + ".");
                                }
                                init();
                                return results;
                            });
                        });
                    });
            } else if (data.choice === "view employees by manager") {
                // Query database
                db.query("SELECT concat(manager.first_name, ' ' ,  manager.last_name) AS manager, GROUP_CONCAT(employee.first_name,' ',employee.last_name) AS employees FROM employee LEFT JOIN employee manager ON employee.manager_id = manager.id WHERE employee.manager_id!='NULL' GROUP BY manager;", function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "view employees by department") {
                // Query database
                db.query("SELECT department.name AS department, GROUP_CONCAT(employee.first_name,' ',employee.last_name) AS employees FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id GROUP BY department;", function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "view all roles") {
                // Query database
                db.query("SELECT role.title, department.name as department, role.salary FROM role JOIN department ON role.department_id = department.id;", function (err, results) {
                    console.table(results);
                    init();
                });
            } else if (data.choice === "add a role") {
                inquirer
                    .prompt(addRoleQ)
                    .then((data) => {
                        db.query("SELECT * FROM Department;", function (err, results) {
                            //Searches for the department name that matches the answer given to get the department id
                            let roleDept;
                            for (let r = 0; r < results.length; r++) {
                                if (results[r].name === data.roleDepartment) {
                                    roleDept = results[r].id;
                                }
                            }
                            //adds a new role to the database
                            db.query(`INSERT INTO role (title,salary,department_id) VALUES ("${data.roleName}","${data.roleSalary}",${roleDept});`, (err, results) => {
                                if (err) {
                                    console.log('error:', err.message);
                                } else {
                                    console.log("Added " + data.roleName + " to the database.");
                                }
                                init();
                                return results;
                            });
                        });

                    })
            } else if (data.choice === "Delete a department") {
                inquirer
                    .prompt(deleteDepartment)
                    .then((data) => {
                        db.query(`DELETE FROM department WHERE name = "?";`, data.deletedDept, (err, results) => {
                            if (err) {
                                console.log('error:', err.message);
                            } else {
                                console.log("Deleted " + data.deletedDept + " from the database.");
                            }
                            init();
                            return results;
                        });
                    })
            } else if (data.choice === "Delete a role") {
                inquirer
                    .prompt(deleteRole)
                    .then((data) => {
                        db.query(`DELETE FROM role WHERE title = "?";`, data.deletedRole, (err, results) => {
                            if (err) {
                                console.log('error:', err.message);
                            } else {
                                console.log("Deleted " + data.deletedRole + " from the database.");
                            }
                            init();
                            return results;
                        });
                    })
            } else if (data.choice === "Delete a employee") {
                inquirer
                    .prompt(deleteEmployee)
                    .then((data) => {
                        db.query("SELECT id, concat(employee.first_name, ' ' ,  employee.last_name) AS employee FROM employee;", function (err, results) {
                            //Searches for the employee name that matches the answer given to get the employee id
                            let empIdD;
                            for (let w = 0; w < results.length; w++) {
                                if (results[w].employee === data.deletedEmpl) {
                                    empIdD = results[w].id;
                                }
                            }
                            db.query(`DELETE FROM employee WHERE id = ?;`, empIdD, (err, results) => {
                                if (err) {
                                    console.log('error:', err.message);
                                } else {
                                    console.log("Deleted " + data.deletedEmpl + " from the database.");
                                }
                                init();
                                return results;
                            });
                        });
                    })
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