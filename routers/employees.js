const { Router } = require('express');
const router = Router();
const {getEmployees, getEmployeeById, insertEmployee, updateEmployee, deleteEmployee } = require('../controllers/employees');
//rutas de endpoint para la tabla actores
router.get('/employees', getEmployees);
router.get('/employees/:id', getEmployeeById);
router.post('/employees', insertEmployee);
router.delete('/employees/:id', deleteEmployee);
router.put('/employees/:id', updateEmployee);

module.exports = router;


  