export function renderReports() {
    return `
     <div id="chatbox">
        <div id="chat-header">
            <h4>Asistente Financiero</h4>
        </div>
        <div id="chat-body">
            <div id="chat-messages">
                <!-- Los mensajes se agregarán aquí dinámicamente -->
            </div>
        </div>
        <div id="chat-footer">
            <input type="text" id="chat-input" placeholder="Escribe tu mensaje aquí...">
            <button type="button" id="chat-send">Enviar</button>
        </div>
    </div>
    `;
}
