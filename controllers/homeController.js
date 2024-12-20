// controllers/homeController.js
import { App } from "../main.js";
import { renderHome } from "../views/home.js";
import { renderHomeUser } from "../views/homeUser.js";
import { GraphicsService } from "../services/GraphicsService.js";
import { UserController } from "./usersController.js";

export class HomeController {
    
    constructor() {
        this.app = App.getInstance();
        this.graphicsService = new GraphicsService();
        this.homeButtons = null;
        this.userController = new UserController();
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
        this.renderHome();
        this.renderCharts();
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

    renderHome(){
        console.log('Rendering Home User Logged');
        const user = this.userController.getLoggedUser();
        const homeInit = document.querySelector('.home-init');
        
        homeInit.innerHTML=`
                <div class="home-welcome">
                    <h1>¡Bienvenido, ${user.getName()}!</h1>
                    <p>Gestiona tus ventas, inventarios y usuarios de manera eficiente.</p>
                </div>
                
                <!-- Información de la empresa -->
                <div class="home-info">
                    <h2>Información de la Empresa</h2>
                    <p><strong>Nombre:</strong> ${user.getName()}</p>
                    <p><strong>ID Empresa:</strong> ${user.getId()}</p>
                    <p><strong>Teléfono:</strong> ${user.getTel()}</p>
                    <p><strong>Correo:</strong> ${user.getEmail()}</p>
                    <p><strong>Dirección:</strong> ${user.getAddress()}</p>
                </div>
        `
    }

    renderCharts(){

        const user = this.userController.getLoggedUser();

        const bluePalette = [
            '#64B5F6', // Azul suave
            '#42A5F5', // Azul vibrante
            '#1E88E5', // Azul más intenso
            '#1976D2', // Azul medio
            '#1565C0', // Azul oscuro
            '#90CAF9', // Azul pálido pero saturado
            '#81D4FA', // Azul brillante
            '#4FC3F7', // Azul claro y saturado
            '#29B6F6', // Azul claro pero vivo
            '#039BE5'  // Azul fuerte
        ];
        
        
        //Grafico de línea
        const graphicLine = document.getElementById('graphic-lines');

        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1;
        const daysInMonth = new Date(currentDate.getFullYear(), currentMonth, 0).getDate();
        const lineLabels = Array.from({length : daysInMonth}, (_, i) => `Día ${i + 1 }`);
        const lineData = user.getDailyProfitsForMonth(currentMonth);

        this.graphicsService.createLineGraphic(graphicLine, `Ganancias Diarias - ${currentDate.toLocaleString('es', {month: 'long'})}`, lineLabels, lineData, bluePalette);

        //Gráfico de barras
        const graphicBar = document.getElementById('graphic-bar');

        const barLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const barData = barLabels.map((_, index) => user.getTotalSalesByMonth(index+1));

        this.graphicsService.createBarGraphic(graphicBar, "Ventas por Mes", barLabels, barData, bluePalette);
        
        //Gráfico de torta
        const graphicPie = document.getElementById('graphic-pie');
        const productProfits = user.getProductProfits();
        const pieLabels = Object.keys(productProfits).map(productId =>{
            const product = user.getProductById(productId);
            return product.getName();
        });

        const pieData = Object.values(productProfits);

        this.graphicsService.createPieGraphic(graphicPie, "Ganancias por Producto", pieLabels, pieData, bluePalette);

    }
}

