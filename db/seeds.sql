INSERT INTO department (name)
VALUES ("Engineering"),
       ("Finance"),
       ("Legal"),
       ("Sales");

INSERT INTO role (title,salary,department_id)
VALUES  ("Sales Lead","100000",4),
        ("Salesperson","80000",4),
        ("Account Manager","160000",2),
        ("Accountant","125000",2),
        ("Legal Team Lead","250000",3),
        ("Lawyer","190000",3),
        ("Lead Engineer","150000",1),
        ("Software Engineer","120000",1);

INSERT INTO employee (first_name,last_name,role_id,manager_id)
VALUES  ("Naruto","Uzumaki",1,null),   
        ("John","Doe",2,1),
        ("Bruce","Wayne",7,null),
        ("Asami","Sato",8,3),
        ("Kento","Nanami",3,null),
        ("Jordan","Belfort",4,5),
        ("Loki","Laufeyson",5,null),
        ("Tom","Allen",6,7);