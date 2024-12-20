// controllers/homeController.js
import { App } from "../main.js";
import { renderHome } from "../views/home.js";
import { renderHomeUser } from "../views/homeUser.js";
import { GraphicsService } from "../services/GraphicsService.js";
import { UserController } from "./usersController.js";
import { PdfService } from "../services/PDFService.js";

export class HomeController {

    constructor() {
        this.app = App.getInstance();
        this.graphicsService = new GraphicsService();
        this.homeButtons = null;
        this.userController = new UserController();
        this.pdfService = null;
    }

    render() {
        if (!this.app.isLogged()) {
            this.app.appContent.innerHTML = renderHome();
        } else {
            const user = this.userController.getLoggedUser();
            this.app.appContent.innerHTML = renderHomeUser();
            this.renderHomeUserData();

            if (user.getSaleHistory().length > 0) {
                this.renderStatsHome();
            }

        }
        this.initEventListeners();
    }

    initEventListeners() {
        this.homeButtons = document.querySelectorAll('.btn-home');
        this.homeButtons.forEach(btn => {
            btn.addEventListener('click', (event) => {
                const view = event.target.dataset.view;
                this.app.renderView(view);
            });
        });
    }

    initEventListenersHomeUser() {
        const genrateReport = document.querySelector('.generate-report');
        genrateReport.innerHTML = `<button id="downloadPdf">Descarga Reporte</button>`

        const btnDownload = document.getElementById('downloadPdf');
        const dashboard = document.querySelector('.dashboard');
        btnDownload.addEventListener('click', () => {
            this.pdfService.generatePdf(dashboard, 'Reporte');
        })
    }

    renderStatsHome(){
        this.pdfService = new PdfService();
        this.renderCharts();
        this.renderGeneralStats();
        this.initEventListenersHomeUser();
    }

    renderHomeUserData() {
        const user = this.userController.getLoggedUser();
        const welcome = document.querySelector('.home-welcome');
        const date = new Date();

        welcome.innerHTML = `
            <h1>¡Bienvenido, ${user.getName()}!</h1>
                    <p>Gestiona tus ventas, inventarios y usuarios de manera eficiente.</p>
        `

        const homeInfo = document.querySelector('.home-header');
        homeInfo.innerHTML = `
            <h2>Información de la empresa</h2>
            <div class="home-info">
                <div class="company-info">
                    <p><strong>Nombre: </strong>${user.getName()}</p>
                    <p><strong>ID: </strong> ${user.getId()}</p>
                    <p><strong>Tel.: </strong> ${user.getTel()}</p>
                </div>
                <div class="company-info">
                    <p><strong>Correo: </strong> ${user.getEmail()}</p>
                    <p><strong>Dirección: </strong> ${user.getAddress()}</p>
                </div>
                <p class="date"><strong>${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</strong></p>
            </div>
        `
    }

    renderGeneralStats() {
        const user = this.userController.getLoggedUser();
        const statsContainer = document.querySelector('.statshome-container');
        statsContainer.innerHTML = `
            <div class="stathome-card">
                <div class="stat-title">Ventas del mes</div>
                <div class="stat-value">$${user.getMonthSales()}</div>
            </div>
            <div class="stathome-card">
                <div class="stat-title">Unidades Vendidas del mes</div>
                <div class="stat-value">${user.getMonthUnitsSold()}</div>
            </div>
        `
    }

    renderCharts() {
        let charts = document.querySelector('.chart-conteiner');
        charts.innerHTML = `
                <div class = "graphics">
                    <div class = "graphic-lines">
                    <h2 class="graphic-title">Gananacias diarias</h2>
                        <canvas id = "graphic-lines">
                        </canvas>
                    </div>
                    <div class = "graphic-bar">
                    <h2 class="graphic-title">Ventas mensuales</h2>
                        <canvas id = "graphic-bar">
                        </canvas>
                    </div>
                </div>
                <div class = "graphic-pie">
                    <h2 class="graphic-title">Ganancia por producto</h2>
                    <canvas id = "graphic-pie">
                    </canvas>
                </div>
        `

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
        const lineLabels = Array.from({ length: daysInMonth }, (_, i) => `Día ${i + 1}`);
        const lineData = user.getDailyProfitsForMonth(currentMonth);

        this.graphicsService.createLineGraphic(graphicLine, `Ganancias Diarias - ${currentDate.toLocaleString('es', { month: 'long' })}`, lineLabels, lineData, bluePalette);

        //Gráfico de barras
        const graphicBar = document.getElementById('graphic-bar');

        const barLabels = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const barData = barLabels.map((_, index) => user.getTotalSalesByMonth(index + 1));

        this.graphicsService.createBarGraphic(graphicBar, "Ventas por Mes", barLabels, barData, bluePalette);

        //Gráfico de torta
        const graphicPie = document.getElementById('graphic-pie');
        const productProfits = user.getProductProfits();
        const pieLabels = Object.keys(productProfits).map(productId => {
            const product = user.getProductById(productId);
            return product.getName();
        });

        const pieData = Object.values(productProfits);

        this.graphicsService.createPieGraphic(graphicPie, "Ganancias por Producto", pieLabels, pieData);

    }
}

