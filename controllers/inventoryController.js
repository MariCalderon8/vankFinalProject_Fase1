import { App } from "../main.js";
import { renderInventory } from "../views/inventory.js";

export class InventoryController{

    constructor(){
        this.app = App.getInstance();
    }

    render(){
        this.app.appContent.innerHTML = renderInventory();
    }
}