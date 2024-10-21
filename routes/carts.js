const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta del archivo de carritos
const cartsFilePath = './carrito.json';
const productsFilePath = './productos.json';

// Función para leer los carritos desde el archivo JSON
const readCartsFile = () => {
  const data = fs.readFileSync(cartsFilePath, 'utf-8');
  return JSON.parse(data || '[]');
};

// Función para escribir carritos en el archivo JSON
const writeCartsFile = (data) => {
  fs.writeFileSync(cartsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Leer los productos
const readProductsFile = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data || '[]');
};

// Crear un nuevo carrito
router.post('/', (req, res) => {
  const carts = readCartsFile();
  const newCart = {
    id: carts.length + 1, // Generar un ID único
    products: []
  };
  carts.push(newCart);
  writeCartsFile(carts);
  res.status(201).json(newCart);
});

// Obtener productos de un carrito por ID
router.get('/:cid', (req, res) => {
  const carts = readCartsFile();
  const cart = carts.find(c => c.id == req.params.cid);
  if (!cart) {
    return res.status(404).send('Carrito no encontrado');
  }
  res.json(cart.products);
});

// Agregar un producto a un carrito
router.post('/:cid/product/:pid', (req, res) => {
  let carts = readCartsFile();
  let products = readProductsFile();
  const cart = carts.find(c => c.id == req.params.cid);
  const product = products.find(p => p.id == req.params.pid);

  if (!cart) {
    return res.status(404).send('Carrito no encontrado');
  }

  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }

  const existingProduct = cart.products.find(p => p.product == req.params.pid);
  if (existingProduct) {
    // Si el producto ya existe en el carrito, incrementar la cantidad
    existingProduct.quantity += 1;
  } else {
    // Si el producto no existe, agregarlo al carrito
    cart.products.push({ product: req.params.pid, quantity: 1 });
  }

  writeCartsFile(carts);
  res.json(cart);
});

module.exports = router;
