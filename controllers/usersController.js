import { App } from "../main.js";
import { renderUsers } from "../views/users.js";

export class UsersController{

    constructor(){
        this.app = App.getInstance();
    }

    render(){
        this.app.appContent.innerHTML = renderUsers();
    }
}