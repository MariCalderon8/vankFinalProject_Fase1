//views/billing.js
export function renderBilling() {
    return `
    <body>
        <div class="container-billingForm">

            <h2>Generación de Factura</h2>
            <form class="form-billing">
                <div class="billingInfo">
                <!-- Datos del Usuario -->
                <div class="box">
                    <h3>Datos del usuario</h3>
                    <label for="id">Id</label>
                    <input type="text" id="id" placeholder="#" />

                    <label for="nombre">Nombre</label>
                    <input type="text" id="nombre" placeholder="Nombre completo" />

                    <label for="correo">Correo</label>
                    <input type="email" id="correo" placeholder="Correo@example.com" />
                </div>

                <!-- Datos de Facturación -->
                <div class="box">
                    <h3>Datos de facturación</h3>
                    <label for="fecha-emision">Fecha de emisión</label>
                    <input type="date" id="fecha-emision" />

                    <label for="fecha-vencimiento">Fecha de vencimiento</label>
                    <input type="date" id="fecha-vencimiento" />

                    <label for="forma-pago">Forma de pago</label>
                    <select id="forma-pago">
                        <option value="credito">Crédito</option>
                        <option value="contado">Contado</option>
                    </select>

                    <label for="medio-pago">Medio de pago</label>
                    <select id="medio-pago">
                        <option value="efectivo">Efectivo</option>
                        <option value="tarjeta">Tarjeta</option>
                        <option value="transferencia">Transferencia</option>
                    </select>
                </div>
                </div>

                <!-- Tabla de Datos de los Productos -->
                <div class="tableProducts">
                <h3>DATOS DE LOS PRODUCTOS</h3>                
                <input type="text" id="search-bar-billing" class="search-bar" placeholder="Buscar por nombre, código o categoría">
                <div class="table-containerBilling" id="table-registeredProducts">
                    
                </div>

                <h3>PRODUCTOS A VENDER</h3>
                <div class="table-containerBilling" id="table-toBuyProducts">
                    
                </div>

                </div>

                <!-- Botón de generar factura -->
                <div class="billingForm-actions">
                    <button type="submit" class="btn btnCreateBill">Generar factura</button>
                    <button type="button" class="btn cancelBill">Cancelar</button>
                </div>
                
            </form>

            <h2>Historial de facturación</h2>
            <div class="table-salesHistory" id="table-salesHistory">
                <!-- La tabla de historial de ventas se renderiza aquí -->
            </div>
        </div>
    </body>
    </html>
    `;
}
