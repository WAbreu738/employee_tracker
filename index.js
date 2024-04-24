require('console.table')
const inquirer = require('inquirer')


const { Client } = require('pg')
const client = new Client({
    user: 'postgres',
    host: 'localhost',
    database: 'employee_db',
    password: 'pass',
    port: 5432
})

//Connect to PostgreSQL database
client.connect() 

//Displays the main menu and handles user selection
async function init() {
    try {
        const prompt = await inquirer.prompt({
            name: 'choice',
            type: 'list',
            message: 'What would you like to do?',
            choices: [
                'View All Employees',
                'Add Employee',
                'Update Employee Role',
                'View All Roles',
                'Add Role',
                'View All Departments',
                'Add Department',
                'Exit'
            ]
        })

        switch (prompt.choice) {
            case 'View All Employees':
                await viewAllEmployees()
                break

            case 'Add Employee':
                await addEmployee()
                break

            case 'Update Employee Role':
                await updateEmployeeRole()
                break

            case 'View All Roles':
                await viewAllRoles()
                break

            case 'Add Role':
                await addRole()
                break

            case 'View All Departments':
                await viewAllDepartments()
                break

            case 'Add Department':
                await addDepartment()
                break

            case 'Exit':
                console.log('Exiting...')
                process.exit(0)
                break

            default:
                break;
        }
    } catch (err) {
        console.log(err)

    } finally {
        client.end()
    }
}

async function viewAllEmployees() {
    try {
        //Inserts Role Names and Manager Names into the table
        const query = `
            SELECT 
                employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title AS role_name, 
                CONCAT(manager.first_name, ' ', manager.last_name) AS manager_name
            FROM 
                employee 
                LEFT JOIN role ON employee.role_id = role.id 
                LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
        `;
        const results = await client.query(query)
        console.table(results.rows)
        await init()
    } catch (error) {
        console.error(error)
    }
}

//Adds a new employee to the database
async function addEmployee() {
    try {
        const roleQuery = await client.query("SELECT id, title FROM role");
        const roleChoices = roleQuery.rows.map(role => ({
            value: role.id,
            name: role.title
        }))

        const employeeQuery = await client.query("SELECT id, first_name, last_name FROM employee");
        const employeeChoices = employeeQuery.rows.map(employee => ({
            value: employee.id,
            name: `${employee.first_name} ${employee.last_name}`
        }))

        // Prompts the user for details about the employee
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'first_name',
                message: 'Enter the first name of the employee:'
            },
            {
                type: 'input',
                name: 'last_name',
                message: 'Enter the last name of the employee:'
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the role for the employee:',
                choices: roleChoices
            },
            {
                type: 'list',
                name: 'manager_id',
                message: 'Select the manager for the employee:',
                choices: [{ value: null, name: 'None' }, ...employeeChoices]
            }
        ])

        //Insert new employee
        await client.query(
            "INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4)",
            [answers.first_name, answers.last_name, answers.role_id, answers.manager_id]
        )

        console.log("Employee added successfully!");
        await init()
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Updates an employee's role in the database
async function updateEmployeeRole() {
    try {
        const employeeQuery = await client.query("SELECT id, first_name, last_name FROM employee");
        const employeeChoices = employeeQuery.rows.map(employee => ({
            value: employee.id,
            name: `${employee.first_name} ${employee.last_name}`
        }))

        const roleQuery = await client.query("SELECT id, title FROM role");
        const roleChoices = roleQuery.rows.map(role => ({
            value: role.id,
            name: role.title
        }))

        // Prompt User to select an employee and update their role
        const answers = await inquirer.prompt([
            {
                type: 'list',
                name: 'employee_id',
                message: 'Select the employee to update:',
                choices: employeeChoices
            },
            {
                type: 'list',
                name: 'role_id',
                message: 'Select the new role for the employee:',
                choices: roleChoices
            }
        ])

        //Update's role
        await client.query(
            "UPDATE employee SET role_id = $1 WHERE id = $2",
            [answers.role_id, answers.employee_id]
        );

        console.log("Employee role updated successfully!");
        await init() 
    } catch (error) {
        console.error("An error occurred:", error);
    }
}

// Displays all roles within the database
async function viewAllRoles() {
    try {
        const roleQuery = `
            SELECT role.id, role.title, department.name AS department_name, role.salary 
            FROM role
            JOIN department ON role.department_id = department.id
        `
        const results = await client.query(roleQuery)
        console.table(results.rows)
        await init()
    } catch (error) {
        console.log(err)
    }
}

// Adds new role to the database
async function addRole() {
    try {
       
        const departmentQuery = await client.query("SELECT id, name FROM department");
        const departmentChoices = departmentQuery.rows.map(department => ({
            value: department.id,
            name: department.name
        }))

        // Prompts the user for role details
        const answers = await inquirer.prompt([
            {
                type: 'input',
                name: 'title',
                message: 'Enter the title of the role:'
            },
            {
                type: 'input',
                name: 'salary',
                message: 'Enter the salary for the role:'
            },
            {
                type: 'list',
                name: 'department_id',
                message: 'Select the department for the role:',
                choices: departmentChoices
            }
        ])

        // Insert new role
        await client.query(
            "INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3)",
            [answers.title, answers.salary, answers.department_id]
        )

        console.log("Role added successfully!")
        await init()
    } catch (error) {
        console.error("An error occurred:", error)
    }
}

// Displays all roles within the database
async function viewAllDepartments() {
    try {
        const results = await client.query('SELECT * FROM department')
        console.table(results.rows)
        await init()
    } catch (error) {
        console.log(err)
    }
}

// Adds a new department to the database
async function addDepartment() {
    try {
        const answer = await inquirer.prompt([
            {
                type: 'input',
                name: 'department_name',
                message: 'What is the name of the department?',
            }
        ])

        // Insert new department
        await client.query(
            "INSERT INTO department (name) VALUES ($1)",
            [answer.department_name]
        )
        console.log("Department has been added!")
        await init()
    } catch (error) {
        console.error("An error occurred:", error)
    }
}

init()

