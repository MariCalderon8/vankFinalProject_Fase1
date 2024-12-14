import { App } from "../main.js";
import { renderReports } from "../views/reports.js";

export class ReportsController{

    constructor(){
        this.app = App.getInstance();
    }

    render(){
        this.app.appContent.innerHTML = renderReports();
    }
}