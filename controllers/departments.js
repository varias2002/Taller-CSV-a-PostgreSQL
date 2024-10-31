const { Pool } = require('pg');
const { Parser } = require('json2csv');
const multer = require('multer');
const csvParser = require('csv-parser');
const fs = require('fs');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'utm123',
    database: 'HR',
    port: '5432'
});

// Endpoint para devolver todos los departamentos y descargar como CSV
    async function getDepartments(req, res) {
        try {
            const client = await pool.connect();
            const result = await client.query('SELECT * FROM departments');
            client.release();
    
            // Verifica si el usuario ha solicitado la descarga en CSV
            if (req.query.download === 'csv') {
                // Convertir resultado a CSV
                const json2csvParser = new Parser();
                const csv = json2csvParser.parse(result.rows);
    
                // Configurar encabezados para descargar el archivo como CSV
                res.header('Content-Type', 'text/csv');
                res.attachment('departments.csv');
                return res.send(csv); // Devuelve el archivo CSV
            }
    

            res.json(result.rows);
    
        } catch (err) {
            console.error('Error en getDepartments:', err);
            res.status(500).json({ error: 'Error en el servidor' });
        }
    }
    
    
    // Endpoint para importar datos desde un archivo CSV
async function importDepartments(req, res) {
    const filePath = req.file.path; // Ruta del archivo subido temporalmente

    const departments = []; // Array para almacenar los datos del CSV


    fs.createReadStream(filePath)
        .pipe(csvParser())
        .on('data', (row) => {
        
            departments.push(row);
        })
        .on('end', async () => {
            try {
                const client = await pool.connect();

                for (const dept of departments) {
                    const { department_name, manager_id, location_id } = dept;
                    await client.query(
                        'INSERT INTO departments (department_name, manager_id, location_id) VALUES ($1, $2, $3)',
                        [department_name, manager_id, location_id]
                    );
                }
                
                client.release();
                fs.unlinkSync(filePath); 
                res.status(201).json({ message: 'Datos importados exitosamente' });
                
            } catch (err) {
                console.error('Error al importar datos:', err);
                res.status(500).json({ error: 'Error en el servidor' });
            }
        })
        .on('error', (err) => {
            console.error('Error al leer el archivo CSV:', err);
            res.status(500).json({ error: 'Error al procesar el archivo CSV' });
        });
}




// Endpoint para devolver un departamento por ID
async function getDepartmentById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM departments WHERE department_id = $1';
    try {
        const client = await pool.connect();
        const result = await client.query(query, [id]);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (err) {
        console.error('Error en getDepartmentById:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para insertar un nuevo departamento
async function insertDepartment(req, res) {
    const { department_name, manager_id } = req.body;
    const query = `
        INSERT INTO departments (department_name, manager_id) 
        VALUES ($1, $2) RETURNING *`;
    const values = [department_name, manager_id || null];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error('Error en insertDepartment:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para actualizar un departamento
async function updateDepartment(req, res) {
    const { id } = req.params;
    const { department_name, manager_id } = req.body;

    let query = 'UPDATE departments SET';
    const values = [];
    let index = 1;

    if (department_name) {
        query += ` department_name = $${index},`;
        values.push(department_name);
        index++;
    }
    if (manager_id) {
        query += ` manager_id = $${index},`;
        values.push(manager_id);
        index++;
    }

    query = query.slice(0, -1); // Eliminar la última coma
    query += ` WHERE department_id = $${index} RETURNING *`;
    values.push(id);

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (err) {
        console.error('Error en updateDepartment:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para eliminar un departamento
async function deleteDepartment(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM departments WHERE department_id = $1 RETURNING *';
    try {
        const client = await pool.connect();
        const result = await client.query(query, [id]);
        client.release();
        if (result.rowCount > 0) {
            res.json({ message: 'Departamento eliminado exitosamente' });
        } else {
            res.status(404).json({ error: 'Departamento no encontrado' });
        }
    } catch (err) {
        console.error('Error en deleteDepartment:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = { getDepartments, getDepartmentById, insertDepartment, updateDepartment, deleteDepartment,importDepartments };
