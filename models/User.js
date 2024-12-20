//models/user.js
import { Product } from "./Product.js";
import { Client } from "./Client.js";
import { Sale } from "./Sale.js";

export class User {
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

    constructor(name, idType, id, email, password, tel, address) {
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
        if (existingProduct) {
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
    }

    // GESTIÓN HISTORIAL DE FACTURAS

    getSaleById(id) {
        return this.#saleHistory.find(sale => sale.getId() == id);;
    }

    addNewSale(sale) {
        this.#billNum++;
        sale.setId(this.#billNum);
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


    // ESTADÍSITCAS 

    // General

    getTotalSales() {
        return this.#saleHistory.reduce((total, sale) => {
            sale.getProducts().forEach(detail => {
                total += (detail.amount * detail.product.getSalePrice());
            });
            return total;
        }, 0);
    }

    getTotalProfit() {
        const result = this.#saleHistory.reduce((total, sale) => {
            sale.getProducts().forEach(detail => {
                total += (detail.amount * (detail.product.getSalePrice() - detail.product.getUnitPrice()));
            });
            return total;
        }, 0);
        return result
    }

    getMonthSales(){
        const actualDate = new Date();
        return this.#saleHistory.reduce((total, sale) => {
            const issueDate = new Date(sale.getIssueDate());
            if(issueDate.getMonth() == actualDate.getMonth() && issueDate.getFullYear() == actualDate.getFullYear()){
                sale.getProducts().forEach(detail => {
                    total += (detail.amount * detail.product.getSalePrice());
                });
            }
            return total;
        }, 0);
    }

    getMonthUnitsSold(){
        const actualDate = new Date();
        return this.#saleHistory.reduce((total, sale) => {
            const issueDate = new Date(sale.getIssueDate());
            if(issueDate.getMonth() == actualDate.getMonth() && issueDate.getFullYear() == actualDate.getFullYear()){
                sale.getProducts().forEach(detail => {
                    total += detail.amount;
                });
            }
            return total;
        }, 0);
    }


    // By product

    getSoldUnitsByProduct(idProduct) {
        return this.#saleHistory.reduce((total, sale) => {
            sale.getProducts().forEach(detail => {
                if (detail.product.getId() == idProduct) {
                    total += detail.amount
                }
            });
            return total;
        }, 0);
    }

    getTotalSalesByProduct(idProduct) {
        return this.#saleHistory.reduce((total, sale) => {
            sale.getProducts().forEach(detail => {
                if (detail.product.getId() == idProduct) {
                    total += (detail.amount * detail.product.getSalePrice());
                }
            });
            return total;
        }, 0);
    }

    getTotalProfitByProduct(idProduct) {
        let total = this.#saleHistory.reduce((total, sale) => {
            sale.getProducts().forEach(detail => {
                if (detail.product.getId() == idProduct) {
                    total += (detail.amount * (detail.product.getSalePrice() - detail.product.getUnitPrice()));
                }
            });
            return total;
        }, 0);
        return total
    }

    getProfitPercentByProduct(idPrduct) {
        let result = (this.getTotalProfitByProduct(idPrduct) * 100 / this.getTotalProfit()).toFixed(2);
        return result;
    }

    isBestSellingProduct(product) {
        if (this.#saleHistory.length > 0) {
            let topSale = { product: null, unitsSold: 0 };
            const productUnits = this.getSoldUnitsByProduct(product.getId());
            this.#inventory.forEach(currentProduct => {
                const unitsSold = this.getSoldUnitsByProduct(currentProduct.getId());
                if (unitsSold > topSale.unitsSold) {
                    topSale = { product: currentProduct, unitsSold: unitsSold }
                }
            })

            return product.getId() == topSale.product.getId() || productUnits == topSale.unitsSold

        }
        return false;
    }

    getProductTotalSalesByMonth(month, idProduct) {
        const currentDate = new Date();
        return this.#saleHistory.reduce((total, sale) => {
            const saleDate = new Date(sale.getIssueDate());
            if (saleDate.getMonth() === month && saleDate.getFullYear() == currentDate.getFullYear()) {
                sale.getProducts().forEach(detail => {
                    if(detail.product.getId() == idProduct){
                        total += (detail.amount * detail.product.getSalePrice());
                    }
                });
            }
            return total;
        }, 0);

    }

    //GRAFICOS HOME
    getTotalSalesByMonth(month) {
        const currentDate = new Date();
        return this.#saleHistory.reduce((total, sale) => {
            const saleDate = new Date(sale.getIssueDate());
            if (saleDate.getMonth() + 1 === month && saleDate.getFullYear() == currentDate.getFullYear()) {
                sale.getProducts().forEach(detail => {
                    total += detail.amount;
                });
            }
            return total;
        }, 0);

    }

    getDailyProfitsForMonth(month) {

        // Calcular días en el mes
        const daysInMonth = new Date(new Date().getFullYear(), month, 0).getDate();
        const profits = Array(daysInMonth).fill(0);
        const currentDate = new Date();
        this.#saleHistory.forEach(sale => {
            const saleDate = new Date(sale.getIssueDate());
            if (saleDate.getMonth() + 1 === month && saleDate.getFullYear() == currentDate.getFullYear()) {
                const day = saleDate.getDate();
                sale.getProducts().forEach(detail => {
                    const profit = detail.amount * (detail.product.getSalePrice() - detail.product.getUnitPrice());
                    profits[day - 1] += profit;
                });
            }
        });
        return profits;
    }

    getProductProfits() {
        const productProfits = {};
        const totalProfit = this.getTotalProfit();
        console.log(totalProfit);
        if (totalProfit === 0) return {};
    
        this.#inventory.forEach(product => {
            productProfits[product.getId()] = this.getProfitPercentByProduct(product.getId())
            console.log(this.getProfitPercentByProduct(product.getId()));
        });
    
        return productProfits;
    }

}