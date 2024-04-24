

INSERT INTO department (name) VALUES
    ('Engineering'),
    ('Finance'),
    ('Legal'),
    ('Sales');


INSERT INTO role (title, department_id, salary) VALUES
    ('Lead Engineer', 1, 150000),
    ('Software Engineer', 1, 120000),
    ('Account Manaager', 2, 160000),
    ('Accountant', 2, 1250000),
    ('Legal Team Lead', 3, 250000),
    ('Lawyer', 3, 190000),
    ('Sales Lead', 4, 100000),
    ('Salesperson', 4, 80000);


INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
    ('John', 'Doe', 1, NULL),
    ('Jane', 'Doe', 2, NULL),
    ('Billy', 'Smith', 4, NULL),
    ('Bob', 'Jankins', 1, 1),
    ('Emily', 'Johnson', 2, 2),
    ('Sarah', 'Davis', 3, 3),
    ('David', 'Taylor', 4, 4),
    ('Amanda', 'Moore', 3, NULL);

