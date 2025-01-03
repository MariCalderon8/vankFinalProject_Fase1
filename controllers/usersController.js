//controllers/usersController
import { User } from "../models/User.js";

export class UserController{

    getLoggedUser(){
        const email = localStorage.getItem("loggedUser");
        return this.findUser(email);
    }

    findUser(email){
        const users = JSON.parse(localStorage.getItem("users")) || [];

        const userExists = users.find(u => u.email == email);
        if (!userExists) {
            return;
        }
        return User.fromJSON(userExists);
    }

    updateUser(user){
        const users = JSON.parse(localStorage.getItem("users")) || [];
        const userIndex = users.findIndex(u => u.email === user.getEmail());

        if (userIndex === -1) {
            return;
        }
        users[userIndex] = user.toJSON();

        // Guardar los usuarios actualizados en el localStorage
        localStorage.setItem("users", JSON.stringify(users));

    }
}