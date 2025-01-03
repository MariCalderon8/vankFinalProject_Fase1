// main.js
import { BillingController } from "./controllers/billingController.js";
import { HomeController } from "./controllers/homeController.js";
import { InventoryController } from "./controllers/inventoryController.js";
import { LoginController } from "./controllers/loginController.js";
import { RegisterController } from "./controllers/registerController.js";
import { ReportsController } from "./controllers/reportsController.js";
import { ClientsController } from "./controllers/clientsController.js";

import { renderNavbar } from "./views/navBar.js";
import { renderUserNavbar } from "./views/navBarUser.js";

export class App {
    static #instance = null;
    #navbarContent;
    constructor() {
        if (App.#instance) {
            throw new Error("Sólo puede haber una instancia");
        }

        this.appContent = document.getElementById('app');
        this.#navbarContent = document.getElementById('navbar');

        this.navButtons = null;
        this.logoutBtn = null;

        this.currentController = null;

        this.#showNavbar();
        this.#initStorage();
    }

    static getInstance() {
        if (!App.#instance) {
            App.#instance = new App();
        }
        return App.#instance;
    }

    isLogged(){
        if(!localStorage.getItem("loggedUser")){
            return false;
        }
        return true;
    }

    #showNavbar(){
        if(!this.isLogged()){
            this.#navbarContent.innerHTML = renderNavbar();
        } else {
            this.#navbarContent.innerHTML = renderUserNavbar();
        }

        this.#initEventListeners();
    }

    // Inicializa los event listeners de la barra de navegación
    #initEventListeners() {
        this.navButtons = document.querySelectorAll('.navBtn');
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const view = event.target.dataset.view;
                this.renderView(view);
            });
        });

        // Inicializa el botón para cerrar sesión

        if (this.isLogged()) {
            this.logoutBtn = document.getElementById('btnLogout');
            this.logoutBtn.addEventListener('click', (event) =>{
                const view = event.target.dataset.view;
                this.#logout();
                this.renderView(view);
            })

        }
    }

    #logout(){
        localStorage.removeItem("loggedUser");
    }

    // Inicializa el almacenamiento local
    #initStorage() {
        if (!localStorage.getItem("users")) {
            localStorage.setItem("users", JSON.stringify([]));
        }
    }

    renderView(viewName) {
        this.#showNavbar();
        this.appContent.innerHTML = ''; // Limpia el contenido actual

        switch (viewName) {
            case 'home':
                this.currentController = new HomeController();
                break;

            case 'login':
                this.currentController = new LoginController();
                break;

            case 'register':
                this.currentController = new RegisterController();
                break;

            case 'users':
                this.currentController = new ClientsController();
                break;

            case 'inventory':
                this.currentController = new InventoryController();
                break;

            case 'billing':
                this.currentController = new BillingController();
                break;
                
            case 'reports':
                this.currentController = new ReportsController();
                break;

            default:
                this.currentController = new HomeController();
                break;
        }
        this.currentController.render();

    }
}

// Inicializamos la aplicación
document.addEventListener("DOMContentLoaded", () => {
    const app = App.getInstance();
    app.renderView('home');
});
