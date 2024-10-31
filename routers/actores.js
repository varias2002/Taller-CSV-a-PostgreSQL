const { Router } = require('express');
const router = Router();
const { getActores, getActorById, insertActor, updateActor,deleteActor } = require('../controllers/actores');
//rutas de endpoint para la tabla actores
router.get('/actores', getActores);
router.get('/actor/:id', getActorById);
router.post('/actor', insertActor);
router.delete('/actor/:id', deleteActor);
router.put('/actor/:id', updateActor);

module.exports = router;


  