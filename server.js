const inquirer = require('inquirer');
var figlet = require('figlet');
const mysql = require('mysql2');
require('dotenv').config();
const questions = require('./questions');

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

function init() {
    inquirer
        .prompt(questions.starterQ)
        .then((data) => {
            if (data.choice === "View all departments") {
                // Shows a table with all the departments listed
                db.query('SELECT department.name FROM department', function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "Add a department") {
                inquirer
                    .prompt(questions.addDepartmentQ)
                    .then((data) => {
                        //Adds new department made to database
                        db.query(`INSERT INTO department (name) VALUES (?);`, data.departmentName, (err, results) => {
                            if (err) {
                                console.log('error:', err.message);
                            } else {
                                console.log("Added " + data.departmentName + " to the database.");
                                ////Adds a new department to the list of all departments that the questions uses
                                questions.dept.push(data.departmentName);
                            }
                            init();
                            return results;
                        });
                    })
            } else if (data.choice === "View all employees") {
                // Shows a table with all the employees with their first name, last name, role, department, salary, and manager
                db.query(`
                SELECT 
                    employee.first_name, 
                    employee.last_name, 
                    role.title, 
                    department.name AS department, 
                    role.salary, 
                    concat(manager.first_name, ' ' ,  manager.last_name) AS manager 
                FROM employee 
                    LEFT JOIN employee manager 
                    ON employee.manager_id = manager.id 
                    INNER JOIN role 
                    ON employee.role_id = role.id 
                    INNER JOIN department 
                    ON role.department_id = department.id;
                `, function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "Add an employee") {
                inquirer
                    .prompt(questions.addEmployeeQ)
                    .then((data) => {
                        db.query("SELECT * FROM role;", function (err, results) {
                            //Searches for the role name that matches the answer given to get the role id
                            let empR;
                            for (let d = 0; d < results.length; d++) {
                                if (results[d].title === data.employeeRole) {
                                    empR = results[d].id;
                                }
                            }
                            db.query(`
                            SELECT 
                                id, 
                                concat(employee.first_name, ' ' ,  employee.last_name) AS employee 
                            FROM employee;`, function (err, results) {
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
                                const addAnEmployeeQ = `
                                INSERT INTO employee (first_name,last_name,role_id,manager_id) 
                                VALUES ("${data.employeeFirstName}","${data.employeeLastName}",${empR},${empM});
                                `;
                                //adds a new employee to the database
                                db.query(addAnEmployeeQ, (err, results) => {
                                    if (err) {
                                        console.log('error:', err.message);
                                    } else {
                                        console.log("Added " + data.employeeFirstName + " " + data.employeeLastName + " to the database.");
                                        //Adds a new employee to the list of all employees that the questions uses
                                        questions.emplNames.push(data.employeeFirstName + " " + data.employeeLastName);
                                        console.log(questions.emplNames);
                                        //If no manager is chosen for the new employee then add to the list of all managers that the quesitons uses
                                        if (data.employeeManager === "None") {
                                            questions.emplMang.push(data.employeeFirstName + " " + data.employeeLastName)
                                        }
                                    }
                                    init();
                                    return results;
                                });
                            });
                        });
                    })
            } else if (data.choice === "Update an employee role") {
                inquirer
                    .prompt(questions.updateEmployee)
                    .then((data) => {
                        db.query(`
                        SELECT 
                            id, 
                            concat(employee.first_name, ' ' ,  employee.last_name) AS employee 
                        FROM employee;
                        `, function (err, results) {
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
            } else if (data.choice === "Update an employees manager") {
                inquirer
                    .prompt(questions.updateEmployeeM)
                    .then((data) => {
                        db.query(`
                        SELECT 
                            id, 
                            concat(employee.first_name, ' ' ,  employee.last_name) AS employee 
                        FROM employee;
                        `, function (err, results) {
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
                            db.query(`
                            UPDATE employee 
                            SET manager_id = ${empMangUpdate} 
                            WHERE employee.id = ${empIdM};`, (err, results) => {
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
            } else if (data.choice === "View employees by manager") {
                // Shows a table with all managers with their employees 
                db.query(`
                SELECT 
                    concat(manager.first_name, ' ' ,  manager.last_name) AS manager, 
                    GROUP_CONCAT(employee.first_name,' ',employee.last_name) AS employees 
                FROM employee 
                    LEFT JOIN employee manager 
                    ON employee.manager_id = manager.id 
                WHERE employee.manager_id!='NULL' 
                GROUP BY manager;
                `, function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "View employees by department") {
                // Shows a table with all departments with their employees 
                db.query(`
                SELECT 
                    department.name AS department, 
                    GROUP_CONCAT(employee.first_name,' ',employee.last_name) AS employees 
                FROM employee 
                    INNER JOIN role 
                    ON employee.role_id = role.id 
                    INNER JOIN department 
                    ON role.department_id = department.id 
                GROUP BY department;
                `, function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "View all roles") {
                // Shows a table with all roles and their department, and salary
                db.query(`
                SELECT 
                    role.title, 
                    department.name as department, 
                    role.salary 
                FROM role 
                JOIN department 
                    ON role.department_id = department.id;
                `, function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            } else if (data.choice === "Add a role") {
                inquirer
                    .prompt(questions.addRoleQ)
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
                            db.query(`
                            INSERT INTO role (title,salary,department_id) 
                            VALUES ("${data.roleName}","${data.roleSalary}",${roleDept});
                            `, (err, results) => {
                                if (err) {
                                    console.log('error:', err.message);
                                } else {
                                    console.log("Added " + data.roleName + " to the database.");
                                    //Adds a new role to the list of all roles that the questions uses
                                    questions.emplRole.push(data.roleName);
                                }
                                init();
                                return results;
                            });
                        });

                    })
            } else if (data.choice === "Delete a department") {
                inquirer
                    .prompt(questions.deleteDepartment)
                    .then((data) => {
                        //Deleted a department from database
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
                    .prompt(questions.deleteRole)
                    .then((data) => {
                        //Deleted a role from database
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
                    .prompt(questions.deleteEmployee)
                    .then((data) => {
                        db.query(`
                        SELECT 
                            id, 
                            concat(employee.first_name, ' ' ,  employee.last_name) AS employee 
                        FROM employee;
                        `, function (err, results) {
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
            } else if (data.choice === "View the total utilized budget of each department") {
                // Shows a table with each deparmtnets budget from the combined salaries of all employees in that department
                db.query(`
                SELECT 
                    department.name as department, 
                    SUM(role.salary) as budget 
                FROM role 
                    RIGHT JOIN department 
                    ON role.department_id = department.id 
                GROUP BY department.name;
                `, function (err, results) {
                    if (err) {
                        console.log('error:', err.message);
                    } else {
                        console.table(results);
                    }
                    init();
                });
            }
            else if (data.choice === "Quit") {
                console.log("\nGoodbye!");
                process.exit(0);
            }
        })
}
//initializes function init() once
for (let i = 0; i < 1; i++) {
    console.log(figlet.textSync('Employee'))
    console.log(figlet.textSync('Manager'))
    init();
}