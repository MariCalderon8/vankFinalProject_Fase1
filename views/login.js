export function renderLogin() {
    return `
        <div class="login-view">
            <div class="login-container">
                <h2>Iniciar Sesión</h2>
                <form class="login-form">
                    <div class="form-group">
                        <label for="user-login">Correo: </label>
                        <input type="text" id="user-login" placeholder="myUser_example" required>
                    </div>
                    <div class="form-group">
                        <label for="password-login">Contraseña</label>
                        <input type="password" id="password-login" placeholder="*****" required>
                    </div>
                    <button type="submit" class="login-button">Entrar</button>
                    <span class="register-link">¿No tienes cuenta? Regístrate <a href="#" data-view="register">Aquí</a></span>
                </form>
            </div>
        </div>
    `;
}