// main.js
import { HomeController } from "./controllers/homeController.js";
import { LoginController } from "./controllers/loginController.js";
import { RegisterController } from "./controllers/registerController.js";
import { renderHome } from "./views/home.js";
import { renderLogin } from "./views/login.js";
import { renderRegister } from "./views/register.js";

export class App {
    static #instance = null;
    #appContent;
    constructor() {
        if (App.#instance) {
            throw new Error("Sólo puede haber una instancia");
        }

        this.#appContent = document.getElementById('app');
        this.navButtons = document.querySelectorAll('.navBtn');
        this.navLogo = document.getElementById('navLogo');
        this.currentController = null;

        this.#initEventListeners();
        this.#initStorage();
    }

    static getInstance() {
        if (!App.#instance) {
            App.#instance = new App();
        }
        return App.#instance;
    }

    // Inicializa los event listeners de la barra de navegación
    #initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const view = event.target.dataset.view;
                console.log("Cambiar a vista:", view);
                this.renderView(view);
            });
        });
    }

    // Inicializa el almacenamiento local
    #initStorage() {
        if (!localStorage.getItem("users")) {
            localStorage.setItem("users", JSON.stringify([]));
        }
    }

    renderView(viewName) {
        console.log("Renderizando vista:", viewName); // Verificar si llega hasta aquí
        this.#appContent.innerHTML = ''; // Limpia el contenido actual

        switch (viewName) {
            case 'home':
                console.log("Renderizando Home");
                this.#appContent.innerHTML = renderHome(); // Renderiza el HTML de la vista home
                this.currentController = new HomeController();
                break;

            case 'login':
                console.log("Renderizando Login");
                this.#appContent.innerHTML = renderLogin(); // Renderiza el HTML de la vista Login
                this.currentController = new LoginController();
                break;

            case 'register':
                console.log("Renderizando Register");
                this.#appContent.innerHTML = renderRegister(); // Renderiza el HTML de la vista register
                this.currentController = new RegisterController();
                break;
                
            default:
                console.log("Renderizando Home por defecto");
                this.#appContent.innerHTML = renderHome(); // Renderiza el HTML de la vista home por defecto
                this.currentController = new HomeController();
                break;
        }

    }
}

// Inicializamos la aplicación
document.addEventListener("DOMContentLoaded", () => {
    console.log("Iniciando APP");
    const app = App.getInstance();
    app.renderView('home');
});
