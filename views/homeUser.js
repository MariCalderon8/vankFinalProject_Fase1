//Views/homeUser.js
export function renderHomeUser() {
    console.log('Rendering Home User Logged');
    return `
        <section class="home">
            <div class = "home-init">
                
            </div>
            <div class = "chart-conteiner">
                <div class = "graphics">
                <div class = "graphic-lines">
                    <canvas id = "graphic-lines">
                    </canvas>
                </div>
                <div class = "graphic-bar">
                    <canvas id = "graphic-bar">
                    </canvas>
                </div>
                </div>
                <div class = "graphic-pie">
                    <canvas id = "graphic-pie">
                    </canvas>
                </div>
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
