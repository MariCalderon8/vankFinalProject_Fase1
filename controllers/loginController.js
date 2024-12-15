import { App } from "../main.js";
import { User } from "../models/User.js";
import { renderLogin } from "../views/login.js";

export class LoginController {
    constructor() {
        this.app = App.getInstance(); 
    }

    render(){
        this.app.appContent.innerHTML = renderLogin();
        this.initEventListeners();
    }

    initEventListeners() {
        const form = document.querySelector('.login-form');
        const registerLink = document.querySelector('.register-link a');

        // Maneja el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault(); // Evitar el envío por defecto
            this.handleLogin();  // Maneja el inicio de sesión
        });

        // Maneja el enlace "Regístrate Aquí"
        registerLink.addEventListener('click', (event) => {
            event.preventDefault(); 
            console.log("Enlace 'Regístrate Aquí' presionado");
            this.app.renderView('register'); // Redirigir a la vista de registro
        });
    }

    handleLogin() {
        // Obtiene los valores del formulario
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

        // Redirigir al usuario a la página principal o dashboard 
        alert('Bienvenido, ' + userExists.name + '!');
        localStorage.setItem("loggedUser", userExists.email);
        this.app.renderView('home');  // Vuelve a la vista de inicio o a un dashboard
    }
}