import { App } from "../main.js";
import { renderBilling } from "../views/billing.js";

export class BillingController{

    constructor(){
        this.app = App.getInstance();
    }

    render(){
        this.app.appContent.innerHTML = renderBilling();
    }
}