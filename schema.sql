-- DROP DATABASE IF EXISTS ems_database ;

CREATE DATABASE ems_database;

USE ems_database;

CREATE TABLE employee(
id INT NOT NULL  AUTO_INCREMENT, 
first_name VARCHAR (30) NOT NULL,
last_name VARCHAR (30) NOT NULL,
role_id INT ,
manager_id INT ,
PRIMARY KEY(id)
);
USE employee;
INSERT into employee(first_name,last_name,role_id,manager_id)
VALUES
("Olga","Vorona",120,7),
("Ira","Shepak",128,6),
("Tymur","Antonchenko",101,6),
("Kate","Yushko",110,2),
("Valeria","Vovchik",105,8),
("Olga","Gordievskaya",105,3),
("Yana","Kozinets",102,5);
INSERT into employee(first_name,last_name,role_id)

VALUES ("Alex","Brun",103);






SELECT * FROM employee;

USE ems_database;
CREATE TABLE department(
id INT NOT NULL AUTO_INCREMENT,
name VARCHAR(30) NOT NULL,
PRIMARY KEY(id)
);
SELECT * FROM department;
-- USE department;
INSERT INTO department(name)
VALUE
("AUTOMOBILE"),
("HEALTH"),
("COSMETICS"),
("HUMAN RESOURCES"),
("IMFORMATION TECHNOLOGY"),
("OTHER"),
-- DELETE FROM department WHERE name="GENERAL";


-- Role---------------

USE ems_database;
CREATE TABLE role(
id INT NOT NULL auto_increment,
title VARCHAR(30),
salary DECIMAL(12,2) NOT NULL ,
department_id INT ,
PRIMARY KEY(id)
);


ALTER TABLE role AUTO_INCREMENT = 100 ;
SELECT * FROM role;
INSERT INTO role(title,salary,department_id)
VALUES 
("SENIOR MANAGER",700,1),
("JUNIOR EMLOYEE",1000,1),
("INTERN LEVEL",600,2),
("JUNIOR DEVELOPER",700,2),
("SCRUM MASTER",1000,2),
("MIS COORDINATOR",600,3),
("Mid Level",700,3),
("SENIOR ADVISOR",1000,3),
("PARTY PLANNER",600,4),
("ACCOUNT MANAGER",700,4),
("JUNIOR ACCOUNTANT",1000,4);
-- INSERT INTO role(title,salary)
-- VALUES ("SUPERVISER",1200)

