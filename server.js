const express = require('express');
const app = express();

// Importar los routers
const productsRouter = require('./routes/products');
const cartsRouter = require('./routes/carts');

// Middleware para parsear JSON
app.use(express.json());

// Conectar los routers
app.use('/api/products', productsRouter);
app.use('/api/carts', cartsRouter);

// Escuchar en el puerto 8080
app.listen(8080, () => {
  console.log('Servidor corriendo en http://localhost:8080');
});
