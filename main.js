import { renderHome } from "./views/home.js";
import { renderLogin } from "./views/login.js";
import { renderRegister } from "./views/register.js";

class App {
    constructor() {
        this.app = document.getElementById('app');
        this.navButtons = document.querySelectorAll('.navBtn');
        this.navLogo = document.getElementById('navLogo');
        
        this.initEventListeners();
        this.renderView('home');
        this.initStorage();
    }

    initEventListeners() {
        this.navButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const view = event.target.dataset.view;
                this.renderView(view);
            });
        });
    }

    initStorage(){
        localStorage.setItem("users", JSON.stringify([]));
    }

    renderView(viewName) {
        switch(viewName) {
            case 'home':
                this.app.innerHTML = renderHome();
                break;
            case 'login':
                this.app.innerHTML = renderLogin();
                break;
            case 'register':
                this.app.innerHTML = renderRegister();
                break;
            default:
                this.app.innerHTML = renderHome();
                break;
        }
    }
}

new App();