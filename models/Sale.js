//models/sale.js
export class Sale {
    static saleCounter = 0;
    
    #id;
    #client;
    #issueDate;
    #expirationDate;
    #paymentMethod;
    #paymentWay;
    #products;

    constructor(client, expirationDate, paymentMethod, paymentWay, products) {
        this.#id = -1;
        this.#client = client;
        this.#issueDate = new Date();
        this.#expirationDate = expirationDate;
        this.#paymentMethod = paymentMethod;
        this.#paymentWay = paymentWay;
        this.#products = products;
    }

    getClient() {
        return this.#client;
    }

    getIssueDate() {
        return this.#issueDate;
    }

    getExpirationDate() {
        return this.#expirationDate;
    }

    getPaymentMethod() {
        return this.#paymentMethod;
    }

    getPaymentWay() {
        return this.#paymentWay;
    }

    getProducts() {
        return this.#products;
    }

    getId() {
        return this.#id;
    }

    setId(id){
        this.#id = id;
    }

    toJSON() {
        return {
            id: this.#id,
            client: this.#client,
            issueDate: this.#issueDate,
            expirationDate: this.#expirationDate,
            paymentMethod: this.#paymentMethod,
            paymentWay: this.#paymentWay,
            products: this.#products
        };
    }

    static fromJSONToSale(sale) {
        let newSale = new Sale(
            sale.client, 
            sale.expirationDate, 
            sale.paymentMethod, 
            sale.paymentWay, 
            sale.products
        )
        newSale.setId(sale.id);
        return newSale;
    }
}
