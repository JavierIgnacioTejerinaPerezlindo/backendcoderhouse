const fs = require('fs');

class ProductManager {
  constructor(path) {
    this.path = path;
  }

  #getNextId() {
    let products = this.getProducts();
    let lastProduct = products[products.length - 1];
    return lastProduct ? lastProduct.id + 1 : 1;
  }

  addProduct({ title, description, price, thumbnail, code, stock }) {
    let products = this.getProducts();
    let newProduct = {
      id: this.#getNextId(),
      title,
      description,
      price,
      thumbnail,
      code,
      stock,
    };
    products.push(newProduct);
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    return newProduct;
  }

  getProducts() {
    if (!fs.existsSync(this.path)) {
      return [];
    }
    let products = fs.readFileSync(this.path);
    return JSON.parse(products);
  }

  getProductById(id) {
    let products = this.getProducts();
    return products.find((product) => product.id === id);
  }

  updateProduct(id, productData) {
    let products = this.getProducts();
    let index = products.findIndex((product) => product.id === id);
    if (index === -1) {
      return false;
    }
    products[index] = { id, ...productData };
    fs.writeFileSync(this.path, JSON.stringify(products, null, 2));
    return true;
  }

  deleteProduct(id) {
    let products = this.getProducts();
    let filteredProducts = products.filter((product) => product.id !== id);
    fs.writeFileSync(this.path, JSON.stringify(filteredProducts, null, 2));
    return filteredProducts.length !== products.length;
  }
}

const productManager = new ProductManager('products.json');

productManager.addProduct({
  title: 'tafirol 500',
  description: 'paracetamol 500mg',
  price: 10,
  thumbnail: 'tafirol.jpg',
  code: 'p1',
  stock: 5,
});

console.log(productManager.getProducts());

console.log(productManager.getProductById(1));

console.log(productManager.updateProduct(1, { stock: 10 }));

console.log(productManager.deleteProduct(1));
