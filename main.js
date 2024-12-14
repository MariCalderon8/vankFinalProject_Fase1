import { HomeController } from "./controllers/homeController.js";
import { LoginController } from "./controllers/loginController.js";
import { RegisterController } from "./controllers/registerController.js";

class App {
    constructor() {
        this.app = document.getElementById('app');
        this.navButtons = document.querySelectorAll('.navBtn');
        this.navLogo = document.getElementById('navLogo');
        this.currentController = null; 
        this.initEventListeners();
        this.renderView('home');
        this.initStorage();
    }

    // Inicializa los event listeners de la barra de navegación
    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const view = event.target.dataset.view;
                this.renderView(view); 
            });
        });

        // Lógica para el logo de navegación
        this.navLogo.addEventListener('click', () => {
            this.renderView('home');
        });
    }

    // Inicializa el almacenamiento local
    initStorage() {
        if (!localStorage.getItem("users")) {
            localStorage.setItem("users", JSON.stringify([])); 
        }
    }

    renderView(viewName) {
        console.log("Renderizando vista:", viewName);  // Verificar si llega hasta aquí
        this.app.innerHTML = ''; // Limpia el contenido actual

        switch(viewName) {
            case 'home':
                console.log("Renderizando Home");
                this.currentController = new HomeController(this.app);
                break;
            case 'login':
                console.log("Renderizando Login");
                this.currentController = new LoginController(this.app);
                break;
            case 'register':
                console.log("Renderizando Register");
                this.currentController = new RegisterController(this.app);
                break;
            default:
                console.log("Renderizando Home por defecto");
                this.currentController = new HomeController(this.app);
                break;
        }
     
        // Ejecutar el método render del controlador actual
        this.currentController.render();
    }
}   

// Inicializamos la aplicación
document.addEventListener("DOMContentLoaded", () => {
    console.log("Iniciando APP");
    new App();
});