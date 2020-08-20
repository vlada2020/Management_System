//DEPENDENCIES
var inquirer = require("inquirer");
var mysql = require("mysql");

//CONNECTIONS TO OUR DATABASE
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "rootpass",
    database: "ems_database"
});
//CONNECTION TO THE SERVER
connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    //after connection only it start to exicute this start funtion;
    start();
});

//************************************** START PROMPT *******************************************
function start() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "what would you like to do?",
            choices: [
                "View By Each Employee",
                "View all Employee",
                "View all Department and its Employee",
                "View all Employee with its Department and Salary",
                "View all Employeee By Manager",
                "Add Employee",
                "Add Department",
                "Add Roles",
                "Remove Employee",
                "Update Employee",
                "Total Budget By DepartMent",
                "Exit"
            ]

        })
        .then(function (answer) {
            switch (answer.action) {
                case "View By Each Employee":
                    employee();
                    break;
                case "View all Employee":
                    employeeAll();
                    break;
                case "View all Department and its Employee":
                    employeeDepartment();
                    break;
                case "View all Employee with its Department and Salary":
                    employeeDepartmentAll();
                    break;
                case "View all Employeee By Manager":
                    employeeMangaer();
                    break;
                case "Add Employee":
                    addEmployee();
                    break;
                case "Add Roles":
                    addRole();
                    break;
                case "Add Department":
                    addDepartment();
                    break;
                case "Remove Employee":
                    removeEmployee();
                    break;
                case "Update Employee":
                    updateEmployee();
                    break;
                case "Total Budget By DepartMent":
                    budgetTotal();
                    break;
                case "Exit":
                    connection.end();
                    break;



            }
        })
}


///view employee by department
function employeeDepartment() {


    connection.query("SELECT * FROM department", function (err, res) {
        if (err) throw err;
        //console.log(res);
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].name);
                    }
                    return choiceArray;

                },
                message: "Employee By Department"

            }]).then(function (answer) {
                var query = `SELECT employee.first_name, employee.last_name,department.name,role.salary FROM employee
                JOIN role
                ON employee.role_id=role.id
                JOIN department
                ON role.department_id=department.id;`
                connection.query(query, [{ department_id: answer.choice }], function (err, res) {
                    if (err) throw err;
                    //console.log(res);
                    console.log("Department:", answer.choice);
                    for (var i = 0; i < res.length; i++) {

                        if (res[i].name === answer.choice) {
                            console.log("-----------------------");
                            console.log(" \n " + "First Name :" + res[i].first_name + " \n " + "Last Name :" + res[i].last_name + "\n" + "Department :" + res[i].name + "\n" + "Salary: $" + res[i].salary);
                            console.log("-----------------------");
                        }
                    }

                    start();

                });

            });
    });



}
//to view employee with depatment and salary************************************** EMPLOYEE WITH DEPARTMENT AND SALARY *******************************************
function employeeDepartmentAll() {
    var query = `SELECT employee.first_name as "First Name", employee.last_name as "Last Name",department.name as "Department",role.salary as "Salary/Week" FROM employee
                JOIN role
                ON employee.role_id=role.id
                JOIN department
                ON role.department_id=department.id;`
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });

}

///employe with manager************************************** employe with manager *******************************************
function employeeMangaer() {
    var query = `SELECT e.id as "Employee Id" , e.first_name as "First Name", e.last_name as "Last Name", e.role_id as "Role ID", m.first_name as Manager
    FROM employee e
    LEFT JOIN employee m
     
    ON e.manager_id=m.id`
    connection.query(query, function (err, res) {
        if (err) throw err;

        console.log(" All data of EMPLOYEE By Manager...\n");
        console.table(res);

        start();

    });
}










