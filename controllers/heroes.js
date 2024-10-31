const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'utm123',
    database: 'heroe',
    port: '5432'
});

// Endpoint para devolver todos los héroes
async function getHeroes(req, res) {
    try {
        const result = await pool.query('SELECT * FROM heroes');
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para devolver héroe por id
async function getHeroeById(req, res) {
    const { id } = req.params;
    const query = 'SELECT * FROM heroes WHERE id = $1';
    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(400).json({ error: 'No existe el héroe' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para insertar un nuevo héroe
async function insertHeroe(req, res) {
    const { nombre, bio, img, aparicion, casa } = req.body;
    const query = `
        INSERT INTO heroes (nombre, bio, img, aparicion, casa) 
        VALUES ($1, $2, $3, $4, $5) RETURNING *`;
    try {
        const result = await pool.query(query, [nombre, bio, img, aparicion, casa]);
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para actualizar un héroe
async function updateHeroe(req, res) {
    const { id } = req.params;
    const { nombre, bio, img, aparicion, casa } = req.body;

    // Crear una consulta dinámica basada en los campos proporcionados
    let query = 'UPDATE heroes SET';
    const values = [];
    let index = 1;

    if (nombre) {
        query += ` nombre = $${index},`;
        values.push(nombre);
        index++;
    }
    if (bio) {
        query += ` bio = $${index},`;
        values.push(bio);
        index++;
    }
    if (img) {
        query += ` img = $${index},`;
        values.push(img);
        index++;
    }
    if (aparicion) {
        query += ` aparicion = $${index},`;
        values.push(aparicion);
        index++;
    }
    if (casa) {
        query += ` casa = $${index},`;
        values.push(casa);
        index++;
    }

    // Eliminar la última coma y agregar la cláusula WHERE
    query = query.slice(0, -1);
    query += ` WHERE id = $${index} RETURNING *`;
    values.push(id);

    try {
        const result = await pool.query(query, values);
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(400).json({ error: 'No existe el héroe' });
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// Endpoint para eliminar un héroe
async function deleteHeroe(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM heroes WHERE id = $1 RETURNING *';
    try {
        const result = await pool.query(query, [id]);
        if (result.rowCount > 0) {
            res.json({ message: 'Héroe eliminado exitosamente' });
        } else {
            res.status(400).json({ error: 'No existe el héroe' });
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = { getHeroes, getHeroeById, insertHeroe, updateHeroe, deleteHeroe };
