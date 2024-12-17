//models/user.js
import { Product } from "./Product.js";
import { Client } from "./Client.js";
import { Sale } from "./Sale.js";

export class User{
    #name;
    #idType;
    #id;
    #email;
    #password;
    #tel;
    #address;
    #billNum;
    #inventory;
    #saleHistory;
    #clients;

    constructor(name, idType, id, email, password, tel, address){
        this.#name = name;
        this.#idType = idType;
        this.#id = id;
        this.#email = email;
        this.#password = password; //SI QUEDA TIEMPO DE PRONTO HACER HASHEARLA
        this.#tel = tel;
        this.#address = address;
        this.#billNum = 0;
        this.#inventory = [];
        this.#saleHistory = [];
        this.#clients = [];
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
            billNum: this.#billNum,
            inventory: this.#inventory,
            saleHistory: this.#saleHistory,
            clients: this.#clients
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
            json.address,
        );
        user.#billNum = json.billNum;
        
        const inventory = json.inventory || [];
        user.#inventory = inventory.map(product => Product.fromJSONtoProduct(product)); // Convierte todos los objetos del arreglo inventory en instancias de Product

        const saleHistory = json.saleHistory || [];
        user.#saleHistory = saleHistory.map(sale => Sale.fromJSONToSale(sale));
        console.log(saleHistory);

        const clients = json.clients || [];
        user.#clients = clients.map(client => Client.fromJSONToClient(client));
        
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

    getSaleHistory() {
        return this.#saleHistory;
    }

    getClients() {
        return this.#clients;
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

    setBillNum(billNum) {
        this.#billNum = billNum;
    }


    // GESTIÓN PRODUCTOS

    getProductById(id) {
        return this.#inventory.find(product => product.getId() == id);
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
        const index = this.#inventory.findIndex(product => product.getId() === id); 
        if (index === -1) {
            console.error(`Producto con ID ${id} no encontrado`);
            return;
        }
        this.#inventory.splice(index, 1); // Elimina el producto
        console.log(`Producto con ID ${id} eliminado correctamente`);
    }

    // GESTIÓN HISTORIAL DE FACTURAS

    getSaleById(id) {
        return this.#saleHistory.find(sale => sale.id == id);
    }

    addNewSale(sale) {
        this.#billNum++;
        sale.setId(this.#billNum);
        console.log(`Antes de agregar: ${sale.getId()} ${sale.getExpirationDate()}`);
        this.#saleHistory.push(sale.toJSON());
    }

    deleteSale(id) {
        let sale = this.getSaleById(id);
        this.#saleHistory.splice(this.#saleHistory.indexOf(sale), 1);
    }

    //GESTION DE CLIENTES
    getClientById(id) {
        return this.#clients.find(client => client.getId() === id);
    }

    addNewClient(client) {
        this.#clients.push(client);
    }

    updateClient(updatedClient) {
        const index = this.#clients.findIndex(client => client.getId() === updatedClient.getId());
        if (index !== -1) {
            this.#clients[index] = updatedClient;  // Actualiza el cliente
        }
    }

    deleteClient(id) {
        const index = this.#clients.findIndex(client => client.getId() === id);
        if (index !== -1) {
            this.#clients.splice(index, 1);  // Elimina el cliente
        }
    }
    
}