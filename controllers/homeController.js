// controllers/homeController.js
import { renderHome } from "../views/home.js";

export class HomeController {
    constructor(app) {
        this.app = app;
    }

    render() {
        console.log('Rendering Home view');
        this.app.innerHTML = renderHome(); // Renderiza el HTML de la vista home
        this.initEventListeners(); // Agrega los event listeners necesarios
    }

    initEventListeners() {
        const loginButton = document.querySelector('.btn-primary');
        if (loginButton) {
            loginButton.addEventListener('click', () => {
                this.app.renderView('login'); 
            });
        }
    }
}

