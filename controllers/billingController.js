import { App } from "../main.js";
import { renderBilling } from "../views/billing.js";
import { UserController } from "./usersController.js";

export class BillingController{

    constructor(){
        this.app = App.getInstance();
        
        this.userController = new UserController();
        this.existingProducts = this.userController.getLoggedUser().getInventory();
        this.billProducts = []; 

        this.sortExistingProducts();
    }

    render(){
        this.app.appContent.innerHTML = renderBilling();
        this.initEventListeners();

        this.renderTableExistingProducts();
        this.renderTableBillProducts();
    }

    renderTableExistingProducts(products = this.existingProducts){
        const table = document.getElementById('table-registeredProducts');
        let rows = products.map((product, i) =>
            `<tr>
                    <td>${product.getId()}</td>
                    <td>${product.getName()}</td>
                    <td>${product.getCategory()}</td>
                    <td>${product.getDescription()}</td>
                    <td>$${product.getSalePrice()}</td>
                    <td>
                    <button type="button" class="btn-AddToBill" data-id="${product.getId()}">Agregar</button>
                    </td>
            </tr>
            `
        ).join('');


        table.innerHTML = `
        <table>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Precio de venta</th>
                    <th></th>
                </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="7">No se encontraron productos</td></tr>'}
                </tbody>
            </table>
        `

        this.initEventsListenersTableExistingProducts();
    }

    renderTableBillProducts(){
        const table = document.getElementById('table-toBuyProducts');
        let rows = this.billProducts.map((saleDetail, i) =>
            `<tr>
                    <td>${saleDetail.product.getId()}</td>
                    <td>${saleDetail.product.getName()}</td>
                    <td>${saleDetail.product.getDescription()}</td>
                    <td>$${saleDetail.product.getSalePrice()}</td>
                    <td><input class="productAmount" type="number" value="${saleDetail.amount || 1}" min="1" ></input></td>
                    <td>
                    <button type="button" class="btn-deleteFromBill" data-id="${saleDetail.product.getId()}">Borrar</button>
                    </td>
            </tr>
            `
        ).join('');


        table.innerHTML = `
        <table>
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Precio unidad</th>
                    <th>Cantidad</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="6">Aún no hay productos registrados</td></tr>'}
                </tbody>
            </table>
        `
        this.initEventsListenersTableBillProducts();
    }



    initEventListeners() {
        const form = document.querySelector('.form-billing');
        const searchBar = document.getElementById('search-bar-billing');
        const cancelBill = document.querySelector('.cancelBill');

        // Maneja el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault();
            this.handleCreateBill();
        });

        //Maneja la búsqueda
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this.handleSearch(query);
            console.log("Buscando producto");
        })

        cancelBill.addEventListener('click', (event) => {
            event.preventDefault();
            //LIMPIAR CAMPOS 
        })
    }

    initEventsListenersTableExistingProducts(){
        const btnAddToBill = document.querySelectorAll('.btn-AddToBill');
        btnAddToBill.forEach((button) => {
            const idProduct = button.getAttribute('data-id'); // Obtiene el ID del producto desde el atributo data-id
            button.addEventListener('click', () => {
                this.handleAddProductToBill(idProduct);
            });
        });

        
    }

    initEventsListenersTableBillProducts(){
        const btnDeleteFromBill = document.querySelectorAll('.btn-deleteFromBill');
        btnDeleteFromBill.forEach((button) => {
            const idProduct = button.getAttribute('data-id'); 
            button.addEventListener('click', () => {
                this.handleDeleteProductFromBill(idProduct);
            });
        });
    }

    sortExistingProducts() {return this.existingProducts.sort((a, b) => a.getId().localeCompare(b.getId()));}

    handleSearch(findProduct) {
        const inventory = this.existingProducts;

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

        this.renderTableExistingProducts(filteredProducts);
    }

    handleAddProductToBill(idProduct){
        const index = this.existingProducts.findIndex(product => product.getId() === idProduct); 
        const product = this.existingProducts[index];
        const searchBar = document.getElementById('search-bar-billing');

        this.existingProducts.splice(index, 1);
        this.billProducts.push({
            product: product,
            amount: 1
        });

        searchBar.value = "";
        this.saveProductsDetails();
        this.renderTableExistingProducts();
        this.renderTableBillProducts();
    }

    handleDeleteProductFromBill(idProduct){
        const index = this.billProducts.findIndex(saleDetail => saleDetail.product.getId() === idProduct); 
        const product = this.billProducts[index].product;

        this.billProducts.splice(index, 1);
        this.existingProducts.push(product);

        this.sortExistingProducts();
        this.saveProductsDetails();
        this.renderTableExistingProducts();
        this.renderTableBillProducts();
    }

    saveProductsDetails(){
        if(this.billProducts.length > 0){
            const productAmount = document.querySelectorAll('.productAmount');
            this.billProducts.forEach((productDetail, i) => {
                if (productAmount[i]) {
                    productDetail.amount = productAmount[i].value;
                }
                
                console.log(i);
            })
        }
    }


    handleCreateBill(){
        // AQUI VA PARA CREAR LA FACTURA

        // Al terminar no olvidar reiniciar existingProducts con los productos del usuario y llamar savesaveProductsDetails
    }



}