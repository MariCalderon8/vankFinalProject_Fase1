// controllers/homeController.js
import { App } from "../main.js";
import { renderHome } from "../views/home.js";
import { renderHomeUser } from "../views/homeUser.js";

export class HomeController {
    
    constructor() {
        this.app = App.getInstance();
        this.homeButtons = null;
    }

    render(){
        if(!this.app.isLogged()){
            this.app.appContent.innerHTML = renderHome();
            console.log('Sin loggear');
        } else {
            this.app.appContent.innerHTML = renderHomeUser();
            console.log('Con log');

        }
        this.initEventListeners();
    }

    initEventListeners() {
        this.homeButtons = document.querySelectorAll('.btn-home');
        this.homeButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const view = event.target.dataset.view;
                console.log("Cambiar a vista:", view);
                this.app.renderView(view);
            });
        });
        
    }
}

