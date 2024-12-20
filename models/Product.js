//models/product.js
export class Product{
    #id;
    #name;
    #category;
    #description;
    #unitPrice;
    #salePrice;

    constructor(id, name, category, description, unitPrice, salePrice){
        this.#id = id;
        this.#name = name;
        this.#category = category;
        this.#description = description;
        this.#unitPrice = unitPrice;
        this.#salePrice = salePrice;
    }

    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            category: this.#category,
            description: this.#description,
            unitPrice: this.#unitPrice,
            salePrice: this.#salePrice,
        };
    }

    static fromJSONtoProduct(json){
        return new Product(
            json.id, 
            json.name, 
            json.category, 
            json.description, 
            json.unitPrice, 
            json.salePrice);
    }

    // Getters
    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getCategory() {
        return this.#category;
    }

    getDescription() {
        return this.#description;
    }

    getUnitPrice() {
        return this.#unitPrice;
    }

    getSalePrice() {
        return this.#salePrice;
    }

    // Setters
    setName(value) {
        this.#name = value;
    }

    setCategory(value) {
        this.#category = value;
    }

    setDescription(value) {
        this.#description = value;
    }

    setUnitPrice(value) {
        this.#unitPrice = value;
    }

    setSalePrice(value) {
        this.#salePrice = value;
    }

    getProfitMargin(){
        console.log(`GANANCIA DESDE PRODUCTO: ${this.#salePrice - this.#unitPrice} `);
        return (((this.#salePrice - this.#unitPrice) / this.#salePrice) * 100).toFixed(2); 
    }

}