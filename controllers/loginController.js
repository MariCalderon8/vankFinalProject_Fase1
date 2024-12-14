import { renderLogin } from "../views/login.js";

export class LoginController {
    constructor(app) {
        this.app = app;
    }

    render() {
        this.app.innerHTML = renderLogin();  // Renderiza la vista de login
        this.initEventListeners();  // Inicializa los event listeners
    }

    initEventListeners() {
        const form = document.querySelector('.login-form');
        
        // Manejar el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evitar el envío por defecto
            this.handleLogin();  // Manejar el inicio de sesión
        });
    }

    handleLogin() {
        // Obtener los valores del formulario
        const user = document.getElementById('user-login').value;
        const password = document.getElementById('password-login').value;

        // Validación de los campos
        if (!user || !password) {
            alert('Por favor, ingresa tanto el usuario como la contraseña.');
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Buscar si el usuario existe en el localStorage
        const userExists = users.find(u => u.email === user && u.password === password);
        if (!userExists) {
            alert('Usuario o contraseña incorrectos.');
            return;
        }

        //Esto hay que cambiarlo
        // Redirigir al usuario a la página principal o dashboard 
        alert('Bienvenido, ' + userExists.name + '!');
        this.app.renderView('home');  // Vuelve a la vista de inicio o a un dashboard
    }
}