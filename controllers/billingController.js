//controllers/billingController.js
import { App } from "../main.js";
import { renderBilling } from "../views/billing.js";
import { UserController } from "./usersController.js";
import { Sale } from "../models/Sale.js";

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

        const issueDataInput = document.getElementById('fecha-emision');
        const today = new Date().toISOString().split('T')[0];
        issueDataInput.value = today;

        this.renderTableExistingProducts();
        this.renderTableBillProducts();
        this.loadSalesHistory();
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
        const idInput = document.getElementById('id');

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
            this.clearFields();
        });

        idInput.addEventListener('keydown', (event) =>{
            if (event.key === 'Enter'){
                event.preventDefault();
                const clientId = event.target.value.trim();
                this.handleSearchClientById(clientId);
            }
        });
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
                    productDetail.amount = parseInt(productAmount[i].value);
                }
                
                console.log(i);
            })
        }
    }


    handleCreateBill() {
        const issueDate = new Date(); // Toma la fecha de emisión directamente del sistema
        const expirationDate = new Date(document.getElementById('fecha-vencimiento').value);
        const clientId = document.getElementById('id').value;
        const clientName = document.getElementById('nombre').value;
        const clientEmail = document.getElementById('correo').value;
        const paymentMethod = document.getElementById('forma-pago').value;
        const paymentWay = document.getElementById('medio-pago').value;
    
        // Validaciones
        if (!clientId || !clientName || !clientEmail || !expirationDate || !paymentMethod || !paymentWay) {
            alert("Por favor complete todos los campos de facturación.");
            return;
        }
    
        if (this.billProducts.length === 0) {
            alert("No se han seleccionado productos para la factura.");
            return;
        }
    
        if (new Date(expirationDate) < new Date(issueDate)) {
            alert("La fecha de vencimiento no puede ser anterior a la fecha de emisión.");
            return;
        }
    
        if (new Date(issueDate) > new Date()) {
            alert("La fecha de emisión no puede ser superior a la fecha actual.");
            return;
        }
    
        // Asegúrate de que el cliente está correctamente asignado
        const client = {
            id: clientId,
            name: clientName,
            email: clientEmail
        };
    
        this.saveProductsDetails();

        // Crear instancia de Sale
        const sale = new Sale(
            client, // Pasar el objeto cliente al constructor de Sale
            new Date(expirationDate),
            paymentMethod,
            paymentWay,
            this.billProducts.map((detail) => ({
                product: detail.product.toJSON(),
                amount: detail.amount,
            }))
        );

    
        // Console log para depuración con la información de la factura
        console.log("Factura generada:", {
            client: client, // Verifica que el cliente esté correctamente asignado
            issueDate: issueDate,
            expirationDate: expirationDate,
            paymentMethod: paymentMethod,
            paymentWay: paymentWay,
            products: this.billProducts.map(detail => ({
                productId: detail.product.getId(),
                productName: detail.product.getName(),
                productPrice: detail.product.getSalePrice(),
                amount: detail.amount
            
            }))
            
        });
        console.log("Factura generada con ID: ", sale.getId());
    
        // Guardar la factura en el usuario
        const user = this.userController.getLoggedUser();
        user.addNewSale(sale);
        this.userController.updateUser(user);
        console.log(user);
    
        alert("Factura generada con éxito.");
    
        
        this.clearFields();
    }
    
    handleSearchClientById(clientId){
        const user = this.userController.getLoggedUser();
        console.log("Clientes del usuario:", user.getClients());
        const client = user.getClients().find((client) => 
            client.getId().toString().trim().toLowerCase() === clientId.toString().trim().toLowerCase()
        );
        console.log("Cliente buscado:", clientId, "Resultado:", client);

        const nameInput = document.getElementById('nombre');
        const emailInput = document.getElementById('correo');

        if (client) {
            nameInput.value = client.getName() || '';
            emailInput.value = client.getEmail() || '';
        } else {
            nameInput.value = '';
            emailInput.value = '';
            alert("Cliente no encontrado, por favor regístrelo");
        }
    }

    loadSalesHistory() {
        console.log('load Table');
        const user = this.userController.getLoggedUser();
        const sales = user.getSaleHistory();

        console.log(sales);
        
        const table = document.getElementById('table-salesHistory');
        //console.log('Table element:', table);  // Debugging line

        // Función para formatear fechas de formato ISO a dd/mm/yyyy
        const formatDate = (date) => {
            // Convierte el parámetro date en un objeto Date (funciona con fechas ISO, timestamps, y objetos Date)
            const d = new Date(date);
            
            // Obtiene el día del mes, lo convierte a string y añade un 0 inicial si es necesario
            const day = d.getDate().toString().padStart(2, '0');
            
            // Obtiene el mes (getMonth() devuelve 0-11, por eso sumamos 1) Lo convierte a string y añade un 0 inicial si es necesario
            const month = (d.getMonth() + 1).toString().padStart(2, '0');
            
            // Obtiene el año completo (4 dígitos)
            const year = d.getFullYear();
            
            // Devuelve la fecha formateada como dd/mm/yyyy
            return `${day}/${month}/${year}`;
        };
    
    
        let rows = sales.map(sale => {
            console.log(sale);
            return `
            <tr>
                <td>${sale.getId() || 'ID no disponible'}</td>
                <td>${sale.getClient().id || 'ID no disponible'}</td>
                <td>${sale.getClient().name || 'Nombre no disponible'}</td>
                <td>${formatDate(sale.getIssueDate())}</td>
                <td>${formatDate(sale.getExpirationDate())}</td>
                <td>${sale.getPaymentWay() || 'Método de pago no disponible'}</td>
                <td>
                    <button type="button" class="btn-deleteSale" data-id="${sale.getId()}">Eliminar</button>
                </td>
            </tr>
            `;
        }).join('');

        if (table) {
            table.innerHTML = `
            <table>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>ID Cliente</th>
                        <th>Nombre Cliente</th>
                        <th>Fecha Emisión</th>
                        <th>Fecha Vencimiento</th>
                        <th>Forma de Pago</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="6">No se encontraron ventas</td></tr>'}
                </tbody>
            </table>
            `;
        }
    
        this.initEventsListenersTableSalesHistory();
    }
    
    
    initEventsListenersTableSalesHistory() {
        const btnDeleteSale = document.querySelectorAll('.btn-deleteSale');
        btnDeleteSale.forEach((button) => {
            const saleId = button.getAttribute('data-id');
            button.addEventListener('click', () => {
                this.handleDeleteSale(saleId);
            });
        });
    }
    
    handleDeleteSale(saleId) {
        console.log("ID de la venta a eliminar:", saleId); // Verificar que el saleId se pase correctamente
        const user = this.userController.getLoggedUser();
        const sales = user.getSaleHistory();
     
        const saleIndex = sales.findIndex(sale => sale.getId().toString() === saleId.toString());
        if (saleIndex !== -1) {
            sales.splice(saleIndex, 1);
            this.userController.updateUser(user);
            this.loadSalesHistory();
            alert("Factura eliminada con éxito");
        } else {
            alert("Venta no encontrada.");
        }
    }
    

    clearFields() {
        const user = this.userController.getLoggedUser();

        // Reiniciar tablas y limpiar campos
        this.billProducts = [];
        this.existingProducts = user.getInventory(); // Recargar inventario
        this.sortExistingProducts();
        this.renderTableExistingProducts();
        this.renderTableBillProducts();
        this.loadSalesHistory();

        // Reiniciar formulario
        const form = document.querySelector('.form-billing');
        form.reset();

        // Reiniciar fecha de emisión
        const issueDataInput = document.getElementById('fecha-emision');
        const today = new Date().toISOString().split('T')[0];
        issueDataInput.value = today;
    }
}