//function for add employee 
function addEmployee() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "first Name"
        },
        {
            name: "last_name",
            type: "input",
            message: "Last Name",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The Last Name";
                }
            }
        },
        {
            name: "role_id",
            type: "input",
            message: "role id",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {//isNaN("Alex")===true
                    return true;
                }
                return false;
            }
        },
        {
            name: "manager_id",
            type: "input",
            message: "Report To(Put Your Manager ID)",
            validate: function (value) {
                if (isNaN(value) == false) {
                    return true;
                }
                return false;
            }

        }

        ]).then(function (answer) {

            var query = "INSERT INTO employee SET ? ";
            connection.query(query,
                {
                    first_name: answer.first_name,
                    last_name: answer.last_name,
                    role_id: answer.role_id,
                    manager_id: answer.manager_id
                },
                function (err, res) {
                    if (err) throw err;
                    //readProducts() ;
                    console.log(answer.first_name, "new employee added....\n");

                    start();


                }


            );
        });
}

//remove employee 

function removeEmployee() {
    inquirer
        .prompt({
            name: "delete",
            type: "list",
            message: "Remove Employee By",
            choices: [
                "First Name",
                "Last Name",
                "Role Id"

            ]

        }).then(function (answer) {
            switch (answer.delete) {

                case "First Name":
                    removeFirstname();
                    break;
                case "Last Name":
                    removeLastName();
                    break;
                case "Role Id":
                    removeRoleId();
                    break;

            }
        });

}
//delete by first name ************************************** REMOVE BY FIRST NAME *******************************************
function removeFirstname() {
    inquirer
        .prompt({
            name: "first_name",
            type: "input",
            message: "Write First Name",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The First Name";
                }
            }

        }).then(function (answer) {
            console.log(answer);
            connection.query("DELETE FROM employee WHERE?", { first_name: answer.first_name },
                function (err, res) {
                    if (err) throw err;
                    console.log(" employee deleted!\n");
                    console.log("-----------------------------")
                    start();



                });

        });
}
//delete by last name;************************************** REMOVE BY LAST NAME *******************************************
function removeLastName() {
    inquirer
        .prompt({
            name: "last_name",
            type: "input",
            message: "Write Last Name",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The Last Name";
                }
            }
        }).then(function (answer) {
            connection.query("DELETE FROM employee WHERE?", { last_name: answer.last_name },
                function (err, res) {
                    if (err) throw err;
                    console.log(" employee deleted!\n");
                    console.log("-----------------------------")
                    start();



                });

        });
}
//delete by role id ************************************** REMOVE BY ROLE ID *******************************************
function removeRoleId() {
    inquirer
        .prompt({
            name: "role_id",
            type: "input",
            message: "Write Role Id No",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }).then(function (answer) {
            connection.query("DELETE FROM employee WHERE?", { role_id: answer.role_id },
                function (err, res) {
                    if (err) throw err;
                    console.log(" employee deleted!\n");
                    console.log("-----------------------------")
                    start();

                });

        });
}
//add department ************************************** ADD DEPARTMENT *******************************************
function addDepartment() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Department Id No",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "department",
            type: "input",
            message: "Write Department name to Write",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The Department Name";
                }
            }
        }])
        .then(function (answer) {
            var query = "INSERT into department SET ?"
            connection.query(query, { id: answer.id, name: answer.department }, function (err, res) {
                if (err) throw err;
                console.log("given Depatment added with its id");
                console.log("------------------------------------")
                start();
            });

        });
}
//add role ************************************** ADD ROLE *******************************************
function addRole() {
    inquirer
        .prompt([{
            name: "id",
            type: "input",
            message: "Role Id No",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        },
        {
            name: "title",
            type: "input",
            message: "Title of employee",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The Title ";
                }
            }
        },
        {
            name: "salary",
            type: "input",
            message: "salary of Employee",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        },
        {
            name: "department_id",
            type: "input",
            message: "Write Department ID",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        }


        ]).then(function (answer) {
            var query = "INSERT INTO role SET ?";
            connection.query(query, { id: answer.id, title: answer.title, salary: answer.salary, department_id: answer.department_id },
                function (err, res) {
                    if (err) throw err;
                    console.log("New Role is added ");
                    console.log("-----------------------");
                    start();
                });
        });

}
// **************************** each employee ************************************** EACH EMPLOYEE *******************************************

