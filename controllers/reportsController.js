import { App } from "../main.js";
import { AiService } from "../services/AiService.js";
import { renderReports } from "../views/reports.js";

export class ReportsController{

    constructor(){
        this.app = App.getInstance();
        this.aiService = new AiService();
    }

    render(){
        this.app.appContent.innerHTML = renderReports();
        this.initEventListeners();
        this.aiService.initChat();
    }

    initEventListeners(){
        const sendBtn = document.getElementById('chat-send');
        sendBtn.addEventListener('click', async (event) => {
            event.preventDefault();
            await this.handlePromptSend();
        });

        const promptInput = document.getElementById('chat-input');
        promptInput.addEventListener('keypress', async (event) => {
            if (event.key === 'Enter') {
                event.preventDefault();
                await this.handlePromptSend();
            }
        });
    }

    async handlePromptSend(){
        const chatMessages = document.getElementById('chat-messages');
        const chatBody = document.getElementById('chat-body');
        let prompt = document.getElementById('chat-input').value;
        if(prompt == ''){
            alert('Por favor ingrese un mensaje');
        }

        const iaResponse = await this.aiService.generateChatResponse(prompt);
        const userMessage = document.createElement('div');
        userMessage.textContent = prompt;
        userMessage.classList.add('message');
        userMessage.classList.add('user-message')
        chatMessages.appendChild(userMessage);

        const iaMessage = document.createElement('div');
        iaMessage.innerHTML = iaResponse;
        iaMessage.classList.add('message');
        iaMessage.classList.add('assistant-message');
        chatMessages.appendChild(iaMessage);

        document.getElementById('chat-input').value = '';
        chatBody.scrollTop = chatBody.scrollHeight;
    }

}