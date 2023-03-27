const fs = require("fs");
const fsPromises = fs.promises;

class ProductManager {
  constructor(path) {
    this.products = [];
    this.path = path;
    this.#createFile();
  }
  async #createFile() {
    if (!fs.existsSync(this.path)) {
      await fsPromises.writeFile(this.path, "[]", "utf-8");
    }
    if (fs.existsSync(this.path)) {
      const fetchData = await fsPromises.readFile(this.path, "utf-8");
      if (fetchData.length === 0) {
        await fsPromises.writeFile(this.path, "[]", "utf-8");
      }
    }
  }
  async getProducts() {
    try {
      const data = await fsPromises.readFile(this.path, "utf-8");
      const dataToJson = JSON.parse(data);
      return dataToJson;
    } catch (error) {
      return `Error al traer el archivo ${error}`;
    }
  }
  async getProductById(idProduct) {
    try {
      const read = await fsPromises.readFile(this.path, "utf-8");
      const readToObject = JSON.parse(read);
      const find = readToObject.find((value) => value.id === idProduct);
      return find ? find : "No se encontró un producto con ID relacionado";
    } catch (error) {
      return `Se produjo un error al traer el archivo ${error}`;
    }
  }
  async updateProduct(idProduct, changes) {
    try {
      const read = await fsPromises.readFile(this.path, "utf-8");
      const readToObject = JSON.parse(read);

      const find = readToObject.find((value) => value.id === idProduct);
      if (!find) `No se encontró un objeto con el ID relacionado: ${idProduct}`;

      let guardarID = idProduct;
      Object.assign(find, changes);
      find.id = guardarID;

      const objectToString = JSON.stringify(readToObject, "null", 2);
      await fsPromises.writeFile(this.path, objectToString, "utf-8");

      return `Se ah modificado el producto con ID: ${idProduct}`;
    } catch (error) {
      return `Se produjo un error al traer el archivo ${error}`;
    }
  }
  async deleteProduct(id) {
    try {
      const fetchJson = await fsPromises.readFile(this.path, "utf-8");
      const jsonToObject = JSON.parse(fetchJson);
      const indexProduct = jsonToObject.findIndex(
        (product) => product.id == id
      );
      if (indexProduct !== -1) {
        jsonToObject.splice(indexProduct, 1);
        let objectToJSON = JSON.stringify(jsonToObject, "null", 2);
        fsPromises.writeFile(this.path, objectToJSON);
        return `Se ah eliminado el objeto con id ${id}`;
      }
      return "No se encontró un valor con ese ID";
    } catch (error) {
      return `Se produjo un error al traer el archivo ${error}`;
    }
  }
  async addProduct(title, description, price, thumbnail, code, stock) {
    try {
      let newProduct = { title, description, price, thumbnail, code, stock };

      if (
        !newProduct.title ||
        !newProduct.description ||
        !newProduct.price ||
        !newProduct.thumbnail ||
        !newProduct.code ||
        !newProduct.stock
      )
        return "Favor de verificar que todos los valores se hayan ingresado correctamente";

      let repetedCode = this.products.every(
        (product) =>
          product.code.toLowerCase() !== newProduct.code.toLowerCase()
      );
      if (!repetedCode)
        return "El producto repite su código, favor de verificarlo";

      if (this.products.length === 0) {
        this.products.push({ id: 1, ...newProduct });
        let dataToString = JSON.stringify(this.products, "null", 2);
        await fsPromises.writeFile(this.path, dataToString, "utf-8");
        return "El producto se ingresó correctamente";
      }
      this.products.push({
        id: this.products[this.products.length - 1].id + 1,
        ...newProduct,
      });
      let dataToString = JSON.stringify(this.products, "null", 2);
      await fsPromises.writeFile(this.path, dataToString, "utf-8");
      return "El producto se ingresó correctamente";
    } catch (error) {
      return `Se ah producido un error al cargar el producto ${error}`;
    }
  }
}

let testProduct = {
  id: 8,
  title: "Monitor Gamer",
  description: "LG 24GN600-B 24 144Hz",
  price: 138000,
  thumbnail: "Sin imagen",
  code: "LG-24GN-600B",
  stock: 15,
};

let producto = new ProductManager("./productdata.json");
let pruebas = async () => {
  console.log(await producto.getProducts());
  console.log(
    await producto.addProduct(
      "Procesador AMD",
      "Ryzen 5600 4.4 Ghz AM4",
      80000,
      "Sin imagen",
      "RYZ-5-5600",
      34
    )
  );
  console.log(
    await producto.addProduct(
      "Procesador Intel",
      "I5 12400F Alderlake 4.40Ghz",
      85000,
      "Sin imagen",
      "INT-5-12400",
      13
    )
  );
  console.log(
    await producto.addProduct(
      "Disco Solido",
      "SSD 240gb Kingston",
      8500,
      "Sin imagen",
      "KING-240-SSD",
      77
    )
  );
  console.log(
    await producto.addProduct(
      "Placa de Video",
      "Powercolor AMD Radeon RX 6700 10Gb",
      180000,
      "Sin imagen",
      "POW-6700-GPU",
      77
    )
  );
  console.log(await producto.getProductById(1));
  console.log(await producto.updateProduct(1, testProduct));
};
pruebas();
