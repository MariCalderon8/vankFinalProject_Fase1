export function renderNavbar() {
    return `
    <nav class="navbar">
        <div class="nav-logo" data-view="home">
            <button class="navBtn navLogo navBtnPrincipal" data-view="home">
                <img src="images/LogoGestionPro.png" alt="Logo">
            </button>
        </div>
        <ul class="nav-links">
            <li><button class="navBtn navBtnPrincipal" id="btnLogin" data-view="login">Iniciar Sesión</button></li>
            <li><button class="navBtn navBtnPrincipal" id="btnRegister" data-view="register">Registrarse</button></li>
        </ul>
    </nav>
    `;
}
