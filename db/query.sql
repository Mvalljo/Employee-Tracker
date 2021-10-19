/*view all departments*/
SELECT *
FROM department;

/*view all roles*/
SELECT 
    role.id,
    role.title,
    department.name as department,
    role.salary
FROM role
    JOIN department
    ON role.department_id = department.id
ORDER BY role.id;

/*view all employees*/
SELECT 
    employee.id,
    employee.last_name,
    employee.first_name,
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
    ON role.department_id = department.id
ORDER BY employee.id;