const express = require('express');
const { engine } = require('express-handlebars'); // Importar el motor de plantillas
const socketIo = require('socket.io');
const http = require('http');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// Configuración de Handlebars
app.engine('handlebars', engine({
    layoutsDir: __dirname + '/views/layouts',
    defaultLayout: 'main'
}));
app.set('view engine', 'handlebars');

// Datos de ejemplo para productos
let productos = [
    { id: 1, title: "Producto 1", price: 100 },
    { id: 2, title: "Producto 2", price: 200 },
    // Otros productos...
];

// Ruta raíz
app.get('/', (req, res) => {
    res.render('index', { title: 'Lista de Productos', products: productos });
});

// Ruta para productos en tiempo real
app.get('/realtimeproducts', (req, res) => {
    res.render('realTimeProducts', { title: 'Productos en Tiempo Real', products: productos });
});

// Configuración de WebSocket
io.on('connection', (socket) => {
    console.log('Cliente conectado');

    // Emitir la lista de productos a los clientes conectados
    socket.emit('productUpdate', productos);

    // Lógica para agregar o eliminar productos (ejemplo básico)
    socket.on('addProduct', (product) => {
        productos.push(product);
        io.emit('productUpdate', productos); // Emitir la actualización a todos los clientes
    });

    socket.on('removeProduct', (id) => {
        productos = productos.filter(product => product.id !== id);
        io.emit('productUpdate', productos); // Emitir la actualización a todos los clientes
    });
});

// Levanta el servidor
const PORT = 8080;
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
