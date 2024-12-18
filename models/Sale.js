import { Product } from "./Product.js";

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

    getTotal(){
        return this.#products.reduce((total, detail) => total + detail.product.getSalePrice() * detail.amount, 0);
    }

    getSubtotalPerProduct(index){
        const detail = this.#products[index];
        if(detail){
            return detail.product.getSalePrice() * detail.amount;
        }else {
            console.log('El producto no se encuentra');
        }
    }

    toJSON() {
        let productsToJSON = this.#products;
        productsToJSON.map(detail => ({ 
            product: detail.product.toJSON(), // Convierte cada producto guardado a formato JSON
            amount: detail.amount
        }));

        return {
            id: this.#id,
            client: this.#client,
            issueDate: this.#issueDate,
            expirationDate: this.#expirationDate,
            paymentMethod: this.#paymentMethod,
            paymentWay: this.#paymentWay,
            products: productsToJSON
        };
    }

    static fromJSONToSale(json) {
        let newSale = new Sale(
            json.client, 
            json.expirationDate, 
            json.paymentMethod, 
            json.paymentWay, 
            json.products
        )
        newSale.#id = json.id;

        const products = json.products || [];
        newSale.#products = products.map(detail => ({
            product: Product.fromJSONtoProduct(detail.product),
            amount: detail.amount
        }))

        
        return newSale;
    }
}
