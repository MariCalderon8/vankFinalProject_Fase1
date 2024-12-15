import { App } from "../main.js";
import { Product } from "../models/Product.js";
import { renderInventory } from "../views/inventory.js";
import { UserController } from "./usersController.js";

export class InventoryController{

    constructor(){
        this.app = App.getInstance();
        this.userController = new UserController();
    }

    render(){
        this.app.appContent.innerHTML = renderInventory();
        this.initEventListeners();
    }

    initEventListeners(){
        const form = document.querySelector('.form-product')
        // Maneja el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault(); 
            console.log("Formulario enviado");
            this.handleCreateProduct();  
        });
    }

    handleCreateProduct(){
        const id = document.getElementById('idProduct-formInventory').value;
        const name = document.getElementById('nameProduct-formInventory').value;
        const category = document.getElementById('categoryProduct-formInventory').value;
        const description = document.getElementById('descriptionProduct-formInventory').value;
        const unitPrice = document.getElementById('unitPriceProduct-formInventory').value;
        const salePrice = document.getElementById('salePriceProduct-formInventory').value;

        //Validaciones
        if(!id || !name || !category || !description || !unitPrice || !salePrice){
            alert('Por favor, complete todos los campos requeridos.');
            return
        }

        if(unitPrice <= 0 || salePrice <= 0){
            alert('Recuerde que los campos de precio no pueden ser negativos. Por favor ingrese un valor válido');
            return;
        }

        let user = this.userController.getLoggedUser();
        const productExist = user.getProductById(id);
        if(productExist){
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
    }

    clearFields(){
        const form = document.querySelector('.form-product');
        form.reset();
    }
}