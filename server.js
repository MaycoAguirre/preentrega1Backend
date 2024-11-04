const express = require('express');
const { Server } = require('socket.io');
const handlebars = require('express-handlebars');
const path = require('path');

const app = express();
const httpServer = app.listen(8080, () => console.log('Servidor escuchando en puerto 8080'));
const io = new Server(httpServer);

// Configurar Handlebars
app.engine('handlebars', handlebars.engine());
app.set('view engine', 'handlebars');
app.set('views', path.join(__dirname, 'views'));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Array de productos
let productos = [];

// Ruta para la vista estática de productos
app.get('/', (req, res) => {
  res.render('home', { productos });
});

// Ruta para la vista en tiempo real de productos
app.get('/realtimeproducts', (req, res) => {
  res.render('realTimeProducts', { productos });
});

// Ruta POST para agregar productos
app.post('/api/products', (req, res) => {
  const nuevoProducto = { id: Date.now(), ...req.body };
  productos.push(nuevoProducto);
  io.emit('updateProducts', productos);  // Actualiza la lista en tiempo real
  res.redirect('/realtimeproducts');     // Redirige a la vista de productos en tiempo real
});

// Ruta DELETE para eliminar un producto por ID
app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  productos = productos.filter(prod => prod.id !== parseInt(id));
  io.emit('updateProducts', productos);  // Actualiza la lista en tiempo real
  res.sendStatus(200);
});

// Configuración de Socket.io
io.on('connection', (socket) => {
  console.log('Nuevo cliente conectado');
  socket.emit('updateProducts', productos);  // Envía la lista de productos al cliente al conectarse
});
