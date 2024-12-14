export function renderRegister() {
    return `
        <div class="register-view">
            <div class="register-container">
                <h2>Registro</h2>
                <form class="register-form">
                    <div class="form-group">
                        <label for="name-register">Nombre: </label>
                        <input type="text" id="name-register" placeholder="Nombre" required>
                    </div>

                    <div class="form-group">
                        <label for="idType-register">Tipo de ID: </label>
                        <select id="idType-register" required>
                            <option value="">Seleccione un tipo</option>
                            <option value="NIT">NIT</option>
                            <option value="CC">Cédula de Ciudadanía</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="id-register"># ID: </label>
                        <input type="text" id="id-register" placeholder="Número de identificación" required>
                    </div>

                    <div class="form-group">
                        <label for="email-register">Correo electrónico: </label>
                        <input type="email" id="email-register" placeholder="Correo electrónico" required>
                    </div>

                    <div class="form-group">
                        <label for="password-register">Contraseña: </label>
                        <input type="password" id="password-register" placeholder="Contraseña" required>
                    </div>

                    <div class="form-group">
                        <label for="tel-register">Teléfono de contacto: </label>
                        <input type="tel" id="tel-register" placeholder="Número de teléfono" required>
                    </div>

                    <div class="form-group">
                        <label for="address-register">Dirección: </label>
                        <input type="text" id="address-register" placeholder="Dirección de residencia">
                    </div>

                    <div class="form-actions">
                        <button type="button" class="cancel-button">Cancelar</button>
                        <button type="submit" class="register-button">Registrarse</button>
                    </div>
                </form>
                 <div class="register-link">
                    <p>¿Ya tienes cuenta? <a href="#" data-view="login">Iniciar sesión</a></p>
                </div>
            </div>
        </div>
    `;
}