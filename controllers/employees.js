const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'utm123',
    database: 'HR',
    port: '5432'
});

// Endpoint para devolver todos los empleados
async function getEmployees(req, res) {
    try {
        const client = await pool.connect();
        const result = await client.query('SELECT * FROM employees');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.error('Error en getEmployees:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para devolver un empleado por ID
async function getEmployeeById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM employees WHERE employee_id = $1';
    try {
        const client = await pool.connect();
        const result = await client.query(query, [id]);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (err) {
        console.error('Error en getEmployeeById:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para insertar un nuevo empleado
async function insertEmployee(req, res) {
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;
    const query = `
        INSERT INTO employees (first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id) 
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *`;
    const values = [first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct || null, manager_id || null, department_id || null];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error en insertEmployee:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para actualizar un empleado
async function updateEmployee(req, res) {
    const { id } = req.params;
    const { first_name, last_name, email, phone_number, hire_date, job_id, salary, commission_pct, manager_id, department_id } = req.body;

    let query = 'UPDATE employees SET';
    const values = [];
    let index = 1;

    if (first_name) {
        query += ` first_name = $${index},`;
        values.push(first_name);
        index++;
    }
    if (last_name) {
        query += ` last_name = $${index},`;
        values.push(last_name);
        index++;
    }
    if (email) {
        query += ` email = $${index},`;
        values.push(email);
        index++;
    }
    if (phone_number) {
        query += ` phone_number = $${index},`;
        values.push(phone_number);
        index++;
    }
    if (hire_date) {
        query += ` hire_date = $${index},`;
        values.push(hire_date);
        index++;
    }
    if (job_id) {
        query += ` job_id = $${index},`;
        values.push(job_id);
        index++;
    }
    if (salary) {
        query += ` salary = $${index},`;
        values.push(salary);
        index++;
    }
    if (commission_pct) {
        query += ` commission_pct = $${index},`;
        values.push(commission_pct);
        index++;
    }
    if (manager_id) {
        query += ` manager_id = $${index},`;
        values.push(manager_id);
        index++;
    }
    if (department_id) {
        query += ` department_id = $${index},`;
        values.push(department_id);
        index++;
    }

    query = query.slice(0, -1); // Eliminar la última coma
    query += ` WHERE employee_id = $${index} RETURNING *`;
    values.push(id);

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (err) {
        console.error('Error en updateEmployee:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para eliminar un empleado
async function deleteEmployee(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM employees WHERE employee_id = $1 RETURNING *';
    try {
        const client = await pool.connect();
        const result = await client.query(query, [id]);
        client.release();
        if (result.rowCount > 0) {
            res.json({ message: 'Empleado eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Empleado no encontrado' });
        }
    } catch (err) {
        console.error('Error en deleteEmployee:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = { getEmployees, getEmployeeById, insertEmployee, updateEmployee, deleteEmployee };
