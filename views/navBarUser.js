export function renderUserNavbar() {
    return `
    <nav class="navbar">
        <div class="nav-logo" data-view="home">
            <button class="navBtn navLogo navBtnPrincipal">
                <img src="images/LogoGestionPro.png" alt="Logo">
            </button>
        </div>
        <ul class="nav-links">
            <li><button class="navBtn navBtnPrincipal" id="btnLogout" data-view="home">Cerrar Sesión</button></li>
        </ul>
    </nav>
    <nav class="sub-navbar">
        <ul class="subNavbar">
            <li><button class="navBtn navBtnSub" id="btnHome" data-view="home">Home</button></li>
            <li><button class="navBtn navBtnSub" id="btnUsers" data-view="users">Usuarios</button></li>
            <li><button class="navBtn navBtnSub" id="btnInventory" data-view="inventory">Inventario</button></li>
            <li><button class="navBtn navBtnSub" id="btnBilling" data-view="billing">Facturación</button></li>
            <li><button class="navBtn navBtnSub" id="btnReports" data-view="reports">Reportes</button></li>
        </ul>
    </nav>
    `;
}
