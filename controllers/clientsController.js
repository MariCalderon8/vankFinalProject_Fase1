import { App } from "../main.js";
import { renderClients } from "../views/clients.js";

export class ClientsController{

    constructor(){
        this.app = App.getInstance();
    }

    render(){
        this.app.appContent.innerHTML = renderClients();
    }
}