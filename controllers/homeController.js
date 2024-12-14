// controllers/homeController.js
import { App } from "../main.js";

export class HomeController {
    
    constructor() {
        this.app = App.getInstance();
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

