INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title,salary,department_id)
VALUES ("Sales Lead","100000",4),
       ("Accountant","125000",2),
       ("Lawyer","190000",3),
       ("Software Engineer","120000",1);

SELECT 
    role.id,
    role.title,
    department.name as department,
    role.salary
FROM role
    JOIN department
    ON role.department_id = department.id;

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES ("John","Doe",1,null),
       ("Malia","Brown",2,1),
       ("Kevin","Tupick",4,1),
       ("Tom","Allen",3,1);
       
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
    ON role.department_id = department.id;
