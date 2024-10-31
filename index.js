const express = require('express');
const path = require('path');
const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Rutas
app.use(require('./routers/actores'));
app.use(require('./routers/heroes'));
app.use(require('./routers/employees'));
app.use(require('./routers/departments'));
// Ruta principal
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'indexheroe.html'));
});

app.listen(3000, () => {
    console.log('Server up localhost:3000');
});
