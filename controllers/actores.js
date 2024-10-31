const { Pool } = require('pg');

const pool = new Pool({
    host: '127.0.0.1',
    user: 'postgres',
    password: 'utm123',
    database: 'HOLLYWOOD',
    port: '5432'
});

//endpoint para devolver todos los actores
async function getActores(req, res) {
    try {
        const client = await pool.connect();
        console.log('conexion exitosa');
        const result = await pool.query('select * from actores');
        client.release();
        res.json(result.rows);
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

//endpoint para devolver actor por id
async function getActorById(req, res) {
    const { id } = req.params;
    const query = 'select * from actores where cod_act = $1';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await pool.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows);
        } else {
            res.status(400).json({ error: 'No existe el actor...!' });
        }
    } catch (err) {
        console.log(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

// endpoint para insertar un nuevo actor
async function insertActor(req, res) {
    const { cod_act, nom_act, nom_rea_act, fec_nac_act, fec_mue_act, naciona_act } = req.body;
    const query = `
        INSERT INTO actores (cod_act, nom_act, nom_rea_act, fec_nac_act, fec_mue_act, naciona_act) 
        VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`;
    const values = [cod_act, nom_act, nom_rea_act, fec_nac_act, fec_mue_act || null, naciona_act || 'Desconocido'];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}


//endpoint para actualizar un actor
async function updateActor(req, res) {
    const { id } = req.params;
    const { nom_act, nom_rea_act, fec_nac_act, fec_mue_act, naciona_act } = req.body;

    // Crear una consulta dinámica basada en los campos proporcionados
    let query = 'UPDATE actores SET';
    const values = [];
    let index = 1;

    if (nom_act) {
        query += ` nom_act = $${index},`;
        values.push(nom_act);
        index++;
    }
    if (nom_rea_act) {
        query += ` nom_rea_act = $${index},`;
        values.push(nom_rea_act);
        index++;
    }
    if (fec_nac_act) {
        query += ` fec_nac_act = $${index},`;
        values.push(fec_nac_act);
        index++;
    }
    if (fec_mue_act) {
        query += ` fec_mue_act = $${index},`;
        values.push(fec_mue_act);
        index++;
    }
    if (naciona_act) {
        query += ` naciona_act = $${index},`;
        values.push(naciona_act);
        index++;
    }

    // Eliminar la última coma y agregar la cláusula WHERE
    query = query.slice(0, -1);
    query += ` WHERE cod_act = $${index} RETURNING *`;
    values.push(id);

    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json(result.rows[0]);
        } else {
            res.status(400).json({ error: 'No existe el actor...!' });
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

//endpoint para eliminar un actor
async function deleteActor(req, res) {
    const { id } = req.params;
    const query = 'DELETE FROM actores WHERE cod_act = $1 RETURNING *';
    const values = [id];
    try {
        const client = await pool.connect();
        const result = await client.query(query, values);
        client.release();
        if (result.rowCount > 0) {
            res.json({ message: 'Actor eliminado exitosamente' });
        } else {
            res.status(400).json({ error: 'No existe el actor...!' });
        }
    } catch (err) {
        console.error('Error en el servidor:', err);
        res.status(500).json({ error: 'Error en el servidor' });
    }
}

module.exports = { getActores, getActorById, insertActor, updateActor, deleteActor };

