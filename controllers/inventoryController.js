//controllers/inventoryController.js
import { App } from "../main.js";
import { Product } from "../models/Product.js";
import { AiService } from "../services/AiService.js";
import { GraphicsService } from "../services/GraphicsService.js";
import { renderInventory } from "../views/inventory.js";
import { UserController } from "./usersController.js";

export class InventoryController {

    constructor() {
        this.app = App.getInstance();
        this.userController = new UserController();

        this.graphicService = new GraphicsService();
        this.aiService = new AiService();
    }

    // RENDERIZAR COMPONENTES

    render() {
        this.app.appContent.innerHTML = renderInventory();
        this.renderTable();
        this.initEventListeners();
        this.hideEditButtons();
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

    hideEditButtons() {
        const editButtons = document.querySelectorAll('.btnEditProduct');
        const createButton = document.getElementById('btnCreateProduct');
        const actionContent = document.getElementById('actionName-inventory');
        actionContent.textContent = 'Agregar Producto';

        createButton.style.visibility = "visible";

        editButtons.forEach((button) => {
            button.style.visibility = "hidden";
        })
    }

    showEditButtons() {
        const editButtons = document.querySelectorAll('.btnEditProduct');
        const createButton = document.getElementById('btnCreateProduct');
        const actionContent = document.getElementById('actionName-inventory');
        actionContent.textContent = 'Editando Producto...';

        createButton.style.visibility = "hidden";
        editButtons.forEach((button) => {
            button.style.visibility = "visible";
        })
    }

    // INICIALIZAR EVENTOS

    initEventListeners() {
        const form = document.querySelector('.form-product');
        const searchBar = document.getElementById('search-bar');
        const cancelEditBtn = document.getElementById('dontSave-btn');

        // Maneja el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const clickedButton = event.submitter; // Esta propiedad identifica cuál botón envió el formulario.
            if (clickedButton.value === "create") {
                console.log("Formulario enviado: Crear producto");
                this.handleCreateProduct();
            } else if (clickedButton.value === "edit") {
                console.log("Formulario enviado: Editar producto");
                this.handleUpdateProduct();
            }
        });