function employee() {

    connection.query("SELECT * FROM employee", function (err, res) {
        //console.table(res);
        if (err) throw err;
        inquirer
            .prompt([{
                name: "choice",
                type: "rawlist",
                choices: function () {
                    var choiceArray = [];
                    for (var i = 0; i < res.length; i++) {
                        choiceArray.push(res[i].first_name);
                    }
                    return choiceArray;

                },
                message: "list of employee"


            }]).then(function (answer) {
                console.log(answer);
                var query = "SELECT id as 'Employee ID', first_name as 'First Name',last_name as'Last Name', role_id as 'Role ID',manager_id as 'Report To' FROM employee WHERE ?";
                connection.query(query, [{ first_name: answer.choice }], function (err, res) {
                    if (err) throw err;
                    console.table(res);

                    start();

                });



            });



    });
}

//for all emloyee ************************************** ALL EMPLOYEE *******************************************
function employeeAll() {

    connection.query("SELECT * FROM employee", function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
    });
}




///update employee ************************************** UPDATE EMPLOYEE *******************************************
function updateEmployee() {
    inquirer
        .prompt({
            name: "update",
            type: "list",
            message: "Update Employee By",
            choices: [
                "First Name",
                "Last Name",
                "Update Role"

            ]

        }).then(function (answer) {
            switch (answer.update) {

                case "First Name":
                    updateFirstname();
                    break;
                case "Last Name":
                    updateLastName();
                    break;
                case "Update Role":
                    updateRole();
                    break;

            }
        });

}
//update firstname ************************************** UPDATE FIRST NAME *******************************************
function updateFirstname() {
    inquirer
        .prompt([{
            name: "first_name",
            type: "input",
            message: "Update First Name",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The First Name";
                }
            }
        },
        {
            name: "id",
            type: "input",
            message: "Are you sure! put the 'ID' of employee",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {//isNaN("suraj")===true
                    return true;
                }
                return false;
            }


        }


        ]).then(function (answer) {
            var query = "UPDATE employee SET? WHERE ?";
            connection.query(query, [{ first_name: answer.first_name }, { id: answer.id }],
                function (err, res) {

                    if (err) throw err;
                    console.log("Given employee is Updated")
                    console.log(res.message);
                    start();


                });



        });



}

//update last name ************************************** UPDATE LAST NAME *******************************************
function updateLastName() {
    inquirer
        .prompt([{
            name: "last_name",
            type: "input",
            message: "Update Last Name",
            validate: function validateName(name) {
                if (name !== '') {
                    return true;
                } else {
                    return "Enter The Last Name";
                }
            }
        },
        {
            name: "id",
            type: "input",
            message: "Are you sure! put the 'ID' of employee",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {//isNaN("suraj")===true
                    return true;
                }
                return false;
            }

        }

        ]).then(function (answer) {
            var query = "UPDATE employee SET? WHERE ?";
            connection.query(query, [{ last_name: answer.last_name }, { id: answer.id }],
                function (err, res) {
                    if (err) throw err;
                    console.log(res.message);
                    console.log("Employee is UPDATE");
                    start();

                });


        });



}

//update role of employee ************************************** UPDATE ROLE *******************************************
function updateRole() {
    inquirer
        .prompt([{
            name: "role_id",
            type: "input",
            message: "Update Role of Employee",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }

        },
        {
            name: "id",
            type: "input",
            message: "Are you sure! put the 'ID' of employee",
            validate: function (value) {
                if (value !== '' && isNaN(value) === false) {
                    return true;
                }
                return false;
            }
        }


        ]).then(function (answer) {
            var query = "UPDATE employee SET? WHERE ?";
            connection.query(query, [{ role_id: answer.role_id }, { id: answer.id }],
                function (err, res) {

                    if (err) throw err;
                    console.log("Employee Role is Updated")
                    start();
                });


        });



}

///total budget by department

function budgetTotal() {
    query = "SELECT d.name AS 'DepartMent Name', sum(r.salary) AS 'Total Budget', count(r.salary) AS 'Total Employees' FROM employee e, role r, department d WHERE e.role_id = r.id AND r.department_id = d.id GROUP BY r.department_id";
    connection.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
        start();
       
    })
   
}


