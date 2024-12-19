//Views/inventory.js
export function renderInventory() {
    return `
        <section class="inventory-section">
            <h2>Gestión de Inventario</h2>

            <div id="productModal">
                    
            </div>

            <div class="form-inventory-container">
                
                <form class="form-product">
                    <h2 id="actionName-inventory">Agregar Producto</h2>

                    <div class="form-group">
                        <label for="idProduct-formInventory">Código</label>
                        <input type="text" id="idProduct-formInventory" placeholder="Ingrese el código" required>
                    </div>

                    <div class="form-group">
                        <label for="nameProduct-formInventory">Nombre</label>
                        <input type="text" id="nameProduct-formInventory" placeholder="Ingrese el nombre" required>
                    </div>

                    <div class="form-group">
                        <label for="categoryProduct-formInventory">Categoría</label>
                        <input type="text" id="categoryProduct-formInventory" placeholder="Ingrese la categoría" required>
                    </div>

                    <div class="form-group">
                        <label for="descriptionProduct-formInventory">Descripción</label>
                        <input type="text" id="descriptionProduct-formInventory" placeholder="Ingrese la descripción" required>
                    </div>

                    <div class="form-group">
                        <label for="unitPriceProduct-formInventory">Precio unitario</label>
                        <input type="number" id="unitPriceProduct-formInventory" placeholder="Ingrese el precio unitario" required>
                    </div>

                    <div class="form-group">
                        <label for="salePriceProduct-formInventory">Precio de venta</label>
                        <input type="number" id="salePriceProduct-formInventory" placeholder="Ingrese el precio de venta" required>
                    </div>

                    <div class="buttons-actions">
                        <button type="submit" class="btn" id="btnCreateProduct" value="create">Agregar</button>
                        <button type="submit" class="btn btnEditProduct" id="saveChanges-btn" value="edit">Guardar cambios</button>
                        <button class="btn btnEditProduct" id="dontSave-btn">Cancelar</button>
                    </div>

                </form>

                <div class="search-container">
                    <input type="text" id="search-bar" class="search-bar" placeholder="Buscar por nombre, código o categoría">
                    <div class="tableInventory-container" id="tableInventory">
                
                    </div>
                </div>
            </div>
        </section>
    `;
}



// <button id="close">&times;</button>