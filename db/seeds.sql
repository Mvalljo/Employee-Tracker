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
    ON role.department_id=department.id;