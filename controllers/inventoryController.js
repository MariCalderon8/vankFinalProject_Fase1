//controllers/inventoryController.js
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
        console.log(products);
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
                    <button class="btn-edit" data-id="${product.getId()}">Editar</button>
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
        const form = document.querySelector('.form-product');
        const searchBar = document.getElementById('search-bar');

        // Maneja el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            console.log("Formulario enviado");
            this.handleCreateProduct();
        });

        //Maneja la búsqueda
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this.handleSearch(query);
            console.log("Buscando producto");
        })
    }

    initEventListenersTable() {
        const deleteButtons = document.querySelectorAll('.btn-delete'); 
        const infoButtons = document.querySelectorAll('.btn-info');
        const editButtons = document.querySelectorAll('.btn-edit');

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

        editButtons.forEach((button) => {
            const idProduct = button.getAttribute('data-id');
            button.addEventListener('click', () =>{
                this.handleEditProduct(idProduct);
            })
        })
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
            return;
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
        const loggedUser = this.userController.getLoggedUser(); //Obtener el usaurio loggeado
        const product = loggedUser.getProductById(idProduct);//Buscar el producto por su ID

    //En caso de algún error
        if (!product) {
            alert(`No se encontró un producto con el código: ${idProduct}`);
            return;
        }

        //Alert que muestra la descripción
        alert(`DESCRIPCIÓN DEL PRODUCTO CON CÓDIGO ${idProduct}:\n\n${product.getDescription()}`);
    }

    handleSearch(findProduct) {
        const loggedUser = this.userController.getLoggedUser();
        const inventory = loggedUser.getInventory();

        const filteredProducts = inventory.filter((product) => {
            let id = "";
            let name = "";
            let category = "";

            // Validar y asignar valores a las variables
            if (product.getId()) {
                id = product.getId().toString().toLowerCase();
            }

            if (product.getName()) {
                name = product.getName().toLowerCase();
            }

            if (product.getCategory()) {
                category = product.getCategory().toLowerCase();
            }

            // Comprobar si la consulta está en alguna de las propiedades
            if (id.includes(findProduct) || name.includes(findProduct) || category.includes(findProduct)) {
                return true;
            }

            return false;
        });

        this.renderTable(filteredProducts);
    }

    handleEditProduct(idProduct) {
        const loggedUser = this.userController.getLoggedUser();
        const product = loggedUser.getProductById(idProduct);
        
        if (!product) {
            alert(`No se encontró producto con el código: ${idProduct}`);
            return;
        }
    
        // Rellenar los campos con los datos del producto
        document.getElementById('idProduct-formInventory').value = product.getId(); // El código no se edita
        document.getElementById('nameProduct-formInventory').value = product.getName();
        document.getElementById('categoryProduct-formInventory').value = product.getCategory();
        document.getElementById('descriptionProduct-formInventory').value = product.getDescription();
        document.getElementById('unitPriceProduct-formInventory').value = product.getUnitPrice();
        document.getElementById('salePriceProduct-formInventory').value = product.getSalePrice();
    
        const submitButton = document.querySelector('.form-product button[type="submit"]');
        submitButton.textContent = 'Guardar cambios';    
    
        // Cambiar el evento de submit para actualizar el producto específico
        this.handleUpdateProduct(idProduct);
    }

    handleUpdateProduct(idProduct) {
        const form = document.querySelector('.form-product');
        
        form.addEventListener('submit', (event) => {
            event.preventDefault();
    
            const name = document.getElementById('nameProduct-formInventory').value;
            const category = document.getElementById('categoryProduct-formInventory').value;
            const description = document.getElementById('descriptionProduct-formInventory').value;
            const unitPrice = document.getElementById('unitPriceProduct-formInventory').value;
            const salePrice = document.getElementById('salePriceProduct-formInventory').value;
    
            const loggedUser = this.userController.getLoggedUser();
            const product = loggedUser.getProductById(idProduct);
    
            // Actualizar los campos del producto
            product.setName(name);
            product.setCategory(category);
            product.setDescription(description);
            product.setUnitPrice(unitPrice);
            product.setSalePrice(salePrice);
    
            this.userController.updateUser(loggedUser); // Guardar los cambios
    
            alert('Producto actualizado correctamente');
            this.renderTable();  // Volver a renderizar la tabla con los cambios
            
            // Limpiar el formulario y resetear el botón
            this.clearFields();
            
            const submitButton = document.querySelector('.form-product button[type="submit"]');
            submitButton.textContent = 'Agregar';
        });
    }
    

    clearFields() {
        const form = document.querySelector('.form-product');
        form.reset();
    }
}