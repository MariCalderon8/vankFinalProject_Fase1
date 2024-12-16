import { App } from "../main.js";
import { Product } from "../models/Product.js";
import { renderInventory } from "../views/inventory.js";
import { UserController } from "./usersController.js";

export class InventoryController {

    constructor() {
        this.app = App.getInstance();
        this.userController = new UserController();
    }

    // RENDERIZAR COMPONENTES

    render() {
        this.app.appContent.innerHTML = renderInventory();
        this.renderTable();
        this.initEventListeners();
    }

    renderTable(products = this.userController.getLoggedUser().getInventory()) {
        const table = document.getElementById('tableInventory');
        let rows = products.map((product, i) =>
            `<tr>
                    <td>${product.getId()}</td>
                    <td>${product.getName()}</td>
                    <td>${product.getCategory()}</td>
                    <td>$${product.getUnitPrice()}</td>
                    <td>$${product.getSalePrice()}</td>
                    <td>
                    <button class="btn-delete" data-id="${product.getId()}">Eliminar</button>
                    <button class="btn-info" data-id="${product.getId()}">Info</button>
                    </td>
            </tr>
            `
        ).join('');


        table.innerHTML = `
        <table class="table-inventory">
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio unitario</th>
                    <th>Precio de venta</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="7">No se encontraron productos</td></tr>'}
                </tbody>
            </table>
        `
        this.initEventListenersTable();
    }

    // INICIALIZAR EVENTOS

    initEventListeners() {
        const form = document.querySelector('.form-product')
        // Maneja el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Formulario enviado");
            this.handleCreateProduct();
        });
    }

    initEventListenersTable() {
        const deleteButtons = document.querySelectorAll('.btn-delete'); 
        const infoButtons = document.querySelectorAll('.btn-info');

        deleteButtons.forEach((button) => {
            const idProduct = button.getAttribute('data-id'); // Obtiene el ID del producto desde el atributo data-id
            button.addEventListener('click', () => {
                this.deleteProduct(idProduct);
            });
        });

        infoButtons.forEach((button) => {
            const idProduct = button.getAttribute('data-id'); // Obtiene el ID del producto desde el atributo data-id
            button.addEventListener('click', () => {
                this.showInfoProduct(idProduct);
            });
        });
    }


    // ACCIONES
    handleCreateProduct() {
        const id = document.getElementById('idProduct-formInventory').value;
        const name = document.getElementById('nameProduct-formInventory').value;
        const category = document.getElementById('categoryProduct-formInventory').value;
        const description = document.getElementById('descriptionProduct-formInventory').value;
        const unitPrice = document.getElementById('unitPriceProduct-formInventory').value;
        const salePrice = document.getElementById('salePriceProduct-formInventory').value;

        //Validaciones
        if (!id || !name || !category || !description || !unitPrice || !salePrice) {
            alert('Por favor, complete todos los campos requeridos.');
            return
        }

        if (unitPrice <= 0 || salePrice <= 0) {
            alert('Recuerde que los campos de precio no pueden ser cero o negativos. Por favor ingrese un valor válido');
            return;
        }

        let user = this.userController.getLoggedUser();
        const productExist = user.getProductById(id);
        if (productExist) {
            alert('Ya existe un producto registrado con este código');
            return
        }
        const product = new Product(id, name, category, description, unitPrice, salePrice);

        user.addNewProduct(product.toJSON()); // Anñadir nuevo producto
        this.userController.updateUser(user); // Actualizar la lista de usuarios en el localStorage
        console.log('Producto creado correctamente');
        alert('Producto creado correctamente');

        // Limpia el formulario
        this.clearFields();
        this.renderTable();
    }

    deleteProduct(idProduct) {
        const loggedUser = this.userController.getLoggedUser();
        loggedUser.deletProduct(idProduct);
        this.userController.updateUser(loggedUser);

        alert('Producto Eliminado correctamente');
        this.renderTable();
    }

    showInfoProduct(idProduct){
        alert('X: ¿Donde esá el producto?')
        alert(`${idProduct}: AQUI TOY :D`)
    }

    clearFields() {
        const form = document.querySelector('.form-product');
        form.reset();
    }
}