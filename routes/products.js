const express = require('express');
const router = express.Router();
const fs = require('fs');

// Ruta del archivo de productos
const productsFilePath = './productos.json';

// Función para leer los productos desde el archivo JSON
const readProductsFile = () => {
  const data = fs.readFileSync(productsFilePath, 'utf-8');
  return JSON.parse(data || '[]');
};

// Función para escribir productos en el archivo JSON
const writeProductsFile = (data) => {
  fs.writeFileSync(productsFilePath, JSON.stringify(data, null, 2), 'utf-8');
};

// Obtener todos los productos (con límite opcional ?limit)
router.get('/', (req, res) => {
  const products = readProductsFile();
  const limit = parseInt(req.query.limit);
  if (limit) {
    return res.json(products.slice(0, limit));
  }
  res.json(products);
});

// Obtener un producto por ID
router.get('/:pid', (req, res) => {
  const products = readProductsFile();
  const product = products.find(p => p.id == req.params.pid);
  if (!product) {
    return res.status(404).send('Producto no encontrado');
  }
  res.json(product);
});

// Agregar un nuevo producto
router.post('/', (req, res) => {
  const products = readProductsFile();
  const newProduct = {
    id: products.length + 1, // Generación de ID único
    ...req.body,
    status: req.body.status !== undefined ? req.body.status : true
  };
  products.push(newProduct);
  writeProductsFile(products);
  res.status(201).json(newProduct);
});

// Actualizar un producto por ID
router.put('/:pid', (req, res) => {
  let products = readProductsFile();
  const index = products.findIndex(p => p.id == req.params.pid);
  if (index === -1) {
    return res.status(404).send('Producto no encontrado');
  }

  const updatedProduct = { ...products[index], ...req.body, id: products[index].id };
  products[index] = updatedProduct;
  writeProductsFile(products);
  res.json(updatedProduct);
});

// Eliminar un producto por ID
router.delete('/:pid', (req, res) => {
  let products = readProductsFile();
  const newProducts = products.filter(p => p.id != req.params.pid);
  if (newProducts.length === products.length) {
    return res.status(404).send('Producto no encontrado');
  }
  writeProductsFile(newProducts);
  res.send('Producto eliminado');
});

module.exports = router;
