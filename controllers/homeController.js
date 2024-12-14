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
        if(!this.app.loggedUser){
            this.app.appContent.innerHTML = renderHome();
        } else {
            this.app.appContent.innerHTML = renderHomeUser();
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

