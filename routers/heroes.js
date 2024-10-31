const { Router } = require('express');
const router = Router();
const { getHeroes, getHeroeById, insertHeroe, updateHeroe, deleteHeroe } = require('../controllers/heroes');

// Rutas de endpoint para la tabla heroes
router.get('/heroes', getHeroes);
router.get('/heroe/:id', getHeroeById);
router.post('/heroe', insertHeroe);
router.delete('/heroe/:id', deleteHeroe);
router.put('/heroe/:id', updateHeroe);

module.exports = router;
