export class Product{
    #id;
    #name;
    #category;
    #description;
    #unitPrice;
    #salePrice;
    #supplier;

    constructor(id, name, category, description, unitPrice, salePrice, supplier){
        this.#id = id;
        this.#name = name;
        this.#category = category;
        this.#description = description;
        this.#unitPrice = unitPrice;
        this.#salePrice = salePrice;
        this.#supplier = supplier;
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

    getSupplier() {
        return this.#supplier;
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

    setSupplier(value) {
        this.#supplier = value;
    }
}