        //Maneja la búsqueda
        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this.handleSearch(query);
            console.log("Buscando producto");
        })

        cancelEditBtn.addEventListener('click', (event) => {
            event.preventDefault();
            this.clearFields();
            this.hideEditButtons();
        })

    }

    initEventListenersTable() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        const infoButtons = document.querySelectorAll('.btn-info');
        const editButtons = document.querySelectorAll('.btn-edit');

        deleteButtons.forEach((button) => {
            const idProduct = button.getAttribute('data-id'); // Obtiene el ID del producto desde el atributo data-id
            button.addEventListener('click', () => {
                this.handleDeleteProduct(idProduct);
            });
        });

        infoButtons.forEach((button) => {
            const idProduct = button.getAttribute('data-id'); // Obtiene el ID del producto desde el atributo data-id
            button.addEventListener('click', () => {
                this.showModalInfo(idProduct);
            });
        });

        editButtons.forEach((button) => {
            const idProduct = button.getAttribute('data-id');
            button.addEventListener('click', () => {
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

        if(parseFloat(salePrice) <= parseFloat(unitPrice)){
            alert('Recuerde que el precio de venta no puede ser menor o igual al precio de unitario');
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

    handleDeleteProduct(idProduct) {
        const loggedUser = this.userController.getLoggedUser();
        loggedUser.deletProduct(idProduct);
        this.userController.updateUser(loggedUser);

        alert('Producto Eliminado correctamente');
        this.renderTable();
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
        this.showEditButtons();
        const loggedUser = this.userController.getLoggedUser();
        const product = loggedUser.getProductById(idProduct);

        if (!product) {
            alert(`No se encontró producto con el código: ${idProduct}`);
            return;
        }

        // Rellenar los campos con los datos del producto
        document.getElementById('idProduct-formInventory').value = product.getId(); // El código no se edita
        document.getElementById('idProduct-formInventory').disabled = true; // Deshabilita el campo para editar el codigo
        document.getElementById('nameProduct-formInventory').value = product.getName();
        document.getElementById('categoryProduct-formInventory').value = product.getCategory();
        document.getElementById('descriptionProduct-formInventory').value = product.getDescription();
        document.getElementById('unitPriceProduct-formInventory').value = product.getUnitPrice();
        document.getElementById('salePriceProduct-formInventory').value = product.getSalePrice();

    }

    handleUpdateProduct() {
        const idProduct = document.getElementById('idProduct-formInventory').value;
        const name = document.getElementById('nameProduct-formInventory').value;
        const category = document.getElementById('categoryProduct-formInventory').value;
        const description = document.getElementById('descriptionProduct-formInventory').value;
        const unitPrice = document.getElementById('unitPriceProduct-formInventory').value;
        const salePrice = document.getElementById('salePriceProduct-formInventory').value;

        if(salePrice <= unitPrice){
            alert('Recuerde que el precio de venta no puede ser menor o igual al precio de unitario');
            return;
        }

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
        this.hideEditButtons();

    }


    clearFields() {
        document.getElementById('idProduct-formInventory').disabled = false;

        const form = document.querySelector('.form-product');
        form.reset();
    }


    // MODAL
    showModalInfo(idProduct) {
        const loggedUser = this.userController.getLoggedUser(); //Obtener el usaurio loggeado
        const product = loggedUser.getProductById(idProduct);//Buscar el producto por su ID

        //En caso de algún error
        if (!product) {
            alert(`No se encontró un producto con el código: ${idProduct}`);
            return;
        }
        this.renderModal(product);
    }

    async renderModal(product) {
        const user = this.userController.getLoggedUser();
        const iaResponse = await this.aiService.generateProductAnalysis(product.getId())
        const modal = document.getElementById('productModal');

        modal.innerHTML = `
        <div class="modal-body" id="productModal">
            <div class="modal-container">
                <button class="close-button">&times;</button>

                <div class="modal-header">
                    <h2 class="product-title">Detalles del Producto</h2>
                    <span class="badge"></span>
                </div>

                <div class="modal-productDetails">
                    <div class="detail-group">
                        <span class="detail-label">Código del Producto</span>
                        <span class="detail-value">${product.getId()}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Precio Unitario</span>
                        <span class="detail-value">$${product.getUnitPrice()}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Nombre del Producto</span>
                        <span class="detail-value">${product.getName()}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Precio de Venta</span>
                        <span class="detail-value">$${product.getSalePrice()}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Categoría</span>
                        <span class="detail-value">${product.getCategory()}</span>
                    </div>
                    <div class="detail-group">
                        <span class="detail-label">Descripción</span>
                        <p class="detail-value">${product.getDescription()}</p>
                    </div>
                    
                </div>

                <div class="stats-container">
                    <div class="stat-card">
                        <div class="stat-title">Ventas Totales</div>
                        <div class="stat-value">$${user.getTotalSalesByProduct(product.getId())}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Unidades Vendidas</div>
                        <div class="stat-value">${user.getSoldUnitsByProduct(product.getId())}</div>
                    </div>
                    <div class="stat-card">
                        <div class="stat-title">Margen de Ganancia</div>
                        <div class="stat-value">${product.getProfitMargin()}%</div>
                    </div>
                </div>
                <div class="charts-container">
                
                    <div class="chart-box">
                        <h3 class="chart-title">Ventas Mensuales</h3>
                        <canvas class="chart-canvas" id="barChart"></canvas>
                    </div>
                    <div class="chart-box">
                        <h3 class="chart-title">Ganancias totales</h3>
                        <canvas class="chart-canvas" id="pieChart"></canvas>
                    </div>
                </div>

                <div class="additional-info">
                    <h3 class="info-title">Análisis de producto</h3>
                    <div class="info-content">
                        <p>${iaResponse}</p>
                        <span>Le recordamos que el análisis del producto ha sido generado usando el modelo gemini-1.5-flash</span>

                    </div>
                </div>
            </div>
        </div>
        `
        const closeBtn = document.querySelector('.close-button');
        closeBtn.addEventListener('click', () => {
            this.closeModal();
        });
        this.createModalCharts(product, user);
        this.showBadge(product, user);
    }

    showBadge(product, user){
        const badgeComponent = document.querySelector('.badge');
        console.log(user.isBestSellingProduct(product));
        if(user.isBestSellingProduct(product)){
            badgeComponent.classList.add('badge-success')
            badgeComponent.textContent = 'Top ventas'
        }
    }

    createModalCharts(product, user){
        const pieGraphic = document.getElementById('pieChart');
        const barGraphic = document.getElementById('barChart');

        // Datos torta
        const productTotalProfit = user.getProfitPercentByProduct(product.getId());
        const pieLabels = [`Ganancias del producto (ID:${product.getId()})`, "Ganancia total"]
        const pieData = [productTotalProfit, (100 - productTotalProfit)]

        // Datos diagrama de barra
        const barLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const barData = barLabels.map((label,index) => user.getProductTotalSalesByMonth(index , product.getId()))
        

        this.graphicService.createBarGraphic(barGraphic, 'Ventas por mes', barLabels, barData);
        this.graphicService.createPieGraphic(pieGraphic, 'Porcentaje ganancias', pieLabels, pieData);

    }

    closeModal(){
        const modal = document.getElementById('productModal');
        modal.innerHTML = ''
    }
}