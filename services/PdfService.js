import { UserController } from "../controllers/usersController.js";
const { jsPDF } = window.jspdf;


export class PdfService {

    constructor() {
        this.userController = new UserController();
    }

    generateBillHtmlFormat(sale) {
        const user = this.userController.getLoggedUser();

        let rows = sale.getProducts().map((saleDetail, i) =>
            `<tr>
                <td>${saleDetail.product.getId()}</td>
                <td>${saleDetail.product.getName()}</td>
                <td>${saleDetail.product.getDescription()}</td>
                <td>${saleDetail.amount}</td>
                <td>$${saleDetail.product.getSalePrice()}</td>
                <td>$${sale.getSubtotalPerProduct(i)}</td>
            </tr>


            `
        ).join('');

        const issueDate = new Date(sale.getIssueDate());
        const expirationDate = new Date(sale.getExpirationDate());

        const billHtmlContent = `
            <div class="billPdf-container">
            <header class="billPdf-header">
                <h1 class="billPdf-title">FACTURA DE COMPRA</h1>
            </header>

            <section class="company-info">
                <h2 class="section-title">EMPRESA EMISORA</h2>
                <div class="info">
                    <p><strong>Nombre/Razón social:</strong> ${user.getName()}</p>
                    <p><strong># de identificación:</strong> ${user.getId()}</p>
                    <p><strong>Dirección:</strong>${user.getAddress() || 'No aplica'}</p>
                    <p><strong>Teléfono:</strong> ${user.getTel() || 'No aplica' }</p>
                </div>
            </section>

            <section class="client-info">
                <h2 class="section-title">CLIENTE</h2>
                <div class="info">
                    <p><strong>Nombre/Razón social:</strong> ${ sale.getClient().name }</p>
                    <p><strong># de identificación:</strong> ${sale.getClient().id}</p>
                    <p><strong>Correo:</strong> ${sale.getClient().email || 'No aplica'}</p>
                </div>
            </section>

            <section class="billPdf-details">
                <h2 class="section-title">DATOS DE LA FACTURA</h2>
                <div class="info">
                    <p><strong>Número de factura:</strong> ${sale.getId()}</p>
                    <p><strong>Fecha de emisión:</strong> ${issueDate.getDate()}/${issueDate.getMonth()+1}/${issueDate.getFullYear()}</p>
                    <p><strong>Fecha de vencimiento:</strong>  ${expirationDate.getDate()}/${expirationDate.getMonth()+1}/${expirationDate.getFullYear()}</p>
                    <p><strong>Forma de pago:</strong> ${sale.getPaymentMethod()}</p>
                    <p><strong>Medio de pago:</strong> ${sale.getPaymentWay()}</p>
                </div>
            </section>

            <section class="products-section">
                <h2 class="section-title">PRODUCTOS O SERVICIOS</h2>
                <table class="products-table">
                    <thead>
                        <tr>
                            <th class="table-header">Código</th>
                            <th class="table-header">Nombre</th>
                            <th class="table-header">Descripción</th>
                            <th class="table-header">Cantidad</th>
                            <th class="table-header">Precio</th>
                            <th class="table-header">Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${rows}
                    </tbody>
                </table>
            </section>

            <section class="total-section">
                <div class="total">
                    <p><strong>TOTAL: $${sale.getTotal()} </strong></p>
                </div>
            </section>
        </div>
        
        <style>
            .billPdf-container {
                width: 80%;
                margin: 20px auto;
                padding: 20px 30px;
                background-color: #ffffff;
                border: 1px solid #dcdcdc;
                box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
            }

            p{
                font-size: 1.5rem;
            }

            section {
                background-color: #dce8f5;
                padding: 5px 20px;
                margin-bottom: 30px;
                border-radius: 10px;
            }

            .billPdf-header {
                text-align: center;
                margin-bottom: 30px;
            }

            .billPdf-title {
                font-size: 3rem;
                color: #004997;
                margin: 0;
            }

            /* Sección general de información */
            .section-title {
                font-size: 2rem;
                color: #004997;
                border-bottom: 2px solid #090f63;
                padding: 10px 0px;
                margin-bottom: 15px;
            }

            /* Contenido de las secciones de empresa y cliente */
            .info {
                color: #363636;
            }

            .info p {
                margin: 5px 0;
            }

            .info strong {
                color: #000;
            }

            /* Tabla de productos o servicios */
            .products-table {
                width: 100%;
                border-collapse: collapse;
                margin-top: 15px;
            }

            .table-header {
                background-color: #6ea6e2;
                padding: 10px;
                text-align: left;
                font-weight: bold;
                border: 1px solid #ddd;
                font-size: 1.5rem;
            }

            .products-table tr {
                font-size: 1.5rem;
            }
            .table-cell {
                padding: 8px;
                text-align: left;
                border: 1px solid #ddd;
                max-width: 200px; /* Ancho máximo de la celda */
                overflow-wrap: break-word; /* Alternativa moderna */ 
            }

            /* Sección de total */
            .total-section {
                text-align: right;
                margin-top: 20px;
            }

            .total p {
                font-size: 2.5rem;
                font-weight: bold;
                color: #333;
            }

        </style>
        `
        return billHtmlContent;
    }

    generatePdfBill(pdfContent, sale, openInNewWindow = false){
        console.log('ENTRO AL MÉTODO DE FACTURA');
        const content = document.createElement('div');
        content.innerHTML = pdfContent;
        document.body.appendChild(content);
        const user = this.userController.getLoggedUser();
        const fileName = `Factura_${sale.getId()}-${user.getName()}`;

        try{
            this.generatePdf(content, fileName, openInNewWindow);

        }catch(error){
            console.error('Hubo un error generando pdf');
        }finally{
            document.body.removeChild(content);
        }

    }

    generatePdf(component, fileName, openInNewWindow = false) {
        
        // Definir márgenes
        const margin = 2; // Márgenes en mm
        const pageWidth = 210; // Ancho de A4 en mm

        html2canvas(component, {
            scale: 2,
            useCORS: true,
            logging: false,
        }).then((canvas) => {
            const pdf = new jsPDF({
                orientation: 'portrait',
                unit: 'mm',
                format: 'a4',
            });

            // Calcular dimensiones ajustadas con márgenes
            const imgWidth = pageWidth - 2 * margin; // Ancho ajustado
            const imgHeight = (canvas.height * imgWidth) / canvas.width; // Mantener proporción de la imagen

            // Coordenadas con margen
            const x = margin;
            const y = margin;

            // Si la imagen cabe en una sola página
            const imgData = canvas.toDataURL('image/png');
            pdf.addImage(imgData, 'PNG', x, y, imgWidth, imgHeight);

            if (openInNewWindow) {
                // Abrir PDF en una nueva ventana
                const pdfBlobUrl = pdf.output('bloburl');
                window.open(pdfBlobUrl, '_blank');
                console.log('En otra ventan');
            } else {
                // Descargar PDF
                console.log('Descargar');
                pdf.save(`${fileName}.pdf`);
            }

        }).catch((error) => {
            console.error('Error generating PDF:', error);
        });


    }


}
