// Views/clients.js
export function renderClients() {
    return `
    <section class="client-section">
        <h2>Gestión de Clientes</h2>
        <div class="form-clients-container">
            <form class="form-client">
                <h2 class="actionName-clients">Registrar cliente</h2>

                 <div class="form-group">
                    <label for="idTypeClient-formClients">Tipo de Identificación</label>
                    <select id="idTypeClient-formClients" required>
                        <option value="" disabled selected>Seleccione el tipo de identificación</option>
                        <option value="Cédula">Cédula</option>
                        <option value="NIT">NIT</option>
                        <option value="Pasaporte">Pasaporte</option>
                        <option value="Otro">Otro</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="idClient-formClients">Número de Identificación</label>
                    <input type="text" id="idClient-formClients" placeholder="Ingrese el número de identificación" required>
                </div>

                <div class="form-group">
                    <label for="nameClient-formClients">Nombre o Razón Social</label>
                    <input type="text" id="nameClient-formClients" placeholder="Ingrese el nombre o razón social" required>
                </div>

                <div class="form-group">
                    <label for="emailClient-formClients">Correo Electrónico</label>
                    <input type="email" id="emailClient-formClients" placeholder="Ingrese el correo electrónico" required>
                </div>

                <div class="form-group">
                    <label for="addressClient-formClients">Dirección</label>
                    <input type="text" id="addressClient-formClients" placeholder="Ingrese la dirección" required>
                </div>

                <div class="form-group">
                    <label for="phoneClient-formClients">Teléfono</label>
                    <input type="text" id="phoneClient-formClients" placeholder="Ingrese el teléfono" required>
                </div>

                <div class="buttons-actions">
                    <button type="submit" class="btn" id="btnCreateClient" value="create">Agregar</button>
                    <button type="submit" class="btn btnEditClient" value="edit">Guardar cambios</button>
                    <button class="btn btnEditClient" id="dontSaveClient-btn">Cancelar</button>
                </div>
            </form>

            <div class="search-container">
                <input type="text" id="search-bar-clients" class="search-bar" placeholder="Buscar por nombre, identificación o correo">
                <div class="tableClients-container" id="tableClients">
                
                </div>
            </div>
        </div>    
    </section>
    `;
}
