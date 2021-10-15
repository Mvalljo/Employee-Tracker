INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");
/*view all departments*/
SELECT *
FROM department;

INSERT INTO role (title,salary,department_id)
VALUES  ("Sales Lead","100000",4),
        ("Salesperson","80000",4),
        ("Account Manager","160000",2),
        ("Accountant","125000",2),
        ("Legal Team Lead","250000",3),
        ("Lawyer","190000",3),
        ("Lead Engineer","150000",1),
        ("Software Engineer","120000",1);
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

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("Naruto","Uzumaki",1,null),   
        ("John","Doe",2,2),
        ("Bruce","Wayne",7,null),
        ("Asami","Sato",8,3),
        ("Kento","Nanami",3,null),
        ("Jordan","Belfort",4,5),
        ("Loki","Laufeyson",5,null),
        ("Tom","Allen",6,7);
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


