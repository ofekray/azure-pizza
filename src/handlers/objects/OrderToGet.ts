import { Address } from "./Address";
import { Customer } from "./Customer";
import { Topping } from "../../types/Topping";
import { Status } from "../../types/Status";
import { OrderData } from "../../business-logic/objects/OrderData";

export class OrderToGet {
    id!: string;
    customer!: Customer;
    address!: Address;
    toppings!: Topping[];
    status!: Status;

    static from(orderData: OrderData): OrderToGet {
        const result: OrderToGet = new OrderToGet();
        result.id = orderData.id;
        result.customer = Customer.from(orderData.customer);
        result.address = Address.from(orderData.address);
        result.toppings = orderData.toppings;
        result.status = orderData.status;
        return result;
    }
}