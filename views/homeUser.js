//Views/homeUser.js
export function renderHomeUser() {
    return `
        <section class="home-user">
            <div class = "home-welcome"> <!-- Muestra la bienvenida -->
            
            </div>
            
            <div class="dashboard">

                <div class="home-header"></div> <!-- Muestra la info de la empresa -->
                <div class="statshome-container"></div>

                <div class="chart-conteiner">
                    
                </div>
            </div>

            <div class="generate-report">
                
            </div>

            <div class="home-buttons">
                <button class="btn-home btn-actions" data-view="inventory">Gestionar inventario</button>
                <button class="btn-home btn-actions" data-view="users">Gestionar usuarios</button>
                <button class="btn-home btn-actions" data-view="billing">Generar factura</button>
                <button class="btn-home btn-actions" data-view="reports">Ver reportes IA</button>
            </div>
        </section>
    `;
}
