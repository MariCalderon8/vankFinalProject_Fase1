import { renderRegister } from "../views/register.js";

export class RegisterController{
    constructor(app) {
        this.app = app;
    }

    render() {
        this.app.innerHTML = renderRegister();
        this.initEventListeners(); 
    }

    initEventListeners() {
        const form = document.querySelector('.register-form');
        const cancelButton = document.querySelector('.cancel-button');
        
        // Manejar el envío del formulario
        form.addEventListener('submit', (event) => {
            event.preventDefault(); 
            console.log("Formulario enviado");
            this.handleRegister();  
        });

        // Manejar el botón de cancelar
        cancelButton.addEventListener('click', () => {
            console.log("Botón de cancelar presionado");
            this.app.renderView('home');  
        });
    }

    handleRegister() {
        console.log("Procesando el registro...");
         // Obtener los valores del formulario
         const name = document.getElementById('name-register').value;
         const idType = document.getElementById('idType-register').value;
         const id = document.getElementById('id-register').value;
         const email = document.getElementById('email-register').value;
         const password = document.getElementById('password-register').value;
         const tel = document.getElementById('tel-register').value;
         const address = document.getElementById('address-register').value;

          // Validaciones
        if (!name || !idType || !id || !email || !password || !tel) {
            alert('Por favor, complete todos los campos requeridos.');
            return;
        }

        const users = JSON.parse(localStorage.getItem("users")) || [];

        // Verificar si el correo electrónico ya está registrado
        const userExists = users.some(user => user.email === email);
        if (userExists) {
            alert('Este correo electrónico ya está registrado.');
            return;
        }

        // Crear un nuevo objeto de usuario
        const newUser = {
            name,
            idType,
            id,
            email,
            password,
            tel,
            address
        };

        // Agregar el nuevo usuario al array de usuarios
        users.push(newUser);
        localStorage.setItem("users", JSON.stringify(users));

        alert('Registro exitoso. Ahora puedes iniciar sesión.');
        this.app.renderView('login');  // Redirigir a la vista de login

    }

}