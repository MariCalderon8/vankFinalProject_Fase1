export class User{
    #name;
    #idType;
    #id;
    #email;
    #password;
    #tel;
    #address;
    #inventory;
    #billHistory;

    constructor(name, idType, id, email, password, tel, address){
        this.#name = name;
        this.#idType = idType;
        this.#id = id;
        this.#email = email;
        this.#password = password; //SI QUEDA TIEMPO DE PRONTO HACER HASHEARLA
        this.#tel = tel;
        this.#address = address;
        this.#inventory = [];
        this.#billHistory = [];
    }

    
    // Método para convertir la instancia a un objeto serializable
    toJSON() {
        return {
            name: this.#name,
            idType: this.#idType,
            id: this.#id,
            email: this.#email,
            password: this.#password,
            tel: this.#tel,
            address: this.#address,
            inventory: this.#inventory,
            billHistory: this.#billHistory
        };
    }

    static fromJSON(json) {
        const user = new User(
            json.name, 
            json.idType, 
            json.id, 
            json.email, 
            json.password, 
            json.tel, 
            json.address
        );
        
        user.#inventory = json.inventory || [];
        user.#billHistory = json.billHistory || [];
        
        return user;
        
    }


    // Getters
    getName() {
        return this.#name;
    }

    getIdType() {
        return this.#idType;
    }

    getId() {
        return this.#id;
    }

    getEmail() {
        return this.#email;
    }

    getPassword() {
        return this.#password;
    }

    getTel() {
        return this.#tel;
    }

    getAddress() {
        return this.#address;
    }

    getInventory() {
        return this.#inventory;
    }

    getBillHistory() {
        return this.#billHistory;
    }

    // Setters
    setName(name) {
        this.#name = name;
    }

    setIdType(idType) {
        this.#idType = idType;
    }

    setId(id) {
        this.#id = id;
    }

    setEmail(email) {
        this.#email = email;
    }

    setPassword(password) {
        this.#password = password;
    }

    setTel(tel) {
        this.#tel = tel;
    }

    setAddress(address) {
        this.#address = address;
    }


    // GESTIÓN PRODUCTOS

    getProductById(id) {
        return this.#inventory.find(product => product.id == id);
    }

    addNewProduct(product) {
        this.#inventory.push(product);
    }

    updateProduct(newProduct) {
        let existingProduct = this.getProductById(newProduct.id);
        if(existingProduct){
            // ACTUALIZACIÓN DE LOS ATRIBUTOS
        } 
    }

    deletProduct(id) {
        let product = this.getProductById(id);
        this.#inventory.splice(this.#inventory.indexOf(product), 1);
    }


    // GESTIÓN HISTORIAL DE FACTURAS

    getBillById(id) {
        return this.#billHistory.find(bill => bill.id == id);
    }

    addNewBill(bill) {
        this.#billHistory.push(bill);
    }

    deleteBill(id) {
        let bill = this.getBillById(id);
        this.#billHistory.splice(this.#billHistory.indexOf(bill), 1);
    }
    
}