//models/client

export class Client{
    #idType;
    #id;
    #name;
    #email;
    #address;
    #phone;

    constructor(id, name, idType, email, address, phone) {
        this.#id = id; 
        this.#name = name; 
        this.#idType = idType; 
        this.#email = email;
        this.#address = address;
        this.#phone = phone; 
    }
    
    // Convertir la instancia a un objeto JSON
    toJSON() {
        return {
            id: this.#id,
            name: this.#name,
            idType: this.#idType,
            email: this.#email,
            address: this.#address,
            phone: this.#phone,
        };
    }

    // Crear una instancia de Client desde un JSON
    static fromJSONToClient(json) {
        return new Client(
            json.id, 
            json.name, 
            json.idType, 
            json.email, 
            json.address, 
            json.phone
        );
    }

    //Getters
    getId() {
        return this.#id;
    }

    getName() {
        return this.#name;
    }

    getIdType() {
        return this.#idType;
    }

    getEmail() {
        return this.#email;
    }

    getAddress() {
        return this.#address;
    }

    getPhone() {
        return this.#phone;
    }

    // Setters
    setId(id) {
        this.#id = id;
    }

    setName(name) {
        this.#name = name;
    }

    setIdType(idType) {
        this.#idType = idType;
    }

    setEmail(email) {
        this.#email = email;
    }

    setAddress(address) {
        this.#address = address;
    }

    setPhone(phone) {
        this.#phone = phone;
    }
}