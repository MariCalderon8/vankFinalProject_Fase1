export function renderInventory() {
    return `
        <div class="form-inventory-container">
            <div class="form-container">
            <h2>Gestión de Inventario</h2>
            <form class="form-product">
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

                <button type="submit" class="btn">Agregar</button>
                <button type="button" class="btn">Editar</button>
                <button type="button" class="btn">Eliminar</button>
            </form>
            </div>
            
            <div class="table-container">
            <table class="table">
                <thead>
                <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Categoría</th>
                    <th>Descripción</th>
                    <th>Precio unitario</th>
                    <th>Precio de venta</th>
                    <th>Acciones</th>
                </tr>
                </thead>
                <tbody>
                <tr>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>Text</td>
                    <td>
                    <button class="btn">Eliminar</button>
                    <button class="btn">Info</button>
                    </td>
                </tr>
                </tbody>
            </table>
            </div>
        </div>
    `;
}
