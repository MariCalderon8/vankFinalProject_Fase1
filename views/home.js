// views/home.js
export function renderHome() {
    console.log('Rendering Home view');
    return `
        <section class="home">
            <div class="home-content">
                <h1>¡Bienvenido a GestionPro!</h1>
                <p>Gestiona tus ventas, inventarios y usuarios de manera eficiente.</p>
                <button class="btn-home btn-primary" data-view="login">Inicia Sesión</button>
            </div>
            <div class="home-image">
                <img src="images/ImagenHome.jpg" alt="Gestión de negocios" />
            </div>
        </section>
    `;
}
