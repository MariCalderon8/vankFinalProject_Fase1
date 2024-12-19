import { UserController } from "../controllers/usersController";

export class AiServiceChat {

    constructor() {
        this.API_KEY = '1pr4cRDlqevCUzhtEt8W53mWnXkKk';
        this.URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${this.API_KEY}`;
        this.chat = null;
        this.userController = new UserController();
    }

    getIaResponse(prompt) {
        return fetch(this.URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                contents: [{
                    parts: [
                        { text: prompt }
                    ]
                }]
            })
        })
            .then(respuesta => {
                if (!respuesta.ok) {
                    throw new Error(`Error HTTP: ${respuesta.status}`);
                }
                return respuesta.json();
            })
            .then(datos => {
                const textoGenerado = datos.candidates[0].content.parts[0].text;

                console.log(textoGenerado);
                return textoGenerado;
            })
            .catch(error => {
                console.error('Error al llamar a la API de Gemini:', error);
            });
    }

    #generateInitialPrompt(sales){
        const user = this.userController.getLoggedUser().toJSON();
        return `Dame un análisis de las siguientes ventas: ${user.saleHistory}`;
    }

    startChat(sales) {
        this.chat = model.startChat({
            history: [
              {
                role: "user",
                parts: [{ text: this.#generateInitialPrompt()}],
              },
              {
                role: "model",
                parts: null,
              },
            ],
          });
    }

    async sendChatMessage(message) {
        try {
            const result = await chat.sendMessage(mensaje);
            const respuesta = result.response.text();
            console.log('Respuesta del modelo:', respuesta);
            return respuesta;
          } catch (error) {
            console.error('Error al enviar mensaje al chat:', error);
            return null;
          }
    }



    getHistorial() {
        return this.chat.history;
    }
}