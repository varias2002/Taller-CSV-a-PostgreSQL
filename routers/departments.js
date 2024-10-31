const { Router } = require('express');
const router = Router();
const {getDepartments, getDepartmentById, insertDepartment, updateDepartment, deleteDepartment,importDepartments } = require('../controllers/departments');
const multer = require('multer');
// Configuración de multer para subir archivos
const upload = multer({ dest: 'uploads/' });
//rutas de endpoint para la tabla actores
router.get('/departments', getDepartments);
router.get('/departments/:id', getDepartmentById);
router.post('/departments', insertDepartment);
router.delete('/departments/:id', deleteDepartment );
router.put('/departments/:id',  updateDepartment );
router.post('/departments/import', upload.single('file'), importDepartments);
module.exports = router;


