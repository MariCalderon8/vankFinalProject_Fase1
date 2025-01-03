import { App } from "../main.js";
import { renderClients } from "../views/clients.js";
import { Client } from "../models/Client.js";
import { UserController } from "./usersController.js";

export class ClientsController {
    constructor() {
        this.app = App.getInstance();
        this.userController = new UserController(); // Nombre de instancia en minúscula para consistencia
    }

    render() {
        this.app.appContent.innerHTML = renderClients();
        this.renderTable();
        this.initEventListeners(); // Corregido nombre del método
        this.hideEditButtons();
    }

    hideEditButtons(){
        const editButtons = document.querySelectorAll('.btnEditClient');
        const createButton = document.getElementById('btnCreateClient');
        const actionContent = document.querySelector('.actionName-clients');
        actionContent.textContent = "Registrar cliente";

        createButton.style.visibility = "visible";

        editButtons.forEach((button) => {
            button.style.visibility = "hidden";
        })
    }

    showEditButtons(){
        const editButtons = document.querySelectorAll('.btnEditClient');
        const createButton = document.getElementById('btnCreateClient');
        const actionContent = document.querySelector('.actionName-clients');
        actionContent.textContent = "Editando cliente...";

        createButton.style.visibility = "hidden";
        editButtons.forEach((button) => {
            button.style.visibility = "visible";
        })
    }

    renderTable(clients = this.userController.getLoggedUser().getClients()) { // Acceso correcto a los métodos
        const table = document.getElementById('tableClients');
        let rows = clients.map(client => `
            <tr>
                <td>${client.getId()}</td>
                <td>${client.getName()}</td>
                <td>${client.getEmail()}</td>
                <td>${client.getAddress()}</td>
                <td>${client.getPhone()}</td>
                <td>
                    <button class="btn-delete" data-id="${client.getId()}">Eliminar</button>
                    <button class="btn-edit" data-id="${client.getId()}">Editar</button>
                </td>
            </tr>
        `).join('');

        table.innerHTML = `
            <table class="table-clients">
                <thead>
                    <tr>
                        <th>Id</th>
                        <th>Nombre</th>
                        <th>Correo</th>
                        <th>Dirección</th>
                        <th>Teléfono</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows || '<tr><td colspan="6">No se encontraron clientes</td></tr>'}
                </tbody>
            </table>
        `;
        this.initEventListenerTable(); // Llamada al método de eventos de la tabla
    }

    // Inicializar eventos generales
    initEventListeners() {
        const form = document.querySelector('.form-client');
        const searchBar = document.getElementById('search-bar-clients'); // Corregido el ID del input de búsqueda
        const cancelEditBtn = document.getElementById('dontSaveClient-btn');

        form.addEventListener('submit', (event) => {
            event.preventDefault();

            const clickedButton = event.submitter; // Esta propiedad identifica cuál botón envió el formulario.
            if (clickedButton.value === "create") {
                this.handleCreateClient();
            } else if (clickedButton.value === "edit") {
                this.handleUpdateClient();
            }
        });

        searchBar.addEventListener('input', (event) => {
            const query = event.target.value.toLowerCase();
            this.handleSearch(query);
        });

        cancelEditBtn.addEventListener('click', (event) =>{
            event.preventDefault();
            this.clearFields();
            this.hideEditButtons();
        })
    }

    // Inicializar eventos de la tabla
    initEventListenerTable() {
        const deleteButtons = document.querySelectorAll('.btn-delete');
        const editButtons = document.querySelectorAll('.btn-edit');

        deleteButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const idClient = button.getAttribute('data-id');
                this.deleteClient(idClient);
            });
        });

        editButtons.forEach((button) => {
            button.addEventListener('click', () => {
                const idClient = button.getAttribute('data-id');
                this.handleEditClient(idClient);
            });
        });
    }

    // Crear cliente
    handleCreateClient() {
        const id = document.getElementById('idClient-formClients').value;
        const name = document.getElementById('nameClient-formClients').value;
        const idType = document.getElementById('idTypeClient-formClients').value;
        const email = document.getElementById('emailClient-formClients').value;
        const address = document.getElementById('addressClient-formClients').value;
        const phone = document.getElementById('phoneClient-formClients').value;

        if (!id || !name || !idType || !email || !address || !phone) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        const user = this.userController.getLoggedUser();
        if (user.getClientById(id)) {
            alert('Ya existe un cliente registrado con este código.');
            return;
        }

        const client = new Client(id, name, idType, email, address, phone);
        user.addNewClient(client.toJSON());
        this.userController.updateUser(user);

        alert('Cliente creado correctamente.');
        this.clearFields();
        this.renderTable();
    }

    // Eliminar cliente
    deleteClient(idClient) {
        const loggedUser = this.userController.getLoggedUser();
        loggedUser.deleteClient(idClient);
        this.userController.updateUser(loggedUser);

        alert('Cliente eliminado correctamente.');
        this.renderTable();
    }

    // Buscar cliente
    handleSearch(query) {
        const loggedUser = this.userController.getLoggedUser();
        const clients = loggedUser.getClients();

        const filteredClients = clients.filter(client => {

            const id = client.getId()?.toLowerCase() || '';
            const name = client.getName()?.toLowerCase() || '';
            const email = client.getEmail()?.toLowerCase() || '';

            return id.includes(query) || name.includes(query) || email.includes(query);
        });

        this.renderTable(filteredClients);
    }

    // Editar cliente
    handleEditClient(idClient) {
        this.showEditButtons();
        const loggedUser = this.userController.getLoggedUser();
        const client = loggedUser.getClientById(idClient);

        if (!client) {
            alert(`No se encontró cliente con el código: ${idClient}`);
            return;
        }

        document.getElementById('idClient-formClients').value = client.getId();
        document.getElementById('idClient-formClients').disabled = true; // ID no editable

        document.getElementById('nameClient-formClients').value = client.getName();
        document.getElementById('idTypeClient-formClients').value = client.getIdType();
        document.getElementById('emailClient-formClients').value = client.getEmail();
        document.getElementById('addressClient-formClients').value = client.getAddress();
        document.getElementById('phoneClient-formClients').value = client.getPhone();
    }

    // Actualizar cliente
    handleUpdateClient() {
        const idClient =  document.getElementById('idClient-formClients').value;
        const name = document.getElementById('nameClient-formClients').value;
        const idType = document.getElementById('idTypeClient-formClients').value;
        const email = document.getElementById('emailClient-formClients').value;
        const address = document.getElementById('addressClient-formClients').value;
        const phone = document.getElementById('phoneClient-formClients').value;

        const loggedUser = this.userController.getLoggedUser();
        const client = loggedUser.getClientById(idClient);

        client.setName(name);
        client.setIdType(idType);
        client.setEmail(email);
        client.setAddress(address);
        client.setPhone(phone);

        this.userController.updateUser(loggedUser);

        alert('Cliente actualizado correctamente.');
        this.renderTable();
        this.hideEditButtons();
        this.clearFields();
    }

    // Limpiar campos del formulario
    clearFields() {
        document.getElementById('idClient-formClients').disabled = false;

        const form = document.querySelector('.form-client');
        form.reset();
    }
}
