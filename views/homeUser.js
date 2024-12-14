export function renderHomeUser() {
    console.log('Rendering Home User Logged');
    return `
        <section class="home">
            <div class="home-content">
                <h1>¡Bienvenido!</h1>
                <p>Gestiona tus ventas, inventarios y usuarios de manera eficiente.</p>
                <button class="btn-home btn-actions" data-view="inventory">Gestionar inventario</button>
                <button class="btn-home btn-actions" data-view="users">Gestionar usuarios</button>
                <button class="btn-home btn-actions" data-view="billing">Generar factura</button>
                <button class="btn-home btn-actions" data-view="reports">Ver reportes IA</button>
            </div>
        </section>
    `;
}
