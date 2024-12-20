//controllers/billingController.js
import { App } from "../main.js";
import { renderBilling } from "../views/billing.js";
import { UserController } from "./usersController.js";
import { Sale } from "../models/Sale.js";
import { PdfService } from "../services/PDFService.js";

export class BillingController{

    constructor(){
        this.app = App.getInstance();
        
        this.userController = new UserController();
        this.existingProducts = this.userController.getLoggedUser().getInventory();
        this.billProducts = []; 
        this.pdfService = new PdfService();

        this.sortExistingProducts();
    }

    render(){
        this.app.appContent.innerHTML = renderBilling();
        this.initEventListeners();

        const issueDataInput = document.getElementById('fecha-emision');
        const today = new Date().toLocaleDateString('en-CA');
        issueDataInput.value = today;
        document.getElementById('fecha-emision').disabled = true;

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
        const user = this.userController.getLoggedUser();
        const clientExists = user.getClientById(clientId);
        
        if (!clientExists) {
            alert('El cliente no existe en la tienda. No se puede crear la factura.');
            return;
        }

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
    
        if (isNaN(expirationDate.getTime())) {
            alert("La fecha de vencimiento no es válida.");
            return;
        }

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
                product: detail.product,
                amount: detail.amount,
            }))
        );

    
    
        // Guardar la factura en el usuario
        
        user.addNewSale(sale);
        this.userController.updateUser(user);
    
        // // Generar Pdf factura
        this.handleGeneratePDF(sale, true);
        
        
            
        alert("Factura generada con éxito.");
        
        this.clearFields();
    }
    
    handleSearchClientById(clientId){
        const user = this.userController.getLoggedUser();
        const client = user.getClients().find((client) => 
            client.getId().toString().trim().toLowerCase() === clientId.toString().trim().toLowerCase()
        );

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
        const user = this.userController.getLoggedUser();
        const sales = user.getSaleHistory();
        
        const table = document.getElementById('table-salesHistory');

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
            return `
            <tr>
                <td>${sale.getId() || 'ID no disponible'}</td>
                <td>${sale.getClient().id || 'ID no disponible'}</td>
                <td>${sale.getClient().name || 'Nombre no disponible'}</td>
                <td>${formatDate(sale.getIssueDate())}</td>
                <td>${formatDate(sale.getExpirationDate())}</td>
                <td>${sale.getPaymentWay() || 'Método de pago no disponible'}</td>
                <td class="tablesales-actions">
                    <button type="button" class="btn-downloadBill" data-id="${sale.getId()}">Descargar</button>
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
                    ${rows || '<tr><td colspan="7">No se encontraron ventas</td></tr>'}
                </tbody>
            </table>
            `;
        }
    
        this.initEventsListenersTableSalesHistory();
    }
    

    initEventsListenersTableSalesHistory() {
        const user = this.userController.getLoggedUser();
        const btnDeleteSale = document.querySelectorAll('.btn-deleteSale');
        btnDeleteSale.forEach((button) => {
            const saleId = button.getAttribute('data-id');
            button.addEventListener('click', (event) => {
                event.preventDefault();
                this.handleDeleteSale(saleId);
            });
        });

        const btnDownloadBill = document.querySelectorAll('.btn-downloadBill');
        btnDownloadBill.forEach((button) => {
            const saleId = parseInt(button.getAttribute('data-id'));
            const sale = user.getSaleById(saleId);

            button.addEventListener('click',  () => {
                this.handleGeneratePDF(sale, false);
            });
        });

    }
    
    handleDeleteSale(saleId) {
        const user = this.userController.getLoggedUser();
        const sales = user.getSaleHistory();
    

        const saleIndex = sales.findIndex(sale => { 
            const id = sale.getId();
            return id && id.toString() === saleId.toString();
        });
    
        if (saleIndex !== -1) {
            sales.splice(saleIndex, 1);
            this.userController.updateUser(user);
            this.loadSalesHistory();
            alert("Factura eliminada con éxito");
        } else {
            alert("Venta no encontrada.");
        }
    }
    
    handleGeneratePDF(sale, openInNewWindow = false) {
        const pdfContent = this.pdfService.generateBillHtmlFormat(sale);
        this.pdfService.generatePdfBill(pdfContent, sale, openInNewWindow);
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
        const today = new Date().toLocaleDateString('en-CA');
        issueDataInput.value = today;
    }
}